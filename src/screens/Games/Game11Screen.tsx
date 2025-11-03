import React, { useState, useRef, useEffect } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, Platform} from 'react-native';
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

const Game11Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const sound = React.useRef(new Audio.Sound());
    const audio = data?.content?.audio;

    // console.log(audio)

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const word = `${data?.content?.word}`.split('');

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
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
        
    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });

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
            setLock(true);
            await playSound(sound);
        } catch (error) {
            setText('error loading the sound');
            setLock(false);
        } finally {
            setLock(false);
        }
    }

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) &&
            
                <MainContainerBlock setCurrentLine={setCurrentLine} setLines={setLines} currentLine={currentLine} data={data} word={word} lines={lines} viewShotRef={viewShotRef} audio={audio} voiceForTask={voiceForTask} lock={lock} id={id} />
            
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
            
                <TouchableOpacity onPress={lock? () => {return} : () => {
                    answer()
                    setId(null);
                    }} style={{width: windowWidth * (120 / 800), backgroundColor: '#FF69B4', borderRadius: 100, height: Platform.isPad? windowWidth * (50 / 800) : windowHeight * (50 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0}}>
                    <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>Send</Text>
                </TouchableOpacity>
            
            }

        </View>
    );
};

export default Game11Screen;


