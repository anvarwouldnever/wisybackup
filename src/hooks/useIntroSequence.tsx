import { useEffect } from 'react';
import { playSound } from './usePlaySound';
import store from '../store/store';
import useTimer from './utils/useTimer';

interface UseIntroSequenceProps {
    data: any;
    tutorialShow: boolean;
    tutorials: any[];
    introText: string;
    introAudio: string;
    level: number;
    introTaskIndex: number;
    isActive: any;
    setText: (text: string | null) => void;
    setWisySpeaking: (val: boolean) => void;
    setLock: (val: boolean) => void;
}

export const useIntroSequence = ({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock }: UseIntroSequenceProps) => {
    
    const { start, reset, getTime } = useTimer()
    
    const clicked = () => {
        const time = getTime()
        console.log(time)
        reset()
    }
    
    useEffect(() => {
        if (level === null) return

        const introPlay = async () => {
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
                    if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials?.length === 0)) {
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

        if (store.isFirstOpening && store.isBlacked) {
            setWisySpeaking(true);
            setText("Here's your first task");
            setTimeout(() => {
                store.setIsBlacked(false);
                introPlay();
            }, 3000);
        } else {
            introPlay();
        }

        return () => {
            playSound.stop();
        };

    }, [data?.content?.speech, tutorialShow, level]);

    return { clicked }
};
