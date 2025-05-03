import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Audio } from 'expo-av';
import store from '../store/store';
import { AppState } from 'react-native';

const BackgroundMusic = observer(() => {
  const sound = useRef(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const fadeInterval = useRef(null);

  const configureAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false
      });
    } catch (error) {
      console.error('Ошибка настройки аудиорежима', error);
    }
  };

  const fadeVolume = async (targetVolume, step, interval) => {
    if (!sound.current) return;
    if (fadeInterval.current) clearInterval(fadeInterval.current);

    const { value: currentVolume } = await sound.current.getStatusAsync().then(s => ({ value: s.volume }));
    let volume = currentVolume;

    fadeInterval.current = setInterval(async () => {
      if (!sound.current) return;

      const direction = targetVolume > volume ? 1 : -1;
      volume = parseFloat((volume + direction * step).toFixed(2));

      if ((direction === 1 && volume >= targetVolume) || (direction === -1 && volume <= targetVolume)) {
        volume = targetVolume;
        clearInterval(fadeInterval.current);
        fadeInterval.current = null;

        if (targetVolume === 0) {
          await sound.current.pauseAsync();
        }
      }

      await sound.current.setVolumeAsync(volume);
    }, interval);
  };

  useEffect(() => {
    const manageSound = async () => {
      if (!sound.current) return;

      await configureAudioMode();

      if (store.musicPlaying) {
        await sound.current.setVolumeAsync(0);
        await sound.current.playAsync();
        fadeVolume(store.musicTurnedOn ? 1 : 0, 0.05, 60);
      } else {
        fadeVolume(0, 0.1, 30);
      }
    };

    manageSound();
  }, [store.musicPlaying]);

  useEffect(() => {
    const configureAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Ошибка настройки аудиорежима', error);
      }
    };

    const loadAndPlayMusic = async () => {
      try {
        await configureAudioMode();

        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../../assets/bg_music.mp3'),
          { shouldPlay: false, isLooping: true }
        );
        sound.current = newSound;

        await sound.current.setVolumeAsync(0); // начнем с 0
        if (store.musicPlaying) {
          await sound.current.playAsync();
          fadeVolume(store.musicTurnedOn ? 1 : 0, 0.05, 60);
        }

      } catch (error) {
        console.error('Ошибка загрузки музыки', error);
      }
    };

    loadAndPlayMusic();

    return () => {
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      if (sound.current) sound.current.unloadAsync();
    };
  }, [store.musicTurnedOn]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
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

    AppState.addEventListener('change', handleAppStateChange);
  }, [appState]);

  return null;
});

export default BackgroundMusic;
