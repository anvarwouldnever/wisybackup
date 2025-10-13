import { View, Text, useWindowDimensions, Platform, Image, TouchableOpacity, PanResponder } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import useTimer from '../../hooks/useTimer';
import { useHandwrittenAnswerLogic } from '../../hooks/useHandwrittenAnswerLogic';
import { useIntroSequence } from '../../hooks/useIntroSequence';
import TutorialOverlay from './components/TutorialOverlay'
import SkipButton from './components/SkipButton';
import store from '../../store/store';
import WisyHint from './components/WisyHint';
import OverlayHint from './components/OverlayHint';
import MainContainerBlock from './Game8/MainContainerBlock';

const Game8Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const viewShotRef = useRef(null);
    
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const { start, reset } = useTimer();

    const saveAndShareImage = async () => {
        try {
            const uri = await captureRef(viewShotRef, {
                format: 'png',
                quality: 1,
            });
    
            const fileName = uri.split('/').pop();
            const fileType = 'image/png';
    
            const file = {
                uri,
                name: fileName,
                type: fileType,
            };
    
            return [{ image: file, index: 0 }];
        } catch (error) {
            console.error("Error saving and sharing image:", error);
            return [];
        }
    };

    const { answer, isActive } = useHandwrittenAnswerLogic({ data, subCollectionId, onCompleteTask, isFromAttributes, levelHandlers: { setLevel, setStars, setEarnedStars }, uiHandlers: { setText, setId, setLock, setWisySpeaking, setThinking }, attemptState: { attempt, setAttempt }, saveAndShareImage, setLines });

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
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && 
                <MainContainerBlock data={data} viewShotRef={viewShotRef} lines={lines} currentLine={currentLine} id={id} setCurrentLine={setCurrentLine} setLines={setLines} />
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
                    setTutorialShow(false)
                }}
            />
            
            {lines?.length != 0 && <TouchableOpacity onPress={lock? () => {return} : () => {
                    answer()
                    setId(null)
                }} style={{width: windowWidth * (120 / 800), backgroundColor: '#FF69B4', borderRadius: 100, height: Platform.isPad? windowWidth * (50 / 800) : windowHeight * (50 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0}}>
                <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>}

        </View>
    )
}

export default Game8Screen;