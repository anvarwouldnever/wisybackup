import { useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import { playSound } from '../usePlaySound';
import store from '../../store/store';
import useTimer from '../utils/useTimer';
import { AnswerHandWritten } from '../../api/methods/game/answer';
import { GetSpeeches } from '../../api/methods/speeches/speech';
import { gameStore } from '../../screens/Games/store/gameStore';

export const useHandwrittenAnswerLogic = ({
  data,
  subCollectionId,
  onCompleteTask,
  isFromAttributes = false,
  levelHandlers,
  uiHandlers,
  attemptState,
  saveAndShareImage,
  setLines
}) => {
  const isActive = useRef(true);
  const { getTime, start, stop, reset } = useTimer();

  const {
    setLevel,
    setStars,
    setEarnedStars,
  } = levelHandlers;

  const {
    setText,
    setId,
    setLock,
    setWisySpeaking,
    setThinking,
  } = uiHandlers;

  const {
    attempt,
    setAttempt,
  } = attemptState;

  const vibrate = () => Vibration.vibrate(500);

  const playVoice = async (sound) => {
    if (!isActive.current) return;
    try {
      setWisySpeaking(true);
      await playSound(sound);
    } catch (error) {
      console.error('Ошибка при воспроизведении звука:', error);
    } finally {
      setText(null);
      setWisySpeaking(false);
      setLock(false);
      setId(null);
      setLines([]);
    }
  };

  const answer = useCallback(async () => {
    if (!isActive.current) return;
    playSound.stop(true)

    try {
      setThinking(true);
      const lead_time = getTime();
      stop();
      setId(null);
      const images = await saveAndShareImage();
      setLock(true);

      const response = await AnswerHandWritten(
        data.id,
        attempt,
        store.playingChildId.id,
        lead_time,
        images,
      );

      if (!isActive.current) return;

      const handleSuccess = async (correct) => {
        reset();
        if (!isFromAttributes) {
          onCompleteTask(subCollectionId, data?.next_task_id);
        }
        setId({ id: data.id, result: correct ? 'correct' : 'wrong' });
        try {
          setWisySpeaking(true);
          if (!correct) {
            playSound(gameStore.sounds.wrong ?? require('../../../assets/notok.mp3'), false, false, true)
            const speech = await GetSpeeches('no_more_hints');
            setText(speech.data?.data[0]?.text);
            await playSound(speech?.data?.data[0]?.audio);
          } else {
              playSound(gameStore.sounds.correct ?? require('../../../assets/ok.mp3'), false, false, true)
              setText(response?.data?.hint);
              await playSound(response?.data?.sound);
              setText(response.data?.success_phrase);
              await playSound(response?.data?.success_phrase_sound);
          }
        } catch (e) {
          console.log(e);
        } finally {
          setText(null);
          setWisySpeaking(false);
          setTimeout(() => {
            setStars?.(response?.data?.stars);
            setEarnedStars?.(response?.data?.stars - response?.data?.old_stars);
            setLevel?.((prev) => prev + 1);
            setLock(false);
            setId(null);
            setLines([]);
          }, 1500);
        }
      };

      const handleRepeat = async () => {
        playSound(gameStore.sounds.wrong ?? require('../../../assets/notok.mp3'), false, false, true)
        start();
        setId({ id: data.id, result: 'wrong' });
        vibrate();
        setText(response?.data?.hint);
        await playVoice(response?.data?.sound);
        setAttempt?.('2');
      };

      if (response?.data?.success && response?.data?.stars) {
        await handleSuccess(true);
      } else if (response?.data?.success && response?.data?.to_next && !response?.data?.stars) {
        await handleSuccess(true);
      } else if (!response?.data?.success && response?.data?.stars) {
        
        await handleSuccess(false);
      } else if (!response?.data?.success && !response?.data?.to_next) {
        
        await handleRepeat();
      } else if (!response?.data?.success && response?.data?.to_next) {
        
        await handleSuccess(false);
        setAttempt?.('1');
      }
    } catch (error) {
      console.log(error);
      setLock(false);
      setText(error?.response?.data?.message || 'Ошибка при отправке ответа');
    } finally {
      setThinking(false);
    }
  }, [data, attempt]);

  return { answer, isActive };
};
