import React, { useState, useRef, useEffect } from 'react';
import { View, Text, useWindowDimensions, PanResponder, Image, TouchableOpacity, Platform} from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import speaker from '../images/speaker2.png'
import { Audio } from 'expo-av';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { SvgUri } from 'react-native-svg';
import useTimer from '../hooks/useTimer';
import { useHandwrittenAnswerLogic } from '../hooks/useHandwrittenAnswerLogic';
import { useIntroSequence } from '../hooks/useIntroSequence';
import WisyHint from '../components/WisyHint';
import SkipButton from '../components/SkipButton';
import TutorialOverlay from '../components/TutorialOverlay';
import store from '../store/store';
import OverlayHint from '../components/OverlayHint';

const Game11Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const sound = React.useRef(new Audio.Sound());
    const audio = data?.content?.audio;

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
    
            // Найти индекс *
            const index = word.findIndex((letter) => letter === '*');
    
            return [{ image: file, index }];
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

    const voiceForTask = async(sound) => {
        if (!sound) return
        try {
            
        } catch (error) {
            setText('error loading the sound')
            setLock(false)
        } finally {
            setLock(false)
        }
    }

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, justifyContent: 'center', alignItems: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{ minWidth: windowWidth * (320 / 800), height: Platform.isPad? windowWidth * (260 / 800) : windowHeight * (260 / 360), alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute'}}>
                <View style={{ width: windowWidth * (244 / 800), height: Platform.isPad? windowWidth * (140 / 800) : windowHeight * (140 / 360), backgroundColor: '#FFFFFF', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                {data?.content?.image.endsWith(".svg") ? <SvgUri uri={data?.content?.image} width={windowWidth * (108 / 800)} height={Platform.isPad? windowWidth * (108 / 800) : windowHeight * (108 / 360)} /> : <Image source={{ uri: data?.content?.image }} style={{width: windowWidth * (108 / 800), height: Platform.isPad? windowWidth * (108 / 800) : windowHeight * (108 / 360)}}/>}
                    <TouchableOpacity onPress={lock? () => {return} : () => voiceForTask(audio)} style={{width: windowWidth * (64 / 800), borderWidth: 1, height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), borderRadius: 100, backgroundColor: '#B3ABDB', borderColor: '#DFD0EE', borderWidth: 4, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={speaker} style={{width: windowWidth * (30 / 800), height: Platform.isPad? windowWidth * (30 / 800) : windowHeight * (30 / 360)}}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    {word.map((letter, index) => {
                        const isUnknown = letter === '*';

                        return (
                            <View key={index} style={{ width: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), height: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                {isUnknown ? (
                                    <ViewShot ref={viewShotRef} style={{borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? "#ADD64D" : id?.id == data.id && id?.result == 'wrong'? '#D81616' : '#504297', borderRadius: 10, borderWidth: 2}} options={{ format: 'png', quality: 1 }}>  
                                        <View
                                            {...panResponder.panHandlers}
                                            style={{ backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), height: Platform.isPad? windowWidth * (94 / 800) : windowHeight * (94 / 360), borderRadius: 8}}
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
                                ) : (
                                    <Text style={{ fontSize: 64, fontWeight: '600', textAlign: 'center', color: '#504297' }}>{letter}</Text>
                                )}
                            </View>
                        );
                    })}
                </View>
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
                    setTutorialShow(false);
                }}
            />

            {lines.length != 0 && <TouchableOpacity onPress={lock? () => {return} : () => {
                answer()
                setId(null);
                }} style={{width: windowWidth * (120 / 800), backgroundColor: '#FF69B4', borderRadius: 100, height: Platform.isPad? windowWidth * (50 / 800) : windowHeight * (50 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0}}>
                <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>}

        </View>
    );
};

export default Game11Screen;


