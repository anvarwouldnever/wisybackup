import { View, Text, Platform, useWindowDimensions, Image, FlatList, PanResponder, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Svg, Polyline } from 'react-native-svg';
import { SvgUri } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import useTimer from '../hooks/useTimer';
import { useHandwrittenAnswerLogic } from '../hooks/useHandwrittenAnswerLogic';
import { useIntroSequence } from '../hooks/useIntroSequence';
import WisyHint from '../components/WisyHint';
import SkipButton from '../components/SkipButton';
import TutorialOverlay from '../components/TutorialOverlay';
import store from '../store/store';
import OverlayHint from '../components/OverlayHint';

const Game9Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {
    
    let images = data?.content?.images
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
    const [wisySpeaking, setWisySpeaking] = useState(false)

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

    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return isSvg ? (
            <SvgUri 
                uri={item.url} 
                width={windowWidth * (64 / 800)} 
                height={Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360)} 
                style={{borderRadius: 10}}
            />
        ) : (
            <Image 
                source={{ uri: item.url }} 
                style={{ 
                    width: windowWidth * (64 / 800), 
                    height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360),
                    borderRadius: 10
                }} 
                resizeMode="contain" 
            />
        );
    };
    
    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}
            
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{alignItems: 'center', width: windowWidth * (602 / 800), height: Platform.isPad? windowWidth * (239 / 800) : windowHeight * (239 / 360), flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{width: windowWidth * (602 / 800), height: Platform.isPad? windowWidth * (84 / 800) : windowHeight * (84 / 360), alignItems: 'center', borderRadius: 10, overflow: 'hidden', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                    <FlatList 
                        data={images}
                        renderItem={renderItem}
                        contentContainerStyle={{backgroundColor: 'white', alignItems: 'center', borderRadius: 10, gap: windowWidth * (10 / 800), padding: 10}}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                        scrollEnabled={false }
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: windowWidth * (292 / 800), height: windowHeight * (115 / 360)}}>
                    <View style={{width: windowWidth * (115 / 800), height: Platform.isPad? windowWidth * (115 / 800) : windowHeight * (115 / 360), backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                        {data.content.question_image.endsWith('.svg') ? (
                            <SvgUri 
                                uri={data?.content?.question_image} 
                                width={windowWidth * (80 / 800)} 
                                height={windowHeight * (80 / 360)} 
                            />
                        ) : (
                            <Image 
                                source={{ uri: data?.content?.question_image }} 
                                style={{
                                    width: windowWidth * (80 / 800), 
                                    height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360)
                                }}
                            />
                        )}
                    </View>
                    <Text style={{fontSize: 40, fontWeight: '600', color: '#504297'}}>=</Text>
                    <ViewShot ref={viewShotRef} style={{backgroundColor: 'white', borderRadius: 10,}} options={{ format: 'png', quality: 1 }}>
                        <View
                            {...panResponder.panHandlers}
                            style={{width: windowWidth * (115 / 800), height: Platform.isPad? windowWidth * (115 / 800) : windowHeight * (115 / 360), backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}
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
                    setTutorialShow(false)
                }}
            /> 
            
            {lines.length != 0 && <TouchableOpacity onPress={lock? () => {return} : () => {
                answer()
                setId(null);
                }} style={{width: windowWidth * (120 / 800), backgroundColor: '#FF69B4', borderRadius: 100, height: Platform.isPad? windowWidth * (50 / 800) : windowHeight * (50 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0}}>
                <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>}

        </View>
    )
}

export default Game9Screen;