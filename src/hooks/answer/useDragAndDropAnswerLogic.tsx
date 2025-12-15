import { useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import { playSound } from '../usePlaySound';
import store from '../../store/store';
import useTimer from '../utils/useTimer';
import { AnswerDragAndDrop } from '../../api/methods/game/answer';
import { GetSpeeches } from '../../api/methods/speeches/speech';
import { gameStore } from '../../screens/Games/store/gameStore';

export const useDragAndDropAnswer = ({ data, subCollectionId, onCompleteTask, isFromAttributes = false, setId, levelHandlers, uiHandlers, attemptState }) => {
    
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

            // console.log(response.data?.success_phrase)

            if (!isActive.current) return;

            const handleSuccess = async (correct) => {

                reset();
                if (!isFromAttributes) {
                    onCompleteTask(subCollectionId, data?.next_task_id);
                }
                setId({ id: answer, result: correct ? 'correct' : 'wrong' });
                setWisySpeaking(true);
                try {
                    if (!correct) {
                        playSound(gameStore.sounds.wrong ?? require('../../../assets/notok.mp3'), true, false, true)
                        const speech = await GetSpeeches('no_more_hints')
                        setText(speech.data?.data[0]?.text);
                        await playSound(speech?.data?.data[0]?.audio);
                    } else {
                        playSound(gameStore.sounds.correct ?? require('../../../assets/ok.mp3'), true, false, true)
                        setText(response.data?.success_phrase);
                        await playSound(response.data?.success_phrase_sound);
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
                    }, 1500);
                }
            };

            const handleRepeat = async () => {
                playSound(gameStore.sounds.wrong ?? require('../../../assets/notok.mp3'), true, false, true)
                start();
                setId({ id: answer, result: 'wrong' });
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
            setText(error || 'Ошибка при отправке ответа');
        } finally {
            setThinking(false);
        }
    }, [data, attempt]);

  return { answer, isActive };
};