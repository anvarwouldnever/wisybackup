import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Store {

    loading = true;
    playingChildId = null;
    musicPlaying = true;
    musicTurnedOn = true;
    breakMusicPlaying = false;
    microOn = false;
    connectionState = false;
    language = null;
    holdEmail = null;                             
    voiceInstructions = true;
    wisySpeaking = false;
    wisyMenuText = null;
    isFirstOpening = false;
    isBlacked = false;
    newChildren = [];

    constructor() {
        makeAutoObservable(this);
        this.initializeStore();
    }             

    async initializeStore() {
        await this.loadData();
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

    async loadDataFromStorage(key: any) {
        try {
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Ошибка загрузки данных из AsyncStorage (${key}):`, error);
            return null;
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

    async setPlayingChildStars(stars: number) {
        runInAction(() => {
            this.playingChildId.stars += stars 
        })
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