import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native"
import Game2Animals1Animation from "./Game2/Game2Animals1Animation";
import useTimer from "../../hooks/utils/useTimer";
import { useIntroSequence } from "../../hooks/useIntroSequence";
import { useAnswerLogic } from "../../hooks/answer/useAnswerLogic";
import TutorialOverlay from "./components/TutorialOverlay";
import WisyHint from "./components/WisyHint";
import SkipButton from "./components/SkipButton";
import store from "../../store/store";
import OverlayHint from "./components/OverlayHint";
import { playSound } from '../../hooks/usePlaySound'

const Game2Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow}) => {

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false); 
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
    const [wisySpeaking, setWisySpeaking] = useState(false);

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

    const voiceForTask = async(sound) => {
        if (!sound) return
        try {
            setLock(true)
            await playSound(sound)
        } catch (error) {
            setText('error loading the sound')
            setLock(true)
        } finally {
            setLock(false)
        }
    }

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {data && (!tutorialShow || tutorials?.length == 0 || isFromAttributes) && (
                <Game2Animals1Animation lock={lock} id={id} answer={answer} images={data?.content?.images} animal={data?.content?.title} setId={setId} audio={data?.content?.title_audio} voiceForTask={voiceForTask} />
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

export default Game2Screen;