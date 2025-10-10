import { View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Game4AnimalsAnimation from './Game4/Game4AnimalsAnimation'
import store from '../../store/store'
import { playSound } from '../../hooks/usePlayBase64Audio'
import useTimer from '../../hooks/useTimer'
import OverlayHint from './components/OverlayHint'
import { observer } from 'mobx-react-lite'
import WisyHint from './components/WisyHint'
import TutorialOverlay from './components/TutorialOverlay'
import SkipButton from './components/SkipButton'
import { useAnswerLogic } from '../../hooks/useAnswerLogic'
import { useIntroSequence } from '../../hooks/useIntroSequence'

const Game4Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, level, introTaskIndex, tutorials, tutorialShow, setTutorialShow, tasks }) => {

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

    useEffect(() => {
        isActive.current = true;
        start();
      
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    const voiceForTask = async(sound) => {
        if (!sound) return;
        try {
            setLock(true)
            await playSound(sound)
        } catch (error) {
            setText('error loading the sound')
            setLock(false)
        } finally {
            setLock(false)
        }
    }

    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock, isActive, setLevel, tasks });

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
    
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {data && (!tutorialShow || tutorials?.length === 0 || isFromAttributes) && (
                <Game4AnimalsAnimation 
                    lock={lock} 
                    id={id} 
                    answer={answer} 
                    audio={data?.content?.question_audio} 
                    images={data?.content?.images} 
                    setId={setId} 
                    voiceForTask={voiceForTask}
                />
            )}

            <OverlayHint visible={store.isBlacked}>
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            </OverlayHint>

            {!store?.isBlacked && (
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            )}

            <SkipButton visible={tutorialShow && tutorials?.length > 0} showPaw={store.isFirstOpening}
                onSkip={() => {
                    setTutorialShow(false)
                }}
            />
        </View>
    )
}

export default observer(Game4Screen);