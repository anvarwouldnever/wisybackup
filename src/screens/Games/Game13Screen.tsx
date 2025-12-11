import { View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import store from '../../store/store'
import useTimer from '../../hooks/utils/useTimer'
import RenderComponent13 from './Game13/RenderComponent13'
import SkipButton from './components/SkipButton'
import WisyHint from './components/WisyHint'
import { useIntroSequence } from '../../hooks/useIntroSequence'
import { useAnswerLogic } from '../../hooks/answer/useAnswerLogic'
import TutorialOverlay from './components/TutorialOverlay';
import OverlayHint from './components/OverlayHint'

const Game13Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);
    
    const isActive = useRef(true);

    const { start, reset } = useTimer();

    const { answer } = useAnswerLogic({ data, subCollectionId, onCompleteTask, isFromAttributes, levelHandlers: { setLevel, setStars, setEarnedStars }, uiHandlers: { setText, setId, setLock, setWisySpeaking, setThinking }, attemptState: { attempt, setAttempt } });

    const { clicked } = useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });
    
    useEffect(() => {
        isActive.current = true;
        start();
                          
        return () => {
            isActive.current = false;
            reset();
        };
    }, []);                  

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}
            
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <RenderComponent13 clicked={clicked} lock={lock} setId={setId} data={data} id={id} answer={answer}/> }
            
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

        </View>
    )
}

export default Game13Screen;