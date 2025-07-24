import { useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import { playSound } from '../hooks/usePlayBase64Audio';
import api from '../api/api';
import store from '../store/store';
import useTimer from '../hooks/useTimer';

export const useAnswerLogic = ({
  data,
  subCollectionId,
  onCompleteTask,
  isFromAttributes = false,
  levelHandlers,
  uiHandlers,
  attemptState,
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
    }
  };

  const answer = useCallback(async ({ answer }) => {
    if (!isActive.current) return;

    try {
      const lead_time = getTime();
      stop();
      setId(null);
      setThinking(true);
      setLock(true);
      await playSound.stop();

      const response = await api.answerTaskSC({
        task_id: data.id,
        attempt,
        child_id: store.playingChildId.id,
        answer,
        lead_time,
        token: store.token,
        lang: store.language,
      });

      if (!isActive.current) return;

      const handleSuccess = async (correct) => {
        reset();
        if (!isFromAttributes) {
          onCompleteTask(subCollectionId, data?.next_task_id);
        }
        setId({ id: answer, result: correct ? 'correct' : 'wrong' });
        setText(response?.hint);
        try {
          setWisySpeaking(true);
          await playSound(response?.sound);
        } catch (e) {
          console.log(e);
        } finally {
          setText(null);
          setWisySpeaking(false);
          setTimeout(() => {
            setStars?.(response?.stars);
            setEarnedStars?.(response?.stars - response?.old_stars);
            setLevel?.((prev) => prev + 1);
            setLock(false);
            setId(null);
          }, 1500);
        }
      };

      const handleRepeat = async () => {
        start();
        setId({ id: answer, result: 'wrong' });
        vibrate();
        setText(response?.hint);
        await playVoice(response?.sound);
        setAttempt?.('2');
      };

      if (response?.success && response?.stars) {
        await handleSuccess(true);
      } else if (response?.success && response?.to_next && !response?.stars) {
        await handleSuccess(true);
      } else if (!response?.success && response?.stars) {
        await handleSuccess(false);
      } else if (!response?.success && !response?.to_next) {
        await handleRepeat();
      } else if (!response?.success && response?.to_next) {
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
