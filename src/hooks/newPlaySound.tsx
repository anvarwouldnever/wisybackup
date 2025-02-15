import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;

export const newPlaySound = async (source?: string): Promise<void> => {
  if (!source || typeof source !== 'string' || source.trim() === '') {
    console.warn('Неверные данные аудио: источник отсутствует или некорректен');
    return;
  }

  try {
    store.setBreakPlayingMusic(false);

    // Очищаем предыдущий звук
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const sound = new Audio.Sound();
    const isBase64 = source.startsWith('/9j') || source.length > 1000; // Простая проверка на base64

    await sound.loadAsync({
      uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
    });

    await sound.setVolumeAsync(1.0);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await store.setBreakPlayingMusic(true);
      }
    });

    currentSound = sound;
  } catch (error) {
    console.error('Ошибка при воспроизведении звука:', error);
    store.setBreakPlayingMusic(true);
  } finally {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        store.setBreakPlayingMusic(true);
      }, 3000);
    }
  }
};

// Остановить текущее воспроизведение
export const stopCurrentSound = async () => {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch (error) {
      console.error('Ошибка при остановке звука:', error);
    }
    currentSound = null;
  }
};
