import { Audio } from 'expo-av';
import store from '../store/store';

let currentSound: Audio.Sound | null = null;
let isPlaying = false;
let isLoading = false;
let isStopping = false;

const withTimeout = (promise: Promise<any>, ms = 1000) =>
    Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
    ]);

export const playSound = async (source: string, toRenew: boolean = true, isBreak: boolean = false, isNeutral: boolean = false): Promise<void> => {
    
    if (!source || (typeof source !== 'string' && typeof source !== 'number')) return

    if (isPlaying || isLoading) return;

    isLoading = true;

    try {
        await playSound.stop(toRenew);

        if (store.voiceInstructions && !isNeutral) {
            store.setPlayingMusic(false);
        }

        if (isBreak) {
            store.setBreakPlayingMusic(false);
        }

        const sound = new Audio.Sound();

        if (typeof source === 'number') {
            await sound.loadAsync(source);
        } else if (source.startsWith('/9j') || source.length > 1000) {
            await sound.loadAsync({ uri: `data:audio/mp3;base64,${source}` });
        } else {
            await sound.loadAsync({ uri: source });
        }

        await sound.setVolumeAsync(store.voiceInstructions ? 1.0 : 0);
        await sound.playAsync();

        if (isNeutral) return

        currentSound = sound;
        isPlaying = true;
        isLoading = false;

        return new Promise<void>((resolve) => {
            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.didJustFinish) {
                    try {
                        isPlaying = false;
                        currentSound?.setOnPlaybackStatusUpdate(null);
                        await sound.unloadAsync();
                        if (currentSound === sound) {
                            currentSound = null;
                        }
                        if (!store.breakMusicPlaying && toRenew && !isBreak) {
                            store.setPlayingMusic(true);
                        }
                        if (isBreak) {
                            store.setBreakPlayingMusic(true);
                        }
                        resolve();
                    } catch (e) {
                        console.error("Ошибка после завершения воспроизведения:", e);
                        resolve();
                    }
                }
            });
        });

    } catch (error) {
        console.error('Ошибка при воспроизведении звука:', error);
        isPlaying = false;
        isLoading = false;
        currentSound = null;
        store.setPlayingMusic(true);
    }
};

playSound.stop = async (toRenew?) => {
    
    if (isStopping) return;

    isStopping = true;

    try {

        const sound = currentSound;

        currentSound = null;

        if (!sound) return;

        const status = await sound.getStatusAsync();

        if (!status.isLoaded) {
            return;
        }

        sound.setOnPlaybackStatusUpdate(null);

        if (status.isPlaying || status.positionMillis > 0) {
            await withTimeout(sound.stopAsync().catch(() => {}), 1000);
        }

        await withTimeout(sound.unloadAsync().catch(() => {}), 1000);
        store.setWisySpeaking(false);
        
    } catch (error) {
        console.error("Ошибка при остановке звука:", error);
    } finally {
        currentSound = null;
        isPlaying = false;
        isLoading = false;
        isStopping = false;
        if (toRenew) {
            store.setPlayingMusic(true);
        }
    }
};
