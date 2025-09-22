import { makeAutoObservable, runInAction, reaction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import api from '../api/api';
import useSvgParser from "../hooks/useSvgParser";
import { Alert } from "react-native";
import fetchAnimation from "../screens/Main/FetchLottie";
import { GetChildren } from "../api/methods/children/children";
import { GetCategories } from "../api/methods/market/categories";
import { GetItems } from "../api/methods/market/items";
import { GetConversation } from "../api/methods/chat/conversation";
import { GetAttributes } from "../api/methods/attributes/attributes";

class Store {

    avatars = null;
    attributes = null;
    market = null;
    loading = true;
    token = null;
    playingChildId = null;
    musicPlaying = true;
    musicTurnedOn = true;
    breakMusicPlaying = false;
    microOn = false;
    connectionState = false;
    messages = [];
    language = null;
    holdEmail = null;
    playinVoiceMessageId = null;                                      
    voiceInstructions = true;
    wisySpeaking = false;
    wisyMenuText = null;
    isFirstOpening = false;
    isBlacked = false;
    newChildren = [];
    loadingMarketItems = false;

    constructor() {
        makeAutoObservable(this);
        this.initializeStore();

        reaction(
            () => this.language,
            async () => {
                const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

                if (this.language !== null) {
                    if (this.connectionState && this.playingChildId !== null && this.token !== null) {
                        await this.loadAttributes();
                        await delay(1000);

                        await delay(2000);
                    }
    
                    await this.loadAddChildUI();
                    await delay(2000);
                }
            }
        );

        reaction(
            () => ({
                connectionState: this.connectionState,
                playingChildId: this.playingChildId,
                token: this.token
            }),
            async ({ connectionState, playingChildId, token }) => {
                const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                if (connectionState && playingChildId !== null && token !== null) {
                    await this.loadMessages();
                } else if (!connectionState && playingChildId !== null && token !== null) {
                    await this.setLoadingCats(true)
                } else if (this.connectionState && this.token !== null) {
                    await this.loadMarket();
                    await delay(2000);
                }
            }
        );
    }             

    async initializeStore() {
        await this.determineConnection();
    }

    async loadData() {
        try {
            await this.loadDataFromStorageToken();
            await this.loadDataFromStorageLanguage();
            await this.loadDataFromStorageVoiceInstructions();
            await this.loadDataFromStorageBackgroundMusic();
            await this.loadNewChildren()
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    async loadSlides() {
        if (this.connectionState) {
            try {
                const request = await api.getSlides(this.language)
                runInAction(() => {
                    this.slides = request;
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    async loadMarket() {
        if(this.connectionState) {
            try {
                const request = await GetCategories();
                runInAction(() => {
                    this.market = request.data?.data?.map((market: any) => ({
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
        if (!this.connectionState) return;
    
        try {
    
            const marketItemsPromises = this.market.map(async (category: any) => {
                try {
                    const response = await GetItems(category.id);
    
                    return { id: category.id, items: response.data?.data };
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
                        category.items = items;
                    }
                });
            });
    
            await this.loadMarketItemUri(); // отдельно загружаем URI
        } catch (error) {
            console.log(error);
        }
    }      

    async loadMarketItemUri() {
        try {
            runInAction(() => {
                this.loadingMarketItems = true;
            });
            const fetchPromises = this.market.flatMap((category: any) => {
                return category.items?.map(async (item: any) => {
                    if (item.animation) {
                        try {
                            const uri = await fetchAnimation(item.animation);
                            item.animation = uri || item.animation;
                        } catch (err) {
                            console.log(`Ошибка загрузки animation ${item.id}:`, err);
                        }
                    }
                }) || [];
            });
    
            await Promise.all(fetchPromises);
        } catch (error) {
            console.log('Ошибка при загрузке URI для market items:', error);
        } finally {
            runInAction(() => {
                this.loadingMarketItems = false;
            });
        }
    }

    async loadAttributes() {
        if (this.connectionState) {
            try {
                const response = await GetAttributes();
    
                const parsedAttributes = await Promise.all(
                    response.data.data?.map(async (item) => {
                        if (item.image.endsWith('.svg')) {
                            const parsedSvg = await useSvgParser(item?.image);
                            return { ...item, svgData: parsedSvg };
                        }
                        return item;
                    })
                );
    
                runInAction(() => {
                    this.attributes = parsedAttributes;
                });
            } catch (error) {
                throw error
            }
        } else {
            throw 'No internet conection'
        }
    }

    async loadDataFromStorageToken() {
        const usertoken = await this.loadDataFromStorage('token');
        runInAction(() => {
            this.token = usertoken
        });
        return this.token
    }

    async loadDataFromStorageLanguage() {
        const lang = await this.loadDataFromStorage('lang');
        runInAction(() => {
            if (lang) {
                this.language = lang
            }
        });
    }

    async loadDataFromStorageVoiceInstructions() {
        const voice = await this.loadDataFromStorage('voiceInstruction');
        runInAction(() => {
            if (voice !== null && voice !== undefined) {
                this.voiceInstructions = voice
            }
        });
        return this.voiceInstructions
    }

    async loadDataFromStorageBackgroundMusic() {
        const music = await this.loadDataFromStorage('backgroundMusic');
        runInAction(() => {
            if (music !== null && music !== undefined) {
                this.musicTurnedOn = music
            }
        });
    }

    async loadDataFromStorageIsFirstOpening() {
        const isFirstOpeningState = await this.loadDataFromStorage('isFirstOpening');
        const isBlacked = await this.loadDataFromStorage('isBlacked');
        runInAction(() => {
            if (isFirstOpeningState !== null && isFirstOpeningState !== undefined && isBlacked !== null && isBlacked !== undefined) {
                this.isFirstOpening = isFirstOpeningState
                this.isBlacked = isBlacked
            }
        });
    }

    async loadDataFromStorageChildren() {
        try {
            if (this.connectionState && this.token != null) {
                try {
                    const children = await GetChildren()
                    this.setChildren(children.data)
                } catch (error) {
                    console.log(error)
                    throw error
                }
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

    async loadMessages() {
        if (this.connectionState) {
            try {
                runInAction(() => {
                    this.messages = [];
                });
                const response = await GetConversation(this.playingChildId?.id);

                // console.log(this.playingChildId?.id)
    
                const formattedMessages = response.data?.data?.map(item => {
                    // console.log(item?.is_from_bot);
                
                    return {
                        type: 'text',
                        text: item.content,
                        author: item.is_from_bot ? 'MyWisy' : 'You'
                    };
                });
    
                runInAction(() => {
                    this.messages = formattedMessages.reverse();
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    async setMessages(message: any) {
        runInAction(() => {
            if (message.type == 'text' && message.author ==='MyWisy') {
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

        if (this.connectionState) {
            await this.loadData();
        } else {
            Alert.alert('Something went wrong', 'check your internet connection and try again later', [
                {
                    text: 'Retry',
                    onPress: async () => await this.determineConnection()
                },
                {
                    text: 'Ok',
                    style: 'cancel'
                }
            ])
        }
    } 

    async setToken(token: string) {
        runInAction(() => {
            this.token = token;
        })
        if (token !== null) {
            await AsyncStorage.setItem('token', JSON.stringify(token));
        } else {
            await AsyncStorage.removeItem('token');
        }
    }

    async setLanguage(language: string) {
        runInAction(() => {
            this.language = language;
        });
        if (language !== null) {
            await AsyncStorage.setItem('lang', JSON.stringify(language));
        } else {
            await AsyncStorage.removeItem('lang');
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

    async setIsFirstOpening(bool: boolean) {
        runInAction(() => {
            this.isFirstOpening = bool;
        });
    }

    async setNewChildren(id: any) {
        const updated = [...this.newChildren, id];
      
        runInAction(() => {
            this.newChildren = updated;
        });
        
        try {
            await AsyncStorage.setItem('newChildren', JSON.stringify(updated));
        } catch (e) {
            console.log('Ошибка сохранения в AsyncStorage:', e);
        }
    }

    async removeNewChild(id: any) {
        const updated = this.newChildren.filter(item => item !== id);

        runInAction(() => {
            this.newChildren = updated;
        });

        try {
            await AsyncStorage.setItem('newChildren', JSON.stringify(updated));
        } catch (e) {
            console.log('Ошибка сохранения в AsyncStorage при удалении:', e);
        }
    }

    async loadNewChildren() {
        try {
            const json = await AsyncStorage.getItem('newChildren');
            const parsed = json != null ? JSON.parse(json) : [];
    
            runInAction(() => {
                this.newChildren = parsed;
            });
        } catch (e) {
            console.log('Ошибка загрузки newChildren из AsyncStorage:', e);
        }
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

    async setMusicTurnedOn(bool: boolean) {
        runInAction(() => {
            this.musicTurnedOn = bool;
        });
        if (bool !== null) {
            await AsyncStorage.setItem('backgroundMusic', JSON.stringify(bool));
        } else {
            await AsyncStorage.removeItem('backgroundMusic');
        }
    }

    async setLoadingCats(bool: boolean) {
        runInAction(() => {
            this.loadingCats = bool;
        });
    }

    async setWisySpeaking(bool: boolean) {
        runInAction(() => {
            this.wisySpeaking = bool;
        });
    }

    async setVoiceInstructions(bool: boolean) {
        runInAction(() => {
            this.voiceInstructions = bool;
        });
        if (bool !== null) {
            await AsyncStorage.setItem('voiceInstruction', JSON.stringify(bool));
        } else {
            await AsyncStorage.removeItem('voiceInstruction');
        }
    }

    async setIsBlacked(bool: boolean) {
        runInAction(() => {
            this.isBlacked = bool;
        });
    }

    async setHoldEmail(email: string) {
        runInAction(() => {
            this.holdEmail = email;
        });
    }
    
    async setWisyMenuText(text: string) {
        runInAction(() => {
            this.wisyMenuText = text;
        });
    }
}

export default new Store();