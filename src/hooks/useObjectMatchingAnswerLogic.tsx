import { useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import { playSound } from '../hooks/usePlayBase64Audio';
import api from '../api/api';
import store from '../store/store';
import useTimer from '../hooks/useTimer';

export const useObjectMatchingAnswer = ({
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
    setLock,
    setWisySpeaking,
    setThinking,
    setLines,
    setWrongObject,
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
      console.error("Ошибка при воспроизведении звука:", error);
    } finally {
      setWisySpeaking(false);
      setText(null);
      setLines((prev) => prev.slice(0, -1));
      setWrongObject(null);
      setLock(false);
    }
  };

  const answer = useCallback(async (params) => {
    if (!isActive.current) return;

    try {
      const lead_time = getTime();
      stop();
      setThinking(true);
      setLock(true);

      const response = await api.answerTaskObjectMatching({
        task_id: data?.id,
        attempt,
        child_id: store?.playingChildId?.id,
        success: params.answer,
        lead_time,
        token: store.token,
        lang: store.language,
        pair_id: params?.pair_id,
        target_pair_id: params?.target_pair_id,
      });

      if (!isActive.current) return;

      const finish = async (isCorrect) => {
        reset();
        if (!isFromAttributes) {
          onCompleteTask(subCollectionId, data?.next_task_id);
        }
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
            if (response?.stars) {
              setStars(response?.stars);
              setEarnedStars(response?.stars - response?.old_stars);
            }
            setLevel((prev) => prev + 1);
            setLock(false);
          }, 1500);
        }
      };

      if (response?.success && response?.stars) {
        await finish(true);
      } else if (!response?.success && response?.stars) {
        await finish(false);
      } else if (!response?.success && !response?.to_next) {
        start();
        vibrate();
        setText(response?.hint);
        playVoice(response?.sound);
        setAttempt('2');
      } else if (response?.success && !response?.stars) {
        await finish(true);
      } else if (!response?.success && response?.to_next) {
        await finish(false);
        setAttempt('1');
      }
    } catch (error) {
      console.log(error);
      setLock(false);
      setText(error?.response?.data?.message || 'Ошибка при отправке запроса');
      setWrongObject(null);
      setLines((prev) => prev.slice(0, -1));
    } finally {
      setThinking(false);
    }
  }, [data, attempt]);

  return { answer, isActive };
};
