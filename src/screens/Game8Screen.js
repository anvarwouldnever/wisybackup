import { View, Text, useWindowDimensions, Platform, Image, TouchableOpacity, PanResponder } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import Svg, { Polyline, SvgUri } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import useTimer from '../hooks/useTimer';
import { useHandwrittenAnswerLogic } from '../hooks/useHandwrittenAnswerLogic';
import { useIntroSequence } from '../hooks/useIntroSequence';
import TutorialOverlay from '../components/TutorialOverlay'
import SkipButton from '../components/SkipButton'
import store from '../store/store';
import WisyHint from '../components/WisyHint';
import OverlayHint from '../components/OverlayHint';

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
            
                    const fileInfo = await FileSystem.getInfoAsync(uri);
                    if (!fileInfo.exists) throw new Error('File does not exist');
            
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
    
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentLine([`${locationX},${locationY}`]);
        },
        onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentLine((prev) => [...prev, `${locationX},${locationY}`]);
        },
        onPanResponderRelease: () => {
        setLines((prev) => [...prev, currentLine]);
        setCurrentLine([]);
        },
    });
    
    useEffect(() => {
        isActive.current = true;
        start();
                      
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    return (
        <Animated.View entering={ZoomInEasyDown} style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, justifyContent: 'center', alignItems: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{width: windowWidth * (592 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                
                <View style={{borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                    {data.content.first_image.endsWith(".svg") ? 
                    <SvgUri uri={data.content.first_image} width={ windowWidth * (136 / 800)} height={Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)} style={{borderRadius: 10}}/>
                    : 
                    <Image source={{uri: data.content.first_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), borderRadius: 10}}/>}
                </View>
                
                <Text style={{fontSize: 80, fontWeight: '600', color: '#555555'}}>{data.content.operation === 'addition'? '+' : ''}</Text>
                
                <View style={{borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                    {data.content.second_image.endsWith(".svg") ?
                    <SvgUri uri={data.content.second_image} width={ windowWidth * (136 / 800)} height={Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)} style={{borderRadius: 10}}/> 
                    : 
                    <Image source={{uri: data.content.second_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), borderRadius: 10}}/>}
                </View>

                <Text style={{fontSize: 80, fontWeight: '600', color: '#555555'}}>=</Text>

                <ViewShot ref={viewShotRef} style={{borderRadius: 10, backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}} options={{ format: 'png', quality: 1 }}>  
                    <View
                        {...panResponder.panHandlers}
                        style={{backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), borderRadius: 10}}
                    >
                        <Svg height='100%' width='100%'>
                        {lines.map((line, index) => (
                            <Polyline
                            key={index}
                            points={line.join(' ')}
                            stroke="#504297"
                            strokeWidth="3"
                            fill="none"
                            />
                        ))}
                        <Polyline
                            points={currentLine.join(' ')}
                            stroke="#504297"
                            strokeWidth="3"
                            fill="none"
                        />
                        </Svg>
                    </View>
                </ViewShot>
            </View>}
            
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

        </Animated.View>
    )
}

export default Game8Screen;