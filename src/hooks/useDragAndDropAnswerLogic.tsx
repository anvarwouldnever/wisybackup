import { useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import { playSound } from '../hooks/usePlayBase64Audio';
import api from '../api/api';
import store from '../store/store';
import useTimer from '../hooks/useTimer';

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
    try { setWisySpeaking(true); await playSound(sound); }
    catch (e) { console.log(e); }
    finally { setWisySpeaking(false); setText(null); setLock(false); }
  };

  const finish = async (response, isCorrect, extra = {}) => {
    if (!isActive.current) return;
    reset();
    if (!isFromAttributes) onCompleteTask(subCollectionId, data.next_task_id);
    if (extra.setId) setId({ id: 'answer', result: 'correct' });
    setText(response?.hint);
    try { setWisySpeaking(true); await playSound(response?.sound); }
    catch (e) { console.log(e); }
    finally {
      setText(null);
      setWisySpeaking(false);
      setTimeout(() => {
        if (response?.stars) {
          setStars(response.stars);
          setEarnedStars(response.stars - response.old_stars);
        }
        setLevel((prev) => prev + 1);
        if (extra.resetAttempt) setAttempt('1');
        setLock(false);
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
      const response = await api.answerDragAndDrop({
        task_id: data.id,
        attempt,
        child_id: store.playingChildId.id,
        success: params.answer,
        lead_time,
        token: store.token,
        lang: store.language,
        answer_id: params.answer_id,
        image_id: params.image_id,
      });
      if (!isActive.current) return;

      if (response?.success && response?.stars) return await finish(response, true);
      if (!response?.success && response?.stars) return await finish(response, false);
      if (!response?.success && !response?.to_next) {
        start(); vibrate(); setText(response?.hint); playVoice(response?.sound); setAttempt('2'); return;
      }
      if (response?.success && !response?.to_next) return await finish(response, true, { resetAttempt: true });
      if (response?.success && response?.to_next) return await finish(response, true, { setId: true, resetAttempt: true });
      if (!response?.success && response?.to_next) return await finish(response, false, { resetAttempt: true });
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
