import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';

let currentSound: Audio.Sound | null = null;

// Функция для остановки и сброса текущего звука
export const resetCurrentSound = () => {
    if (currentSound) {
      try {
        currentSound.stopAsync();  // Немедленно останавливаем
        currentSound.unloadAsync();  // Немедленно выгружаем
      } catch (error) {
        console.warn('Ошибка при сбросе звука:', error);
      } finally {
        currentSound = null;  // Сбрасываем текущий звук
      }
    }
  };
  

  export const playMenuSound = (source: string): void => {
    if (!source || typeof source !== 'string' || source.trim() === '') return;
  
    try {
      if (store.voiceInstructions) {
        store.setPlayingMusic(false);
      }

      resetCurrentSound();
  
      const sound = new Audio.Sound();
      const isBase64 = source.startsWith('/9j') || source.length > 1000;
  
      sound.loadAsync({
        uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
      }).then(() => {
        sound.setVolumeAsync(store.voiceInstructions ? 1.0 : 0);
        sound.playAsync();
      }).catch((error) => {
        console.error('Ошибка при загрузке/воспроизведении звука:', error);
      });
  
      currentSound = sound;
  
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status?.didJustFinish) {
          resetCurrentSound();  // Сбрасываем звук после завершения
          if (!store.breakMusicPlaying) {
            store.setPlayingMusic(true);
          }
        }
      });
  
    } catch (error) {
      console.error('Ошибка при воспроизведении звука:', error);
      resetCurrentSound(); // Сбросить текущий звук в случае ошибки
      if (!store.breakMusicPlaying) {
        store.setPlayingMusic(true);
      }
    } finally {
      if (Platform.OS === 'android' && !store.breakMusicPlaying) {
        setTimeout(() => {
          store.setPlayingMusic(true);
        }, 3000);
      }
    }
  };