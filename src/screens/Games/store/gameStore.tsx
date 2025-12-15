import { makeAutoObservable, runInAction } from "mobx";
import store from "../../../store/store";
import { GetCollections } from "../../../api/methods/game/collections";
import { GetSubcollections } from "../../../api/methods/game/subcollections";
import { GetTasks } from "../../../api/methods/game/tasks";

class Store { 

    categoryId = 0;
    collectionId = 0;
    categories = null;
    collectionName = '';

    loadingCats = false;
    loadingGames = false;

    tasks = null;
    subCollections = [];
    toPutNewSubCollections = true;

    isSubCollectionsLoading = false;
    subCollectionsQueue: (() => Promise<void>)[] = [];
    
    collectionQueue: (() => Promise<void>)[] = [];
    isCollectionLoading = false;

    sounds: { wrong: string | null; correct: string | null } = { wrong: null, correct: null };

    constructor() {
        makeAutoObservable(this);
    }
    
    async setCategories(categories: any) {
        runInAction(() => {
            this.categories = categories 
        });
    }

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
    
            if (collection?.sub_collections?.length === 0) {
                const t0 = performance.now();
                const response = await GetSubcollections(params?.collectionId, store?.playingChildId.id);
                console.log(`[⏱] getSubCollections(${params.collectionId}) → ${(performance.now() - t0).toFixed(2)} ms`);
    
                available_sub_collections = response.data?.available_sub_collections || [];
                allSubCollections = response.data?.data?.map(sub => ({
                    ...sub,
                    parentCollectionId: params.collectionId
                })) || [];
                
                breaks = (response.data?.dynamicBreakGroups || []).map(b => ({
                    ...b,
                    parentCollectionId: params.collectionId
                }));

                // runInAction(() => {
                //     allSubCollections.forEach(sub => this.subCollectionsCounter.add(sub.id));
                // });

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
    
            const tSubs = performance.now();
            const subCollectionsWithTasks = await Promise.allSettled(
                subsToLoad.map(async (sub) => {
                    const t1 = performance.now();
                    try {
                        const response = await GetTasks(sub.id);
                        const tasks = response.data?.data
                        console.log(`[⏱] getTasks(${sub.id}) → ${(performance.now() - t1).toFixed(2)} ms`);
    
                        if (!tasks || !Array.isArray(tasks)) {
                            console.warn(`[Ошибка] Невалидный ответ задач для sub ID: ${sub.id}`);
                        }
                        return { ...sub, tasks };
                    } catch (err) {
                        console.error(`[Ошибка] Не удалось получить задачи для sub ID: ${sub.id}`, err);
                        return sub;
                    }
                })
            );
            console.log(`[⏱] Promise.allSettled(tasks) для ${subsToLoad.length} сабов → ${(performance.now() - tSubs).toFixed(2)} ms`);
    
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
    
            const tFinal = performance.now();
            runInAction(() => {
                if (this.toPutNewSubCollections) {
                    console.log(`[⏱] Финальное обновление subCollections заняло ${(performance.now() - tFinal).toFixed(2)} ms`);
                    this.subCollections = updatedSubCollections;
                } else {
                    console.log('не назначил саб коллекцию,но загрузил')
                }
            });
    
        } catch (error) {
            console.error('[Критическая ошибка] Ошибка в getAndProcessSubCollections:', error?.response?.data?.message);
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

    async resetCategories() {
        runInAction(() => {
            this.categoryId = 0;
            this.collectionId = 0;
            this.categories = null;
            this.collectionName = '';
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

    async loadNextTasksChunk(params) {
        runInAction(() => {
            this.loadingGames = true;
        });
    
        try {
            const subCollectionsBefore = [...this.subCollections];
            const previousTasks = this.tasks || [];
    
            // грузим сабы текущей коллекции через очередь
            await this.enqueueGetAndProcessSubCollections(params);
    
            // ищем новые сабы с тасками (без break)
            let newSubWithTasks = this.subCollections.find(sub => {
                if (sub.isBreak) return false;
                const before = subCollectionsBefore.find(prev => prev.id === sub.id);
                if (!before) return sub.tasks?.length;
                return !before.tasks?.length && sub.tasks?.length;
            });
    
            // если нет сабов → пробуем следующую коллекцию
            if (!newSubWithTasks) {
                console.log('[INFO] Сабы закончились, пробуем следующую коллекцию');
    
                const categoryNow = this.categories.find(c => c.id === params.categoryId);
                const currentIndexNow = categoryNow?.collections?.findIndex(col => col.id === params.collectionId) ?? -1;
    
                if (categoryNow && currentIndexNow !== -1 && currentIndexNow + 1 < (categoryNow.collections?.length ?? 0)) {
                    await this.enqueueGetCollection({ categoryId: params.categoryId });
    
                    const updatedCategory = this.categories.find(c => c.id === params.categoryId);
                    const updatedIndex = updatedCategory?.collections?.findIndex(col => col.id === params.collectionId) ?? -1;
    
                    if (updatedIndex !== -1 && updatedIndex + 1 < (updatedCategory.collections?.length ?? 0)) {
                        const nextCollection = updatedCategory.collections[updatedIndex + 1];
    
                        await this.enqueueGetAndProcessSubCollections({
                            categoryId: params.categoryId,
                            collectionId: nextCollection.id
                        });
    
                        runInAction(() => {
                            this.collectionId = nextCollection?.id;
                            this.collectionName = nextCollection?.name;
                        });
    
                        newSubWithTasks = this.subCollections.find(sub => !sub.isBreak && sub.tasks?.length);
                    }
                } else {
                    console.log('[INFO] Коллекции закончились в этой категории, дальше не идём');
                    return;
                }
            }
    
            // финальная проверка
            if (!newSubWithTasks) {
                console.log('[WARN] Не удалось найти саб с тасками даже после перехода на следующую коллекцию');
                return;
            }
    
            // собираем таски (фильтруем break-и)
            const tasksArray = this.subCollections
                .filter(item => !item.isBreak && item.tasks?.length > 0)
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
            const slicedTasks = clickedIndex !== -1 ? tasksArray.slice(clickedIndex) : tasksArray;
    
            runInAction(() => {
                this.tasks = [...previousTasks, ...slicedTasks];
            });
    
        } catch (error) {
            console.error('Ошибка в loadNextTasksChunk:', error);
        } finally {
            runInAction(() => {
                this.loadingGames = false;
            });
        }
    }                
   
    async getCollection(params) {
        try {
            const response = await GetCollections(params?.categoryId, store?.playingChildId?.id,);
    
            runInAction(() => {
                const categoryIndex = this.categories.findIndex(c => c.id === params.categoryId);
                if (categoryIndex !== -1) {
                    this.categories[categoryIndex] = {
                        ...this.categories[categoryIndex],
                        collections: response.data?.data.map(c => ({
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

    async setCategoryId(id: any) {
        runInAction(() => {
            this.categoryId = id;
        });
    }

    async setCorrectSound(sound: any) {
        runInAction(() => {
            this.sounds.correct = sound;
        });
    }

    async setWrongSound(sound: any) {
        runInAction(() => {
            this.sounds.wrong = sound;
        });
    }

    async setCollectionId(id: any) {
        runInAction(() => {
            this.collectionId = id;
        });
    }

    async setCollectionName(name: any) {
        runInAction(() => {
            this.collectionName = name;
        });
    }
    
    async setTasks(tasks: any) {
        runInAction(() => {
            this.tasks = tasks;
        });
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

}

export const gameStore = new Store();