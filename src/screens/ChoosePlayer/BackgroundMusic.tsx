import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Audio } from 'expo-av';
import store from '../../store/store';
import { AppState } from 'react-native';
import { getAudios } from './hooks/getAudios';

const BackgroundMusic = () => {
    
    const sound = useRef(null);
    const [appState, setAppState] = useState(AppState.currentState);
    const fadeInterval = useRef(null);

    const { audio } = getAudios();

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
        if (!sound.current) return;
    
        if (store.musicPlaying) {
            sound.current.playAsync();
            fadeVolume(store.musicTurnedOn ? 1 : 0, 0.05, 60);
        } else {
            fadeVolume(0, 0.1, 30);
            sound.current.pauseAsync();
        }
    }, [store.musicPlaying, store.musicTurnedOn]);
    
    const loadMusic = async () => {
        if (!audio) return;

        try {
            await configureAudioMode();

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audio },
                { shouldPlay: false, isLooping: true }
            );

            sound.current = newSound;
            await sound.current.setVolumeAsync(0);

            if (store.musicPlaying) {
                await sound.current.playAsync();
                fadeVolume(store.musicTurnedOn ? 1 : 0, 0.05, 60);
            }
        } catch (e) {
            console.error('Ошибка загрузки музыки', e);
        }
    };

    useEffect(() => {
    
        loadMusic();
    
        return () => {
            if (fadeInterval.current) clearInterval(fadeInterval.current);
            if (sound.current) sound.current.unloadAsync();
        };
    }, [audio, store.musicTurnedOn]);

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
};

export default observer(BackgroundMusic);
