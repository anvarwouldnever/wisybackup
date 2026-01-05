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
        if (fadeInterval.current) {
            clearInterval(fadeInterval.current);
            fadeInterval.current = null;
        }

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
            }

            await sound.current.setVolumeAsync(volume);
        }, interval);
    };
    
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

    useEffect(() => {
        if (!sound.current) return;
    
        const run = async () => {
            // всегда гасим предыдущий fade
            if (fadeInterval.current) {
                clearInterval(fadeInterval.current);
                fadeInterval.current = null;
            }
    
            if (!store.musicPlaying) {
                // глобально нельзя играть
                await sound.current.pauseAsync();
                await sound.current.setVolumeAsync(0);
                return;
            }
    
            // можно играть
            await sound.current.playAsync();
    
            // плавно включаем или выключаем
            fadeVolume(store.musicTurnedOn ? 1 : 0, 0.05, 50);
        };
    
        run();
    }, [store.musicPlaying, store.musicTurnedOn]);

    useEffect(() => {
    
        loadMusic();
    
        return () => {
            if (fadeInterval.current) clearInterval(fadeInterval.current);
            if (sound.current) sound.current.unloadAsync();
        };
    }, [audio]);

    return null;
};

export default observer(BackgroundMusic);
