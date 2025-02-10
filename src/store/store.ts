import { autorun, makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import api from '../api/api';
import useSvgParser from "../hooks/useSvgParser";

class Store {

    slides = null;
    avatars = null;
    attributes = null;
    market = null;
    addchildui = null;
    loading = true;
    token = null;
    children = [];
    playingChildId = null;
    musicPlaying = true;
    breakMusicPlaying = false;
    microOn = false;
    connectionState = false;
    categories = [];
    messages = [];
    language = 'en';
    holdEmail = null;
    playinVoiceMessageId = null;

    constructor() {
        makeAutoObservable(this);
        this.initializeStore();

        autorun(() => {
            if (this.connectionState && this.playingChildId !== null && this.token !== null) {
                this.loadCategories();
                this.loadMessages()
            }
        });
    }

    async initializeStore() {
        await this.determineConnection()
        await this.loadData()
    }

    async loadAddChildUI() {
        if (this.connectionState) {
            try {
                const request = await api.getAddChildUI()
                runInAction(() => {
                    this.addchildui = request;
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    async loadSlides() {
        if (this.connectionState) {
            try {
                const request = await api.getSlides()
                runInAction(() => {
                    this.slides = request;
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    async loadAvatars() {
        if (this.connectionState) {
            try {
                const request = await api.getAvatars()
                runInAction(() => {
                    this.avatars = request;
                })
            } catch (error) {
                
            }
        }
    }

    async loadMarket() {
        if(this.connectionState) {
            try {
                const request = await api.getMarketCategories(this.token);
                runInAction(() => {
                    this.market = request.map((market: any) => ({
                        ...market,
                        items: [],
                    }));
                });

                await this.loadMarketItems()
            } catch (error) {
                console.log(error)
            }
        }
    }

    async loadMarketItems() {
        if (this.connectionState) {
            try {
                const marketItemsPromises = this.market.map(async (category: any) => {
                    try {
                        const response = await api.getMarketItems({ id: category.id, token: this.token });
    
                        // Просто возвращаем данные, не парся анимации
                        return { id: category.id, items: response };
                    } catch (error) {
                        console.log(`Ошибка загрузки элементов для категории ${category.id}:`, error);
                        return { id: category.id, items: [] };
                    }
                });
    
                const marketItems = await Promise.all(marketItemsPromises);
    
                runInAction(() => {
                    marketItems.forEach(({ id, items }) => {
                        const category = this.market.find((cat: any) => cat.id === id);
                        if (category) {
                            category.items = items; // Заменяем items для категории
                        }
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
    
    
    async loadAttributes() {
        if (this.connectionState) {
            try {
                const request = await api.getAttributes(this.token);
    
                // Асинхронно загружаем и парсим SVG для каждого элемента с .svg
                const parsedAttributes = await Promise.all(
                    request.map(async (item) => {
                        if (item.image.endsWith('.svg')) {
                            const parsedSvg = await useSvgParser(item.image);
                            return { ...item, svgData: parsedSvg };
                        }
                        return item; // Оставляем без изменений, если не SVG
                    })
                );
    
                runInAction(() => {
                    this.attributes = parsedAttributes;
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
    

    async loadData() {
        try {
            await this.loadDataFromStorageToken();
            await this.loadDataFromStorageChildren()
            await this.loadSlides();
            await this.loadAddChildUI();
            await this.loadMarket();
            await this.loadAttributes();
            await this.loadAvatars();
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false 
            });
        }
    }

    async loadDataFromStorageToken() {
        const usertoken = await this.loadDataFromStorage('token');
        runInAction(() => {
            this.token = usertoken
        });
        return this.token
    }

    async loadDataFromStorageChildren() {
        try {
            if (this.connectionState && this.token != null) {
                const children = await api.getChildren(this.token)
                this.setChildren(children.data)
            } else if (!this.connectionState) {
                const children = await this.loadDataFromStorage('children');
                runInAction(() => {
                    this.children = children
                });
            }
        } catch (error) {
            console.log(error);   
        }
    }

    async loadCategories() {
        if (this.connectionState) {
            try {
                const request = await api.getCategories(this.token);
    
                // Сохраняем категории в `this.categories`
                runInAction(() => {
                    this.categories = request.data.map(category => ({
                        ...category,
                        collections: [], // Добавляем пустое поле `collections` для каждой категории
                    }));
                });
    
                // Загружаем коллекции для каждой категории
                await this.loadCollections();
            } catch (error) {
                console.log(error);
            }
        }
    }
    
    async loadCollections() {
        if (this.connectionState) {
            try {
                // Создаём массив запросов для загрузки коллекций по каждой категории
                const collectionsRequests = this.categories.map(async (category) => {
                    const collectionsResponse = await api.getCollections({ id: category.id, child_id: this.playingChildId, token: this.token });
    
                    // Загружаем подколлекции и задачи для каждой коллекции
                    const collectionsWithSubCollections = await Promise.allSettled(
                        collectionsResponse.data.map(async (collection) => {
                            const subCollectionsResponse = await api.getSubCollections({ id: collection.id, child_id: this.playingChildId, token: this.token });
    
                            const subCollectionsWithTasks = await Promise.allSettled(
                                subCollectionsResponse.data.map(async (subCollection) => {
                                    const tasksResponse = await api.getTasks({ id: subCollection.id, token: this.token });
                                    return {
                                        ...subCollection,
                                        tasks: tasksResponse,
                                    };
                                })
                            );

                            return {
                                ...collection,
                                breaks: subCollectionsResponse?.dynamicBreakGroups,
                                available_sub_collections: subCollectionsResponse?.available_sub_collections,
                                sub_collections: subCollectionsWithTasks
                                    .filter(result => result.status === 'fulfilled')
                                    .map(result => result.value),
                            };
                        })
                    );
    
                    return collectionsWithSubCollections
                        .filter(result => result.status === 'fulfilled')
                        .map(result => result.value);
                });
    
                const allCollectionsResults = await Promise.all(collectionsRequests);
    
                runInAction(() => {
                    this.categories = this.categories.map((category, index) => ({
                        ...category,
                        collections: allCollectionsResults[index],
                    }));
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async loadMessages() {
        if (this.connectionState) {
            try {
                const response = await api.getMessages(this.playingChildId.id, this.token);
                // console.log(response)
    
                const formattedMessages = response.data.map(item => ({
                    type: 'text',
                    text: item.content,
                    author: item.is_from_bot ? 'MyWisy' : 'You' // Используем is_from_bot для определения автора
                }));
    
                runInAction(() => {
                    this.messages = formattedMessages.reverse(); // Реверсируем список сообщений
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
    

    async setMessages(message: any) {
        runInAction(() => {
            if (message.type === 'text' && message.author === 'MyWisy') {
                this.messages = [
                    { type: message.type, text: message.text, author: message.author },
                    ...this.messages.slice(1),
                ];
            } else {
                this.messages = [{ type: message.type, text: message.text, author: message.author}, ...this.messages]
            }
        })
    }

    async loadDataFromStorage(key: any) {
        try {
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Ошибка загрузки данных из AsyncStorage (${key}):`, error);
            return null;
        }
    }

    async determineConnection() {
        const state = await NetInfo.fetch();
        runInAction(() => {
            this.connectionState = state.isConnected;
        });

        NetInfo.addEventListener((state) => {
            runInAction(() => {
                this.connectionState = state.isConnected;
            });
        });
    }

    async completeGame(collectionId: any, subCollectionId: any, subCollectionStarId: any, earnedStars: number, collectionIndex: number) {
        try {
            const collections = this.categories[collectionId].collections;
            const collection = this.categories[collectionId].collections[collectionIndex];

            runInAction(() => {
                collection.available_sub_collections = [...collection.available_sub_collections, subCollectionId];
            })

            for (let i = 0; i < collections.length; i++) {
                const subCollection = collections[i].sub_collections.find(sub => sub.id === subCollectionStarId);
                
                if (subCollection) {
                    runInAction(() => {
                        subCollection.stars.earned = earnedStars;
                    });
                    break;
                }
            }

            runInAction(() => {
                collection.stars.earned += earnedStars;
            });
    
        } catch (error) {
            console.error("Ошибка завершения игры:", error);
        }
    }

    async setToken(token: string) {
        runInAction(() => {
            this.token = token;
        })
        if (token !== null) {
            await AsyncStorage.setItem('token', JSON.stringify(token));
            //console.log(token)
        } else {
            await AsyncStorage.removeItem('token');
        }
    }

    async setPlayingChildId(id: any) {
        runInAction(() => {
            this.playingChildId = id;
        });
    }

    async setMarket(market: any) {
        runInAction(() => {
            this.market = market;
        });
    }

    async setPlayingVoiceMessageId(id: any) {
        runInAction(() => {
            this.playinVoiceMessageId = id;
        });
    }

    async stopAllPlayingVoiceMessages() {
        runInAction(() => {
            this.playinVoiceMessageId = null;
        });
    }

    async setPlayingChildStars(stars: number) {
        runInAction(() => {
            this.playingChildId.stars += stars 
        })
    }

    async setChildren(children: any) {
        runInAction(() => {
            this.children = children
        })
        await AsyncStorage.setItem('children', JSON.stringify(children));
    }

    async setPlayingMusic(bool: boolean) {
        runInAction(() => {
            this.musicPlaying = bool;
        });
    }

    async setBreakPlayingMusic(bool: boolean) {
        runInAction(() => {
            this.breakMusicPlaying = bool;
        });
    }

    async setMicroOn(bool: boolean) {
        runInAction(() => {
            this.microOn = bool;
        });
    }

    async setLanguage(language: string) {
        runInAction(() => {
            this.language = language;
        });
    }

    async setHoldEmail(email: string) {
        runInAction(() => {
            this.holdEmail = email;
        });
    }

}

export default new Store();