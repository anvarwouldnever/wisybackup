import { useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import { playSound } from '../usePlaySound';
import store from '../../store/store';
import useTimer from '../utils/useTimer';
import { AnswerDragAndDrop } from '../../api/methods/game/answer';
import { GetSpeeches } from '../../api/methods/speeches/speech';
import { gameStore } from '../../screens/Games/store/gameStore';

export const useDragAndDropAnswer = ({
  data,
  subCollectionId,
  onCompleteTask,
  isFromAttributes = false,
  setId,
  levelHandlers,
  uiHandlers,
  attemptState,
}) => {
  const isActive = useRef(true);
  const { getTime, start, stop, reset } = useTimer();
  const { setLevel, setStars, setEarnedStars } = levelHandlers;
  const { setText, setLock, setWisySpeaking, setThinking } = uiHandlers;
  const { attempt, setAttempt } = attemptState;

  const vibrate = () => Vibration.vibrate(500);

  const playVoice = async (sound) => {
    if (!isActive.current) return;
    try {
      setWisySpeaking(true);
      await playSound(sound, false, false, true);
    } catch (e) {
      console.log(e);
    } finally {
      setText(null);
      setWisySpeaking(false);
      setLock(false);
      setId?.(null);
    }
  };

  const finish = async (response, isCorrect, extra = {}) => {
    if (!isActive.current) return;
    reset();
    if (!isFromAttributes) {
      onCompleteTask(subCollectionId, data.next_task_id);
    }

    if (extra.setId) {
      setId({ id: 'answer', result: isCorrect ? 'correct' : 'wrong' });
    }

    try {
      setWisySpeaking(true);
      if (!isCorrect) {
        playSound(gameStore.sounds.wrong ?? require('../../../assets/notok.mp3'), false, false, true)
        const speech = await GetSpeeches('no_more_hints');
        setText(speech.data?.data[0]?.text);
        await playSound(speech?.data?.data[0]?.audio);
      } else {
        playSound(gameStore.sounds.correct ?? require('../../../assets/ok.mp3'), false, false, true)
        setText(response?.hint);
        await playSound(response?.sound);
        setText(response.data?.success_phrase);
        await playSound(response?.data?.success_phrase_sound);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setText(null);
      setWisySpeaking(false);
      setTimeout(() => {
        if (response?.stars) {
          setStars(response.stars);
          setEarnedStars(response?.stars - response?.old_stars);
        }
        setLevel((prev) => prev + 1);
        if (extra.resetAttempt) setAttempt('1');
        setLock(false);
        setId(null);
      }, 1500);
    }
  };

  const answer = useCallback(async (params) => {
    if (!isActive.current) return;
    try {
      const lead_time = getTime();
      stop();
      setThinking(true);
      setLock(true);
      await playSound.stop();

      const response = await AnswerDragAndDrop(
        data.id,
        attempt,
        store.playingChildId.id,
        lead_time,
        params.answer,
        params.answer_id,
        params.image_id,
      );

      if (!isActive.current) return;

      if (response?.data?.success && response?.data?.stars) {
        return await finish(response.data, true);
      }
      if (!response?.data?.success && response?.data?.stars) {
        return await finish(response.data, false);
      }
      if (!response?.data?.success && !response?.data?.to_next) {
        playSound(gameStore.sounds.wrong ?? require('../../../assets/notok.mp3'), false, false, true)
        start();
        vibrate();
        setText(response?.data?.hint);
        await playVoice(response?.data?.sound);
        setAttempt('2');
        return;
      }
      if (response?.data?.success && !response?.data?.to_next) {
        return await finish(response.data, true, { resetAttempt: true });
      }
      if (response?.data?.success && response?.data?.to_next) {
        return await finish(response.data, true, { setId: true, resetAttempt: true });
      }
      if (!response?.data?.success && response?.data?.to_next) {
        return await finish(response.data, false, { resetAttempt: true });
      }
    } catch (error) {
      console.log(error);
      setLock(false);
      setText(error || 'Ошибка при отправке ответа');
    } finally {
      setThinking(false);
    }
  }, [data, attempt]);

  return { answer, isActive };
};
