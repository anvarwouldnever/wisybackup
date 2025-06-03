import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;
let shouldCancel = false;

export const newPlaySound = async (source?: string): Promise<void> => {
  if (!source || typeof source !== 'string' || source.trim() === '') {
    console.warn('Неверные данные аудио: источник отсутствует или некорректен');
    return;
  }

  shouldCancel = true;
  await stopCurrentSound();

  shouldCancel = false;

  try {
    store.setBreakPlayingMusic(false);

    const sound = new Audio.Sound();
    const isBase64 = source.startsWith('/9j') || source.length > 1000;

    await sound.loadAsync({
      uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
    });

    if (shouldCancel) {
      await sound.unloadAsync();
      return;
    }

    await sound.setVolumeAsync(store.voiceInstructions? 1.0 : 0);
    if (store.breakMusicPlaying || store.musicPlaying) {
      store.setBreakPlayingMusic(false);
      store.setPlayingMusic(false)
      await sound.playAsync();
    } else {
      await sound.playAsync();
    }

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

export const stopCurrentSound = async () => {
  shouldCancel = true;

  if (currentSound) {
    const soundToStop = currentSound;
    currentSound = null;

    try {
      const status = await soundToStop.getStatusAsync();
      if (status.isLoaded) {
        await soundToStop.stopAsync();
      }
      await soundToStop.unloadAsync();
    } catch (error) {
      console.error('Ошибка при остановке звука:', error);
    }
  }
};
