import { autorun, makeAutoObservable, runInAction, reaction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import api from '../api/api';
import useSvgParser from "../hooks/useSvgParser";
import { Alert } from "react-native";

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
    musicTurnedOn = true;
    breakMusicPlaying = false;
    microOn = false;
    connectionState = false;
    categories = [];
    messages = [];
    language = null;
    holdEmail = null;
    playinVoiceMessageId = null;                                      
    voiceInstructions = true;
    wisySpeaking = false;
    wisyMenuText = null;
    loadingCats = false;

    tasks = null;
    subCollections = [];
    toPutNewSubCollections = true;

    isSubCollectionsLoading = false;
    subCollectionsQueue: (() => Promise<void>)[] = [];
    
    collectionQueue: (() => Promise<void>)[] = [];
    isCollectionLoading = false;

    runNextSubCollectionsTask() {
        if (this.subCollectionsQueue.length === 0 || this.isSubCollectionsLoading) {
            return;
        }
    
        const nextTask = this.subCollectionsQueue.shift();
        if (nextTask) {
            nextTask();
        }
    }

    runNextCollectionTask() {
        if (this.collectionQueue.length === 0 || this.isCollectionLoading) {
            return;
        }
    
        const nextTask = this.collectionQueue.shift();
        if (nextTask) {
            nextTask();
        }
    }

    async enqueueGetAndProcessSubCollections(params) {
        return new Promise<void>((resolve) => {
            const task = async () => {
                try {
                    runInAction(() => {
                        this.isSubCollectionsLoading = true;
                    })
                    await this.getAndProcessSubCollections(params);
                } catch (e) {
                    console.error('[Очередь] Ошибка в задаче:', e);
                } finally {
                    resolve();
                    runInAction(() => {
                        this.isSubCollectionsLoading = false;
                    })
                    this.runNextSubCollectionsTask(); // запуск следующей
                }
            };
    
            this.subCollectionsQueue.push(task);
    
            if (!this.isSubCollectionsLoading) {
                this.runNextSubCollectionsTask();
            }
        });
    }

    async enqueueGetCollection(params) {
        return new Promise<void>((resolve) => {
            const task = async () => {
                try {
                    runInAction(() => {
                        this.isCollectionLoading = true;
                    })
                    await this.getCollection(params);
                } catch (e) {
                    console.error('[Очередь] Ошибка в getCollection:', e);
                } finally {
                    resolve();
                    runInAction(() => {
                        this.isCollectionLoading = false;
                    })
                    this.runNextCollectionTask();
                }
            };
    
            this.collectionQueue.push(task);
    
            if (!this.isCollectionLoading) {
                this.runNextCollectionTask();
            }
        });
    }    

    constructor() {
        makeAutoObservable(this);
        this.initializeStore();

        reaction(
            () => this.language,
            async () => {
                const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

                if (this.language !== null) {
                    if (this.connectionState && this.playingChildId !== null && this.token !== null) {
                        console.log("ran collections inside lang reaction");
                        await this.loadAttributes();
                        await delay(1000);

                        await this.loadCategories();
                        await delay(2000);
                    }
    
                    await this.loadMarket();
                    await delay(2000);
    
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
              if (connectionState && playingChildId !== null && token !== null) {
                await this.loadCategories();
                await this.loadMessages();
              } else if (!connectionState && playingChildId !== null && token !== null) {
                await this.setLoadingCats(true)
              }
            }
          );
    }

    async getAndProcessSubCollections(params) {
        try {
            this.toPutNewSubCollections = true
            let allSubCollections: any[] = [];
            let breaks = [];
            let available_sub_collections = [];
    
            const category = this.categories.find(cat => cat.id === params.categoryId);
            const collection = category?.collections.find(col => col.id === params.collectionId);
            if (!collection) {
                console.warn('[Ошибка] Коллекция не найдена по ID:', params.collectionId);
                return;
            }
    
            if (collection.sub_collections.length === 0) {
                const res = await api.getSubCollections({
                    id: params.collectionId,
                    child_id: this.playingChildId,
                    token: this.token,
                    lang: this.language
                });
    
                breaks = res?.dynamicBreakGroups || [];
                available_sub_collections = res?.available_sub_collections || [];
                allSubCollections = res?.data?.map(sub => ({ ...sub })) || [];
    
                if (!Array.isArray(allSubCollections) || allSubCollections.length === 0) {
                    console.warn('[Ошибка] Пустой массив sub_collections из API или неверный формат');
                }

                if (!this.toPutNewSubCollections) return
    
                runInAction(() => {
                    collection.breaks = [...breaks];
                    collection.available_sub_collections = [...available_sub_collections];
                    collection.sub_collections = [...allSubCollections];
                });
            } else {
                console.log('вернул имеющиеся сабы с тасками')
                allSubCollections = collection.sub_collections;
                breaks = collection.breaks || [];
            }
    
            const subsToLoad = allSubCollections.filter(sub => !sub.tasks).slice(0, 3);

            if (!this.toPutNewSubCollections) return
    
            const subCollectionsWithTasks = await Promise.allSettled(
                subsToLoad.map(async (sub) => {
                    try {
                        const tasks = await api.getTasks({ id: sub.id, token: this.token }, this.language);
                        if (!tasks || !Array.isArray(tasks)) {
                            console.warn(`[Ошибка] Невалидный ответ задач для sub ID: ${sub.id}`);
                        }
                        return { ...sub, tasks };
                    } catch (err) {
                        console.error(`[Ошибка] Не удалось получить задачи для sub ID: ${sub.id}`, err);
                        return sub; // вернем без задач
                    }
                })
            );

            if (!this.toPutNewSubCollections) return
    
            subCollectionsWithTasks.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    const index = allSubCollections.findIndex(sub => sub.id === result.value.id);
                    if (index === -1) {
                        console.warn(`[Ошибка] Не найден sub ID: ${result.value.id} в общем списке при обновлении`);
                        return;
                    }
    
                    if (!result.value.tasks) {
                        console.warn(`[Ошибка] Подколлекция ${result.value.id} не получила задачи после API`);
                    }
    
                    allSubCollections[index] = result.value;
                } else {
                    console.error('[Ошибка] Promise не выполнен при загрузке задач:', result);
                }
            });

            if (!this.toPutNewSubCollections) return
    
            runInAction(() => {
                collection.sub_collections = [...allSubCollections];
            });
    
            let updatedSubCollections = allSubCollections.map(sub => ({
                ...sub,
                isLoading: !sub.tasks,
            }));
    
            const sortedBreaks = [...breaks]
                .filter(b => !b.is_hidden)
                .sort((a, b) => b.order - a.order);
    
            sortedBreaks.forEach(breakItem => {
                const insertIndex = updatedSubCollections.findIndex(
                    el => el.order_column >= breakItem.order
                );
    
                const targetId = insertIndex !== -1
                    ? updatedSubCollections[insertIndex].id
                    : breakItem.id;
    
                const existingBreak = updatedSubCollections.find(el => el.isBreak && el.id === breakItem.id);
    
                const prev = insertIndex > 0 ? updatedSubCollections[insertIndex - 1] : null;
                const next = insertIndex < updatedSubCollections.length - 1 ? updatedSubCollections[insertIndex] : null;
                const hasLoadingNeighbor = !!(prev?.isLoading || next?.isLoading);
    
                const breakElement = {
                    ...breakItem,
                    isBreak: true,
                    id: targetId,
                    breaks,
                    isLoading: hasLoadingNeighbor,
                };
    
                if (!existingBreak) {
                    updatedSubCollections = [
                        ...updatedSubCollections.slice(0, insertIndex + 1),
                        breakElement,
                        ...updatedSubCollections.slice(insertIndex + 1),
                    ];
                }
            });
    
            updatedSubCollections = updatedSubCollections.map(sub => ({
                ...sub,
                breaks,
            }));
    
            runInAction(() => {
                if (this.toPutNewSubCollections) {
                    this.subCollections = updatedSubCollections;
                } else {
                    console.log('не назначил саб коллекцию,но загрузил')
                }
            });
    
        } catch (error) {
            console.error('[Критическая ошибка] Ошибка в getAndProcessSubCollections:', error);
        }
    }
    
    async resetSubCollection() {
        runInAction(() => {
            this.toPutNewSubCollections = false;
            this.isSubCollectionsLoading = false;
            this.subCollections = [];
            this.subCollectionsQueue = [];
        });
    }

    async prepareTasksArray(itemId) {
        const tasksArray = this.subCollections
            .filter(item => item.tasks?.length > 0)
            .map(item => {
                const currentTaskIndex = item.tasks.findIndex(task => task.id === item.current_task_id);
    
                const tasks = item.tasks.map((task, index) => ({
                    ...task,
                    next_task_id: item.tasks[index + 1]?.id || null,
                }));
    
                return {
                    tasks,
                    current_task_id_index: currentTaskIndex !== -1 ? currentTaskIndex : 0,
                    id: item.id,
                    order: item?.order_column,
                    introAudio: item?.intro_speech_audio,
                    introText: item?.intro_speech,
                    tutorials: item?.tutorials,
                };
            });
    
        const clickedIndex = tasksArray.findIndex(obj => obj.id === itemId);
        const slicedTasks = tasksArray.slice(clickedIndex);
    
        this.setTasks(slicedTasks)
    }    
   
    async getCollection(params) {
        try {
            const collectionResponse = await api.getCollections({
                id: params.categoryId,
                child_id: this.playingChildId,
                token: this.token,
                lang: this.language
            });
    
            runInAction(() => {
                const categoryIndex = this.categories.findIndex(c => c.id === params.categoryId);
                if (categoryIndex !== -1) {
                    this.categories[categoryIndex] = {
                        ...this.categories[categoryIndex],
                        collections: collectionResponse.data.map(c => ({
                            ...c,
                            sub_collections: [],
                            breaks: [],
                            available_sub_collections: []
                        }))
                    };
                }
            });
        } catch (error) {
            console.log('Ошибка при получении коллекций:', error?.response?.data || error);
        }
    }

    async loadCategories() {
        if (this.connectionState) {
            try {
                runInAction(() => {
                    this.loadingCats = true
                })
                const request = await api.getCategories(this.token, this.language);
    
                runInAction(() => {
                    this.categories = request.data.map(category => ({
                        ...category,
                        collections: [],
                    }));
                });
    
            } catch (error) {
                console.log(error?.response?.data);
                runInAction(() => {
                    this.wisyMenuText = 'Probably server overload, try again later'
                })
            } finally {
                runInAction(() => {
                    this.loadingCats = false
                })
            }
        } else {
            runInAction(() => {
                this.wisyMenuText = 'Please check your internet connection and try again'
            })
        }
    }
    
    async loadNextTasksChunk(params) {
        try {
            const subCollectionsBefore = [...this.subCollections];
            const previousTasks = this.tasks || [];
    
            await this.getAndProcessSubCollections(params);
    
            const newSubWithTasks = this.subCollections.find(sub => {
                const before = subCollectionsBefore.find(prev => prev.id === sub.id);
            
                // Если раньше этой подколлекции не было — новая
                if (!before) return sub.tasks?.length;
            
                // Если была, но без тасков — теперь появились
                return !before.tasks?.length && sub.tasks?.length;
            });            
    
            if (!newSubWithTasks) return console.log('dinax');
    
            // Повторяем prepareTasksArray, но вручную
            const tasksArray = this.subCollections
                .filter(item => item.tasks?.length > 0)
                .map(item => {
                    const currentTaskIndex = item.tasks.findIndex(task => task.id === item.current_task_id);
    
                    const tasks = item.tasks.map((task, index) => ({
                        ...task,
                        next_task_id: item.tasks[index + 1]?.id || null,
                    }));
    
                    return {
                        tasks,
                        current_task_id_index: currentTaskIndex !== -1 ? currentTaskIndex : 0,
                        id: item.id,
                        order: item?.order_column,
                        introAudio: item?.intro_speech_audio,
                        introText: item?.intro_speech,
                        tutorials: item?.tutorials,
                    };
                });
    
            const clickedIndex = tasksArray.findIndex(obj => obj.id === newSubWithTasks.id);
            const slicedTasks = tasksArray.slice(clickedIndex);
    
            runInAction(() => {
                this.tasks = [...previousTasks, ...slicedTasks];
            });
    
        } catch (error) {
            console.error('Ошибка в loadNextTasksChunk:', error);
        }
    }               

    async initializeStore() {
        await this.determineConnection();
    }

    async loadData() {
        try {
            await this.loadDataFromStorageToken();
            await this.loadDataFromStorageLanguage();
            await this.loadDataFromStorageChildren();
            await this.loadDataFromStorageVoiceInstructions();
            await this.loadDataFromStorageBackgroundMusic();
            await this.loadAvatars();
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false; 
            });
        }
    }

    async loadAddChildUI() {
        if (this.connectionState) {
            try {
                const request = await api.getAddChildUI(this.language)
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
                const request = await api.getSlides(this.language)
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
                console.log(error)
            }
        }
    }

    async loadMarket() {
        if(this.connectionState) {
            try {
                const request = await api.getMarketCategories(this.token, this.language);
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
                        const response = await api.getMarketItems({ id: category.id, token: this.token, lang: this.language });
    
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
                const request = await api.getAttributes(this.token, this.language);
    
                const parsedAttributes = await Promise.all(
                    request.map(async (item) => {
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
        console.log(lang)
        runInAction(() => {
            if (lang) {
                this.language = lang
            }
        });
        return this.language;
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
        return this.musicTurnedOn
    }

    async loadDataFromStorageChildren() {
        try {
            if (this.connectionState && this.token != null) {
                try {
                    const children = await api.getChildren(this.token, this.language)
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
     
    async loadCollections() {
        if (!this.connectionState) {
            runInAction(() => {
                this.wisyMenuText = 'Please check your internet connection and try again';
            });
            return;
        }
    
        runInAction(() => {
            this.loadingCats = true; // Флаг загрузки
        });
    
        try {
            const collectionsRequests = this.categories.map(async (category) => {
                try {
                    const collectionsResponse = await api.getCollections({ id: category.id, child_id: this.playingChildId, token: this.token, lang: this.language });
    
                    const collectionsWithSubCollections = await Promise.allSettled(
                        collectionsResponse.data.map(async (collection) => {
                            try {
                                const subCollectionsResponse = await api.getSubCollections({ id: collection.id, child_id: this.playingChildId, token: this.token, lang: this.language });
                                
                                const subCollectionsWithTasks = await Promise.allSettled(
                                    subCollectionsResponse.data.map(async (subCollection) => {
                                        try {
                                            const tasksResponse = await api.getTasks({ id: subCollection.id, token: this.token }, this.language);
                                            return { ...subCollection, tasks: tasksResponse };
                                        } catch (error) {
                                            console.error(`Ошибка загрузки задач для ${subCollection.id}:`, error);
                                            return null; // Исключаем сломанные данные
                                        }
                                    })
                                );
    
                                return {
                                    ...collection,
                                    breaks: subCollectionsResponse?.dynamicBreakGroups,
                                    available_sub_collections: subCollectionsResponse?.available_sub_collections,
                                    sub_collections: subCollectionsWithTasks
                                        .filter(result => result.status === 'fulfilled' && result.value !== null)
                                        .map(result => result?.value),
                                };
                            } catch (error) {
                                console.error(`Ошибка загрузки подколлекций для ${collection.id}:`, error);
                                return null;
                            }
                        })
                    );
    
                    return collectionsWithSubCollections
                        .filter(result => result.status === 'fulfilled' && result.value !== null)
                        .map(result => result?.value);
                } catch (error) {
                    console.error(`Ошибка загрузки коллекций для категории ${category.id}:`, error);
                    return null;
                }
            });
    
            const allCollectionsResults = await Promise.all(collectionsRequests);
    
            // Проверяем, есть ли ошибки в загрузке
            const isEverythingLoaded = allCollectionsResults.every(result => result !== null);
    
            runInAction(() => {
                this.categories = this.categories.map((category, index) => ({
                    ...category,
                    collections: allCollectionsResults[index] || [],
                }));
    
                if (isEverythingLoaded) {
                    this.loadingCats = false; // Сбрасываем только если загрузка успешна
                }
            });
        } catch (error) {
            console.log(error?.response?.data?.message || "Unknown error occurred");
            runInAction(() => {
                this.wisyMenuText = 'Probably server overload, try again later';
            });
        }
    }

    async loadMessages() {
        if (this.connectionState) {
            try {
                const response = await api.getMessages(this.playingChildId.id, this.token, this.language );
    
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

    async completeGame(collectionId: any, subCollectionId: any, subCollectionStarId: any, earnedStars: number, collectionIndex: number) {
        try {
            const collections = this.categories.find(cat => cat.id === collectionId)?.collections;
            const collection = this.categories.find(cat => cat.id === collectionId)?.collections.find(col => col.id === collectionIndex);

            runInAction(() => {
                collection.available_sub_collections = [...collection?.available_sub_collections, subCollectionId];
            })

            for (let i = 0; i < collections.length; i++) {
                const subCollection = collections[i].sub_collections.find(sub => sub?.id === subCollectionStarId);
                
                if (subCollection) {
                    runInAction(() => {
                        subCollection.stars.earned += earnedStars;
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
    
    async completeTask(categoryId: any, collectionId: any, sub_collectionId: any, nextTaskId: any) {
        try {
            // Находим категорию по ID
            const category = this.categories.find(cat => cat.id === categoryId);
            if (!category) return console.log("Категория не найдена");
    
            // Находим коллекцию по ID в этой категории
            const collection = category.collections.find(col => col.id === collectionId);
            if (!collection) return console.log("Коллекция не найдена");
    
            // Находим подколлекцию по ID
            const subCollection = collection.sub_collections.find(sub => sub.id === sub_collectionId);
            if (subCollection) {
                runInAction(() => {
                    subCollection.current_task_id = nextTaskId ?? subCollection.tasks[0]?.id;
                });
            }
    
        } catch (error) {
            console.error("Ошибка завершения таска:", error);
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
    
    async setTasks(tasks: any) {
        runInAction(() => {
            this.tasks = tasks;
    
            // const cleaned = tasks.map((task: any) => {
            //     const { introAudio, ...rest } = task;
            //     return rest;
            // });
    
            // console.log(cleaned);
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

    async setHoldEmail(email: string) {
        runInAction(() => {
            this.holdEmail = email;
        });
    }
    
    async setWisyMenuText(email: string) {
        runInAction(() => {
            this.wisyMenuText = email;
        });
    }
}

export default new Store();