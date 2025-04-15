import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;
let isStopping = false;

export const playSound2 = async (source: string): Promise<void> => {
  if (!source || typeof source !== 'string' || source.trim() === '') return;

  try {
    store.setPlayingMusic(false);

    await playSound2.stop(); // стопим, если что-то уже играет

    const sound = new Audio.Sound();
    const isBase64 = source.startsWith('/9j') || source.length > 1000;

    await sound.loadAsync({
      uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
    });

    await sound.setVolumeAsync(1.0);
    await sound.playAsync();

    currentSound = sound;

    return new Promise<void>((resolve) => {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status?.didJustFinish) {
          if (!store.breakMusicPlaying) {
            store.setPlayingMusic(true);
          }
          try {
            await sound.unloadAsync();
          } catch (e) {
            console.warn("Ошибка при выгрузке:", e);
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
    if (!store.breakMusicPlaying) {
      store.setPlayingMusic(true);
    }
    throw error;
  } finally {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        if (!store.breakMusicPlaying) {
          store.setPlayingMusic(true);
        }
      }, 3000);
    }
  }
};

playSound2.stop = async () => {
  if (isStopping || !currentSound) return;
  isStopping = true;

  try {
    const status = await currentSound.getStatusAsync();

    if (status.isLoaded) {
      currentSound.setOnPlaybackStatusUpdate(null); // отключаем обновления
      if (status.isPlaying || status.positionMillis > 0) {
        await currentSound.stopAsync().catch(() => {});
      }
      await currentSound.unloadAsync().catch(() => {});
    }

    store.setPlayingMusic(true);
  } catch (error) {
    console.error('Ошибка при остановке звука:', error);
    store.setPlayingMusic(true);
  } finally {
    currentSound = null;
    isStopping = false;
  }
};
