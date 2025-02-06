import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Audio } from 'expo-av';
import store from '../store/store';
import { AppState } from 'react-native';

const useMP3Player = observer(({ url }) => {
  const sound = useRef<Audio.Sound | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);

  const MUSIC_URL = url;

  useEffect(() => {
    if (store.breakMusicPlaying) {
      store.setPlayingMusic(false)
    }
    const manageSound = async () => {
      if (sound.current) {
        if (store.breakMusicPlaying) {
          await configureAudioMode();
          await sound.current.playAsync();
        } else {
          await sound.current.pauseAsync();
        }
      }
    };

    manageSound();
  }, [store.breakMusicPlaying, store.musicPlaying]);

  const configureAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true, 
      });
    } catch (error) {
      console.error('Ошибка настройки аудиорежима', error);
    }
  };

  const loadAndPlayMusic = async () => {
    try {
      store.setPlayingMusic(false)
      await configureAudioMode();

      if (sound.current) {
        await sound.current.unloadAsync();
        sound.current = null;
      }

      const newSound = new Audio.Sound();
      await newSound.loadAsync({ uri: MUSIC_URL }, { shouldPlay: true, isLooping: true });

      sound.current = newSound;
      await sound.current.setVolumeAsync(1);
      await sound.current.playAsync();

    } catch (error) {
      console.error('Ошибка загрузки музыки', error);
    }
  };

  useEffect(() => {
    loadAndPlayMusic();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        if (sound.current && store.musicPlaying) {
          await sound.current.playAsync();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        if (sound.current) {
          await sound.current.pauseAsync();
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [appState]);

  return null;
});


export default useMP3Player;
