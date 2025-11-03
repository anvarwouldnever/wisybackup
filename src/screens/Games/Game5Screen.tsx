import { View, useWindowDimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Game5AnimalsAnimation from './Game5/Game5AnimalsAnimation'
import useTimer from '../../hooks/utils/useTimer'
import TutorialOverlay from './components/TutorialOverlay'
import SkipButton from './components/SkipButton'
import WisyHint from './components/WisyHint'
import { useAnswerLogic } from '../../hooks/answer/useAnswerLogic'
import { useIntroSequence } from '../../hooks/useIntroSequence'
import store from '../../store/store'
import OverlayHint from './components/OverlayHint'

const Game5Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const [text, setText] = useState(null);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [wisySpeaking, setWisySpeaking] = useState(false);
    const [lock, setLock] = useState(false);
    
    const isActive = useRef(true);
    
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

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}
            
            {data && (!tutorialShow || tutorials?.length == 0 || isFromAttributes) && (
                <Game5AnimalsAnimation 
                    lock={lock} 
                    id={id} 
                    answer={answer}
                    animal={data?.content?.question_image} 
                    images={data?.content?.images} 
                    setId={setId}
                />
            )}
            
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

export default Game5Screen;