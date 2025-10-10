import { useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import { playSound } from '../hooks/usePlayBase64Audio';
import store from '../store/store';
import useTimer from '../hooks/useTimer';
import { AnswerObjectMatching } from '../api/methods/game/answer';
import { GetSpeeches } from '../api/methods/speeches/speech';

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

      const response = await AnswerObjectMatching(
        data?.id,
        attempt,
        store?.playingChildId?.id,
        lead_time,
        params.answer,
        params?.pair_id,
        params?.target_pair_id,
      );

      if (!isActive.current) return;

      const finish = async (isCorrect) => {
        reset();
        if (!isFromAttributes) {
          onCompleteTask(subCollectionId, data?.next_task_id);
        }
        try {
          setWisySpeaking(true);
          if (!isCorrect) {
            const speech = await GetSpeeches('no_more_hints');
            setText(speech.data?.data[0]?.text);
            await playSound(speech?.data?.data[0]?.audio);
          } else {
            setText(response?.data?.hint);
            await playSound(response?.data?.sound);
          }
        } catch (e) {
          console.log(e);
        } finally {
          setText(null);
          setWisySpeaking(false);
          setTimeout(() => {
            if (response?.data?.stars) {
              setStars(response?.data?.stars);
              setEarnedStars(response?.data?.stars - response?.data?.old_stars);
            }
            setLevel((prev) => prev + 1);
            setLock(false);
          }, 1500);
        }
      };

      if (response?.data?.success && response?.data?.stars) {
        await finish(true);
      } else if (!response?.data?.success && response?.data?.stars) {
        await finish(false);
      } else if (!response?.data?.success && !response?.data?.to_next) {
        start();
        vibrate();
        setText(response?.data?.hint);
        playVoice(response?.data?.sound);
        setAttempt('2');
      } else if (response?.data?.success && !response?.data?.stars) {
        await finish(true);
      } else if (!response?.data?.success && response?.data?.to_next) {
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
