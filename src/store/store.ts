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
    doneWelcomeSpeech = false;
    newChildren = [];

    constructor() {
        makeAutoObservable(this);
        this.loadData();
    }             

    async loadData() {
        try {
            await this.loadDataFromStorageLanguage();
            await this.loadDataFromStorageVoiceInstructions();
            await this.loadDataFromStorageBackgroundMusic();
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    async loadDataFromStorageLanguage() {
        const lang = await this.loadDataFromStorage('lang');
        runInAction(() => {
            if (lang) {
                this.language = lang
            } else {
                this.language = 'en'
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

    async loadDataFromStorage(key: any) {
        try {
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Ошибка загрузки данных из AsyncStorage (${key}):`, error);
            return null;
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
    }

    async removeNewChild(id: any) {
        const updated = this.newChildren.filter(item => item !== id);

        runInAction(() => {
            this.newChildren = updated;
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
    
    async setDoneWelcomeSpeech(boolean: boolean) {
        runInAction(() => {
            this.doneWelcomeSpeech = boolean;
        });
    }

    async setWisyMenuText(text: string) {
        runInAction(() => {
            this.wisyMenuText = text;
        });
    }
}

export default new Store();