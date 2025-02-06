import { Audio } from 'expo-av';
import store from '../store/store';
import { Platform } from 'react-native';
import { autorun } from 'mobx';

let currentSound: Audio.Sound | null = null;

export const playSound = async (base64: string) => {
  if (!base64) return;

  try {
    store.setPlayingMusic(false);

    // Если есть ранее запущенный звук, выгружаем его перед запуском нового
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: `data:audio/mp3;base64,${base64}` });
    await sound.setVolumeAsync(1.0);
    await sound.playAsync();

    currentSound = sound; // Запоминаем текущий звук

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        console.log(store.breakMusicPlaying)
        if (store.breakMusicPlaying) {
          return; 
        } else {
          store.setPlayingMusic(true);
          await sound.unloadAsync();
        }
        if (currentSound === sound) {
          currentSound = null;
        }
      }
    });
  } catch (error) {
    console.error('Ошибка при воспроизведении звука:', error);
    if (store.breakMusicPlaying) {
      return
    } else {
      store.setPlayingMusic(true);
    }
  } finally {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        if (store.breakMusicPlaying) {
          return
        } else {
          store.setPlayingMusic(true);
        }
      }, 3000);
    }
  }
};

autorun(() => {
  if (store.breakMusicPlaying && currentSound) {
    currentSound.stopAsync();
    currentSound.unloadAsync();
    currentSound = null;
    store.setPlayingMusic(false);
  }
});