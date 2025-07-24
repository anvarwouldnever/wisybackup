import { Audio } from 'expo-av';
import store from '../store/store'

let currentSound: Audio.Sound | null = null;
let isPlaying = false;
let isLoading = false;
let isStopping = false;
let playbackSessionId = 0;

const withTimeout = (promise: Promise<any>, ms = 1000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms)),
  ]);

  export const playSoundFor4Game = async (source: string): Promise<void> => {
    if (!source || typeof source !== 'string' || source.trim() === '') return;
    if (isPlaying || isLoading) return;
  
    await playSoundFor4Game.stop();
  
    isLoading = true;
    playbackSessionId += 1;
    const sessionId = playbackSessionId;
  
    try {
      if (store.voiceInstructions) {
        store.setPlayingMusic(false);
      }
  
      const sound = new Audio.Sound();
      const isBase64 = source.startsWith('/9j') || source.length > 1000;
  
      await sound.loadAsync({
        uri: isBase64 ? `data:audio/mp3;base64,${source}` : source,
      });
  
      // Сессия уже неактуальна — выгружаем звук и выходим
      if (sessionId !== playbackSessionId) {
        await sound.unloadAsync();
        return;
      }
  
      await sound.setVolumeAsync(store.voiceInstructions ? 1.0 : 0);
      await sound.playAsync();
  
      currentSound = sound;
      isPlaying = true;
      isLoading = false;
  
      return new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status?.didJustFinish) {
            try {
              isPlaying = false;
              sound.setOnPlaybackStatusUpdate(null);
              await sound.unloadAsync();
              if (currentSound === sound) {
                currentSound = null;
              }
              if (!store.breakMusicPlaying) {
                store.setPlayingMusic(true);
              }
              resolve();
            } catch (e) {
              console.error("Ошибка после завершения воспроизведения:", e);
              resolve();
            }
          }
        });
      });
    } catch (error) {
      console.error('Ошибка при воспроизведении звука:', error);
      isPlaying = false;
      isLoading = false;
      currentSound = null;
      store.setPlayingMusic(true);
    }
  };

playSoundFor4Game.stop = async () => {
  if (isStopping) return;
  isStopping = true;

  playbackSessionId += 1; // Отменяем все предыдущие сессии

  try {
    const sound = currentSound;
    currentSound = null; // Сразу обнуляем, чтобы playSound не продолжил

    if (!sound) return;

    const status = await sound.getStatusAsync();

    if (!status.isLoaded) return;

    sound.setOnPlaybackStatusUpdate(null);

    if (status.isPlaying || status.positionMillis > 0) {
      await withTimeout(sound.stopAsync().catch(() => {}), 1000);
    }

    await withTimeout(sound.unloadAsync().catch(() => {}), 1000);
    store.setWisySpeaking(false);
  } catch (error) {
    console.error("Ошибка при остановке звука:", error);
  } finally {
    currentSound = null;
    isPlaying = false;
    isLoading = false;
    isStopping = false;
    store.setPlayingMusic(true);
  }
};
