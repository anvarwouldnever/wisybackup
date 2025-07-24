import { useWindowDimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Game3AnimalsAnimation from '../animations/Game3/Game3AnimalsAnimation'
import useTimer from '../hooks/useTimer'
import store from '../store/store'
import { useIntroSequence } from '../hooks/useIntroSequence'
import { useAnswerLogic } from '../hooks/useAnswerLogic'
import TutorialOverlay from '../components/TutorialOverlay'
import WisyHint from '../components/WisyHint'
import SkipButton from '../components/SkipButton'
import OverlayHint from '../components/OverlayHint'

const Game3Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const lottieRef = useRef(null);
    const isActive = useRef(true);

    const { start, reset } = useTimer();

    const { answer } = useAnswerLogic({ data, subCollectionId, onCompleteTask, isFromAttributes,
        levelHandlers: { setLevel, setStars, setEarnedStars },
        uiHandlers: { setText, setId, setLock, setWisySpeaking, setThinking },
        attemptState: { attempt, setAttempt },
    });
                
    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });

    useEffect(() => {
        isActive.current = true;
        start();
                  
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    return (
        <Animated.View entering={ZoomInEasyDown} style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, flexDirection: 'row', justifyContent: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {data && (!tutorialShow || tutorials?.length == 0 || isFromAttributes) && (
                <Game3AnimalsAnimation 
                    lock={lock} 
                    id={id} 
                    answer={answer} 
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

        </Animated.View>
    )
}

export default Game3Screen;