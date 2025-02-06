import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;

export const newPlaySound = async (base64?: string): Promise<void> => {
  if (!base64 || typeof base64 !== 'string' || base64.trim() === '') {
    console.warn('Неверные данные аудио: base64 отсутствует или некорректен');
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
    await sound.loadAsync({ uri: `data:audio/mp3;base64,${base64}` });
    await sound.setVolumeAsync(1.0);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await store.setBreakPlayingMusic(true)
      }
    })

    currentSound = sound;
  } catch (error) {
    console.error('Ошибка при воспроизведении звука:', error);
    store.setBreakPlayingMusic(true)
  } finally {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        store.setBreakPlayingMusic(true)
      }, 3000);
    }
  }
};

// Вызывать при размонтировании компонента
export const stopCurrentSoundBlya = async () => {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
  }
};
