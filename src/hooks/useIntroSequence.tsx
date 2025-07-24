import { useEffect } from 'react';
import { playSound } from '../hooks/usePlayBase64Audio';
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds';
import { playSoundFor4Game } from '../hooks/playAudioFor4Game';
import store from '../store/store';

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

export const useIntroSequence = ({
  data,
  tutorialShow,
  tutorials,
  introText,
  introAudio,
  level,
  introTaskIndex,
  isActive,
  setText,
  setWisySpeaking,
  setLock,
  
}: UseIntroSequenceProps) => {
  useEffect(() => {
    if (level === null) return

    const introPlay = async () => {
      await playSoundWithoutStopping.stop();
      await playSound.stop();

      try {
        setLock(true);
        if (level === introTaskIndex && (!tutorialShow || tutorials?.length === 0)) {
         
          setWisySpeaking(true);
          setText(introText);
          await playSoundWithoutStopping(introAudio);
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
          
          try {
            if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials?.length === 0)) {
              await playSoundFor4Game(data?.content?.question_audio);
            }
          } catch (error) {
            console.log(error);
          } finally {
            setLock(false);
            // console.log(level, introTaskIndex)
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
      playSoundWithoutStopping.stop();
      playSoundFor4Game.stop?.();
    };
  }, [data?.content?.speech, tutorialShow, level]);
};
