import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { captureRef } from 'react-native-view-shot';
import useTimer from '../../hooks/utils/useTimer';
import { useHandwrittenAnswerLogic } from '../../hooks/answer/useHandwrittenAnswerLogic';
import { useIntroSequence } from '../../hooks/useIntroSequence';
import WisyHint from './components/WisyHint';
import SkipButton from './components/SkipButton';
import TutorialOverlay from './components/TutorialOverlay';
import store from '../../store/store';
import OverlayHint from './components/OverlayHint';
import { playSound } from '../../hooks/usePlaySound';
import MainContainerBlock from './Game11/MainContainerBlock';
import { useScale } from '../../hooks/utils/useScale';
import translations from '../../../localization';

const Game11Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow, labels }) => {

    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const sound = React.useRef(new Audio.Sound());
    const audio = data?.content?.audio;

    const hint = data?.content?.hint_image;
    const hintDuration = data?.content?.hint_display_mode;

    const word = `${data?.content?.word}`.split('');

    const { s, vs } = useScale()

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(true);
    const [wisySpeaking, setWisySpeaking] = useState(false);
    
    const viewShotRef = useRef(null);

    const { start, reset } = useTimer();

    const saveAndShareImage = async () => {
        try {
            const uri = await captureRef(viewShotRef, {
                format: "png",
                quality: 1,
            });
        
            const fileName = uri.split("/").pop();
            const fileType = "image/png";
        
            const fileObj = {
                uri,
                name: fileName,
                type: fileType,
            };
        
            const index = word.findIndex((letter) => letter === "*");
        
            return [{ image: fileObj, index }];
        } catch (error) {
            console.error("Error saving and sharing image:", error);
            return [];
        }
    };   

    const { answer, isActive } = useHandwrittenAnswerLogic({ data, subCollectionId, onCompleteTask, isFromAttributes, levelHandlers: { setLevel, setStars, setEarnedStars }, uiHandlers: { setText, setId, setLock, setWisySpeaking, setThinking }, attemptState: { attempt, setAttempt }, saveAndShareImage, setLines });
        
    const { clicked } = useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });

    useEffect(() => {
        start();
        isActive.current = true;
    
        return () => {
            reset();
            isActive.current = false;
            sound.current.unloadAsync();
        };
    }, []);    

    const voiceForTask = async(sound) => {
        if (!sound) return;
        try {
            await playSound(sound);
        } catch (error) {
            setText('error loading the sound');
        }
    }

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) &&
                <MainContainerBlock clicked={clicked} hint={hint} hintDuration={hintDuration} setCurrentLine={setCurrentLine} setLines={setLines} currentLine={currentLine} data={data} word={word} lines={lines} viewShotRef={viewShotRef} audio={audio} voiceForTask={voiceForTask} lock={lock} id={id} />
            }

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
                    setTutorialShow(false);
                }}
            />

            {lines?.length != 0 &&
                <TouchableOpacity onPress={lock? () => {return} : () => { answer(); setId(null) }} style={{ width: 'auto', height: 'auto', paddingHorizontal: s(18), paddingVertical: s(7), backgroundColor: '#FF69B4', borderRadius: 100, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0 }}>
                    <Text style={{ fontSize: s(8), color: 'white', fontWeight: '600' }}>{labels?.send}</Text>
                </TouchableOpacity>
            }

        </View>
    );
};

export default Game11Screen;


