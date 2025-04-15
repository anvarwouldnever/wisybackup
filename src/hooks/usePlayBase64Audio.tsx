import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;
let isPlaying = false;
let isLoading = false;
let isStopping = false;

const withTimeout = (promise: Promise<any>, ms = 1000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);

export const playSound = async (source: string): Promise<void> => {
  if (!source || typeof source !== 'string' || source.trim() === '') return;

  if (isPlaying || isLoading) return;

  isLoading = true;

  try {
    // Останавливаем любой текущий звук
    await playSound.stop();

    if (store.voiceInstructions) {
      store.setPlayingMusic(false);
    }

    const sound = new Audio.Sound();
    const isBase64 = source.startsWith('/9j') || source.length > 1000;

    await sound.loadAsync({
      uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
    });

    await sound.setVolumeAsync(store.voiceInstructions ? 1.0 : 0);
    await sound.playAsync();

    currentSound = sound;
    isPlaying = true;
    isLoading = false;

    return new Promise<void>((resolve) => {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status?.didJustFinish) {
          try {
            isPlaying = false;
            currentSound?.setOnPlaybackStatusUpdate(null);
            await sound.unloadAsync();
            if (currentSound === sound) {
              currentSound = null;
            }
            if (!store.breakMusicPlaying) {
              store.setPlayingMusic(true);
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

playSound.stop = async () => {
  if (isStopping || !currentSound) return;
  isStopping = true;

  try {
    const status = await currentSound.getStatusAsync();

    if (!status.isLoaded) {
      currentSound = null;
      return;
    }

    currentSound.setOnPlaybackStatusUpdate(null); // сброс слушателя

    if (status.isPlaying || status.positionMillis > 0) {
      await withTimeout(currentSound.stopAsync().catch(() => {}), 1000);
    }

    await withTimeout(currentSound.unloadAsync().catch(() => {}), 1000);
    store.setWisySpeaking(false);
  } catch (error) {
    console.error("Ошибка при остановке звука:", error);
  } finally {
    currentSound = null;
    isPlaying = false;
    isLoading = false;
    isStopping = false;
    store.setPlayingMusic(true);
  }
};
