import { useEffect, useState } from 'react';
import { checkNetwork } from '../../../network/checkNetwork';
import { GetAudios } from '../../../api/methods/audios/audios';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameStore } from '../../Games/store/gameStore';
import { alertHandler } from '../../../network/alertHandler';

let cachedAudioUri: string | null = null;

export const getAudios = () => {

    const [audio, setAudio] = useState<string | null>(cachedAudioUri);
    const [loading, setLoading] = useState<boolean>(!cachedAudioUri);

    useEffect(() => {
        if (cachedAudioUri) {
            setAudio(cachedAudioUri);
            setLoading(false);
            return;
        }

        const fetchAndCacheAudio = async () => {
            try {
                setLoading(true);

                const network = await checkNetwork();
                if (!network) {
                    setLoading(false);
                    return alertHandler()
                }

                const response = await GetAudios();

                const background_music_url = response?.data?.data.find((item) => item?.name === 'background_music')?.audio?.url;

                const correct_sound_url = response?.data?.data.find((item) => item?.name === 'correct_sound')?.audio?.url;

                const wrong_sound_url = response?.data?.data.find((item) => item?.name === 'wrong_sound')?.audio?.url;

                const downloadAndCache = async (url: string | null, key: string) => {
                if (!url) return null;

                const extension = url.split('.').pop()?.split('?')[0] || 'mp3';
                const fileUri = `${FileSystem.cacheDirectory}${key}.${extension}`;
                const savedUrl = await AsyncStorage.getItem(key);
                const info = await FileSystem.getInfoAsync(fileUri);

                if (info.exists && savedUrl === url) {
                    return fileUri;
                }

                if (info.exists) {
                    await FileSystem.deleteAsync(fileUri, { idempotent: true });
                }

                const result = await FileSystem.downloadAsync(url, fileUri);
                    await AsyncStorage.setItem(key, url);
                    return result.uri;
                };

                const [ backgroundUri, correctUri, wrongUri ] = await Promise.all([
                    downloadAndCache(background_music_url, 'background_music_url'),
                    downloadAndCache(correct_sound_url, 'correct_sound_url'),
                    downloadAndCache(wrong_sound_url, 'wrong_sound_url'),
                ]);

                
                if (correctUri) { 
                    gameStore.setCorrectSound(correctUri)
                }

                if (wrongUri) { 
                    gameStore.setWrongSound(wrongUri) 
                }

                if (backgroundUri) {
                    cachedAudioUri = backgroundUri;
                    setAudio(backgroundUri);
                }

            } catch (e: any) {
                console.error('Ошибка получения аудио:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchAndCacheAudio();
    }, []);

    return { audio, loading };
};
