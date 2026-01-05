import { useEffect } from 'react';
import { playSound } from './usePlaySound';
import store from '../store/store';
import useTimer from './utils/useTimer';
import { getSpeech } from '../screens/Main/hooks/getSpeech';

interface UseIntroSequenceProps {
    data: any;
    tutorialShow: boolean;
    tutorials: any[];
    introText: string;
    introAudio: string;
    level: number;
    introTaskIndex: number;
    setText: (text: string | null) => void;
    setWisySpeaking: (val: boolean) => void;
    setLock: (val: boolean) => void;
}

export const useIntroSequence = ({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock }: UseIntroSequenceProps) => {

    const { start } = useTimer()

    const clicked = () => { }

    useEffect(() => {
        if (level === null) return

        const introPlay = async() => {

            await playSound.stop();
    
            try {
                setLock(true);
                if (level === introTaskIndex && (!tutorialShow || tutorials?.length === 0)) {
                    setWisySpeaking(true);
                    setText(introText);
                    await playSound(introAudio);
                }
            } catch (error) {
                console.log(error);
            } finally {
                try {
                    if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials?.length === 0) && data?.content?.question_hidden) {
                        setText(data?.content?.question);
                        setWisySpeaking(true);
                        await playSound(data?.content?.speech);
                    }
                } catch (error) {
                    console.error("Ошибка при воспроизведении звука:", error);
                } finally {
                        setText(null);
                        setWisySpeaking(false);
                        setLock(false);
                        start()
                    try {
                        if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials?.length === 0)) {
                            await playSound(data?.content?.question_audio, true);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        };

        const getFirstTaskSpeech = async() => {
            setText(null)
            const response = await getSpeech('first_task');
            const randomIndex = Math.floor(Math.random() * response?.data?.data?.length);
            setWisySpeaking(true)
            setText(response.data?.data[randomIndex]?.text);
            await playSound(response.data?.data[randomIndex]?.audio);
            store.setIsBlacked(false);
            setTimeout(() => {
                introPlay();
            }, 1000);
        }

        if (store.isFirstOpening && store.isBlacked) {
            getFirstTaskSpeech()
            return
        } else {
            introPlay();
        }

        return () => {
            playSound.stop();
        };

    }, [data?.content?.speech, tutorialShow]);

    return { clicked }
};
