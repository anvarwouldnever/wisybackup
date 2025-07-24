import { useWindowDimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Animated, {ZoomInEasyDown} from 'react-native-reanimated';
import { playSound } from '../hooks/usePlayBase64Audio';
import useTimer from '../hooks/useTimer';
import RenderGame12Component from '../components/Game12/RenderComponent12';
import { useIntroSequence } from '../hooks/useIntroSequence'
import { useAnswerLogic } from '../hooks/useAnswerLogic'
import SkipButton from '../components/SkipButton'
import WisyHint from '../components/WisyHint'
import TutorialOverlay from '../components/TutorialOverlay';
import store from '../store/store';
import OverlayHint from '../components/OverlayHint';

const Game12Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow, tasks }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const isActive = useRef(true);

    const { start, reset } = useTimer();

    const { answer } = useAnswerLogic({ data, subCollectionId, onCompleteTask, isFromAttributes,
        levelHandlers: { setLevel, setStars, setEarnedStars },
        uiHandlers: { setText, setId, setLock, setWisySpeaking, setThinking },
        attemptState: { attempt, setAttempt },
    });

    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock, tasks, setLevel });
    
    useEffect(() => {
        isActive.current = true;
        start();
                          
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    const voiceForTask = async(sound) => {
        if (!sound) return
        try {
            console.log(sound)
            setLock(true)
            await playSound(sound)
        } catch (error) {
            setText("error loading the sound")
            setLock(false)
        } finally {
            setLock(false)
        }
    }

    return (
        <Animated.View entering={ZoomInEasyDown} style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, justifyContent: 'center', alignItems: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <RenderGame12Component setId={setId} id={id} lock={lock} answer={answer} data={data} voiceForTask={voiceForTask} />}
            
            <OverlayHint visible={store.isBlacked}>
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            </OverlayHint>

            {!store?.isBlacked && (
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            )}

            <SkipButton visible={tutorialShow && tutorials?.length > 0} showPaw={store?.isFirstOpening}
                onSkip={() => {
                    if (store.isFirstOpening) {
                        store.setIsFirstOpening(false)
                    }
                    setTutorialShow(false)
                }}
            />

        </Animated.View>
    )
}

export default Game12Screen;