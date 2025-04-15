import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;
let isStopping = false;

export const playSoundWithoutStopping = async (source: string): Promise<void> => {
  if (!source || typeof source !== 'string' || source.trim() === '') return;

  try {
    if (store.voiceInstructions) {
      store.setPlayingMusic(false);
    }

    await playSoundWithoutStopping.stop();

    const sound = new Audio.Sound();
    const isBase64 = source.startsWith('/9j') || source.length > 1000;

    await sound.loadAsync({
      uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
    });

    await sound.setVolumeAsync(store.voiceInstructions ? 1.0 : 0);

    await sound.playAsync();
    store.setPlayingMusic(false);

    currentSound = sound;

    return new Promise<void>((resolve) => {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status?.didJustFinish) {
          try {
            sound.setOnPlaybackStatusUpdate(null); // отключаем слушатель
            await sound.unloadAsync();
          } catch (e) {
            console.warn("Ошибка при выгрузке после окончания воспроизведения:", e);
          }
          if (currentSound === sound) {
            currentSound = null;
          }
          
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Ошибка при воспроизведении звука:', error);
    store.setPlayingMusic(true);
    currentSound = null;
    throw error;
  }
};

playSoundWithoutStopping.stop = async () => {
  if (isStopping || !currentSound) return store.setPlayingMusic(true);
  isStopping = true;

  try {
    const status = await currentSound.getStatusAsync();

    if (status.isLoaded) {
      currentSound.setOnPlaybackStatusUpdate(null); // сброс слушателя

      if (status.isPlaying || status.positionMillis > 0) {
        await currentSound.stopAsync().catch(() => {});
      }

      await currentSound.unloadAsync().catch(() => {});
    }

    store.setPlayingMusic(true);
  } catch (error) {
    console.error("Ошибка при остановке звука:", error);
    store.setPlayingMusic(true);
  } finally {
    currentSound = null;
    isStopping = false;
  }
};
