import { useState, useRef, useEffect } from 'react';
import { View, useWindowDimensions, Vibration } from 'react-native';
import MicroAnimation from './Game1/MicroAnimation';
import api from '../../api/api';
import TaskComponent from './Game1/TaskComponent';
import store from '../../store/store';
import useTimer from '../../hooks/useTimer';
import { playSound } from '../../hooks/usePlayBase64Audio';
import { useIntroSequence } from '../../hooks/useIntroSequence';
import OverlayHint from './components/OverlayHint';
import SkipButton from './components/SkipButton';
import TutorialOverlay from './components/TutorialOverlay';
import WisyHint from './components/WisyHint';

const Game1Screen = ({ data, setLevel, setStars, onCompleteTask, subCollectionId, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {    

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [text, setText] = useState(null);
    const [attempt, setAttempt] = useState('1');
    const [image, setImage] = useState(1);
    const [thinking, setThinking] = useState(false);
    const [lock, setLock] = useState(false);
    
    const { getTime, start, stop, reset } = useTimer();

    const [wisySpeaking, setWisySpeaking] = useState(false)

    const isActive = useRef(true);
                                
    const playVoice = async (sound) => {
            if (!isActive.current) return
            try {
                setWisySpeaking(true)
                await playSound(sound);
            } catch (error) {
                console.error("Ошибка при воспроизведении звука:", error);
            } finally {
                setText(null);
                setWisySpeaking(false);
                setLock(false);
            }
    };

    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });

    useEffect(() => {
        isActive.current = true;
        start();
                      
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    const vibrate = () => {
        Vibration.vibrate(500);
    };

    const lastAnswer = async(hint, stars, voice, old_stars) => {
        console.log('1')
        if (!isActive.current) return
        setImage(2)
        reset();
        if (isFromAttributes) {
            // store.loadCategories();
        } else {
            onCompleteTask(subCollectionId, data.next_task_id)
        }
        setStars(stars)
        setText(hint)

        try {
            setWisySpeaking(true)
            await playSound(voice)
        } catch (error) {
            console.log(error)
        } finally {
            setText(null);
            setWisySpeaking(false);
            setTimeout(() => {
                setStars(stars);
                setAttempt('1')
                setEarnedStars(stars - old_stars)
                setLevel(prev => prev + 1);
                setLock(false)
            }, 1500);
        }
    }

    const correctAnswer = async(hint, stars, voice, old_stars) => {
        console.log('2', hint)
        if (!isActive.current) return
        reset();
        if (isFromAttributes) {
            // store.loadCategories();
        } else {
            onCompleteTask(subCollectionId, data.next_task_id)
        }
        setImage(2)
        setText(hint)

        try {
            setWisySpeaking(true)
            await playSound(voice)
        } catch (error) {
            console.log(error)
        } finally {
            setText(null);
            setWisySpeaking(false);
            setTimeout(() => {
                setStars(stars);
                setAttempt('1')
                setEarnedStars(stars - old_stars)
                setText(hint)
                setLevel(prev => prev + 1)
                setImage(1)
                setLock(false)
            }, 1500);
        }
    };

    const incorrectAnswer = async(hint, voice) => {
        if (!isActive.current) return
        start();
        console.log('3')
        setText(hint);
        playVoice(voice)
        setAttempt('2'); 
    };

    const incorrectAnswerToNext = async(hint, stars, voice, old_stars) => {
        console.log('4')
        if (!isActive.current) return
        reset();
        if (isFromAttributes) {
            // store.loadCategories();
        } else {
            onCompleteTask(subCollectionId, data.next_task_id)
        }
        vibrate()
        setText(hint)
        try {
            setWisySpeaking(true)
            await playSound(voice)
        } catch (error) {
            console.log(error)
        } finally {
            setText(null);
            setWisySpeaking(false);
            setTimeout(() => {
                setStars(stars);
                setAttempt('1')
                setEarnedStars(stars - old_stars)
                setText(hint)
                setLevel(prev => prev + 1)
                setImage(1)
                setLock(false)
            }, 1500);
        }
    };

    const sendAnswer = async (uri) => {
        try {
            if (!isActive.current) return;
    
            const lead_time = getTime();
            stop();
            setThinking(true);
            setLock(true);
    
            const requestStatus = await api.answerTask(
                data.id,
                attempt,
                uri,
                `${store.playingChildId.id}`,
                store.token,
                lead_time,
                store.language
            );
    
            return requestStatus;
    
        } catch (error) {
            setLock(false);
    
            const message =
                error?.response?.data?.message || // axios ошибки от сервера
                error?.message ||                 // сетевые ошибки или JS-исключения
                'Произошла ошибка. Попробуйте снова';
    
            setText(message);

            setTimeout(() => {
                setText(null);
            }, 2000);
        } finally {
            setThinking(false);
        }
    };

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, alignItems: 'center', justifyContent: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {data && (!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <TaskComponent image={image === 1? data.content?.placeholder_image?.url : data.content?.image?.url} successImage={image}/>}
                
            <OverlayHint visible={store.isBlacked}>
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            </OverlayHint>

            {!store?.isBlacked && (
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{position: 'absolute', bottom: 0, right: 0}}>
                {!lock && <MicroAnimation playVoice={playVoice} lastAnswer={lastAnswer} correctAnswer={correctAnswer} incorrectAnswer={incorrectAnswer} incorrectAnswerToNext={incorrectAnswerToNext} setText={setText} sendAnswer={sendAnswer} stop={stop}/>}
            </View>}     

            <SkipButton visible={tutorialShow && tutorials?.length > 0} showPaw={store?.isFirstOpening}
                onSkip={() => {
                    if (store.isFirstOpening) {
                        store.setIsFirstOpening(false)
                    }
                    setTutorialShow(false)
                }}
            />

        </View>                                                                                                                                                                             
    );
}

export default Game1Screen;