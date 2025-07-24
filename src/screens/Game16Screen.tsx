import { useWindowDimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import useTimer from '../hooks/useTimer'
import { playSound2 } from '../hooks/usePlaySound2'
import RenderComponent from '../components/Game16/RenderComponent'
import SkipButton from '../components/SkipButton'
import TutorialOverlay from '../components/TutorialOverlay'
import WisyHint from '../components/WisyHint'
import { useAnswerLogic } from '../hooks/useAnswerLogic'
import store from '../store/store'
import OverlayHint from '../components/OverlayHint'
import { playSound } from '../hooks/usePlayBase64Audio'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'
import { useIntroSequence } from '../hooks/useIntroSequence'

const Game16Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, tutorials, tutorialShow, setTutorialShow, level }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const isActive = useRef(true);

    const animal = data?.content?.image?.url
    const isAnimalSvg = data?.content?.image?.url && data?.content?.image?.url.endsWith('.svg');

    const { start, reset } = useTimer();
    
    const { answer } = useAnswerLogic({ data, subCollectionId, onCompleteTask, isFromAttributes, levelHandlers: { setLevel, setStars, setEarnedStars }, uiHandlers: { setText, setId, setLock, setWisySpeaking, setThinking }, attemptState: { attempt, setAttempt }});
    
    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock, setLevel });
        
    useEffect(() => {
        isActive.current = true;
        start();
                              
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    const voice = async(sound) => {
        if (!sound) return
        try {
            setLock(true)
            await playSound2(sound)
        } catch (error) {
            setText('error loading the sound')
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

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <RenderComponent animal={animal} isAnimalSvg={isAnimalSvg} answer={answer} id={id} setId={setId} lock={lock} data={data} voice={voice}/> }
            
            {/* {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking}/>} */}
            
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

export default Game16Screen;