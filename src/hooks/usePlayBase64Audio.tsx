import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;

export const playSound = async (source: string): Promise<void> => {
  if (!source || typeof source !== 'string' || source.trim() === '') return;

  try {
    if (store.voiceInstructions) {
      store.setPlayingMusic(false);
    }

    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const sound = new Audio.Sound();
    const isBase64 = source.startsWith('/9j') || source.length > 1000; 

    await sound.loadAsync({
      uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
    });

    await sound.setVolumeAsync(store.voiceInstructions? 1.0 : 0);
    await sound.playAsync();

    currentSound = sound;

    return new Promise<void>((resolve) => {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status?.didJustFinish) {
          if (!store.breakMusicPlaying) {
            store.setPlayingMusic(true);
          }
          await sound.unloadAsync();
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