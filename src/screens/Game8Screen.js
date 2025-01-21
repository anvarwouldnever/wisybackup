import { View, Text, useWindowDimensions, Platform, Image, TouchableOpacity, PanResponder, Vibration } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Game8Tutorial from '../components/Game8Tutorial';
import { useNavigation } from '@react-navigation/native';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import wisy from '../images/pandaHead.png'
import Svg, { Polyline, SvgUri } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { playSound } from '../hooks/usePlayBase64Audio';
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation';
import api from '../api/api'
import store from '../store/store';
import useTimer from '../hooks/useTimer';

const Game8Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask }) => {

    // console.log(data.content.second_image, data.content.first_image)
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [tutorial, setTutorial] = useState(true);
    const viewShotRef = useRef(null);
    
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);

    const [text, setText] = useState(data.content.wisy_question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);

    const { getTime, start, stop, reset } = useTimer();

    useEffect(() => {
        start();
        return () => {
            reset();
        }
    }, [])

    const timeoutRef = useRef(null);
            
                useEffect(() => {
                    if (id?.id && id?.result) {
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                        timeoutRef.current = setTimeout(() => {
                            setId(null);
                            setLines([]);
                        }, 2500);
                    }
                    return () => {
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                    };
                }, [id, setId]);

    const vibrate = () => {
                Vibration.vibrate(500);
            };
    
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

            return file;
        } catch (error) {
            console.error("Error saving and sharing image:", error);
        }
    };

    const answer = async() => {
        try {
            const lead_time = getTime();
            stop();
            setId(null)
            const image = await saveAndShareImage()
            setThinking(true)
            const response = await api.answerHandWritten({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, images: [image], lead_time: lead_time})
            if (response && response.stars && response.success) {
                reset()
                onCompleteTask(subCollectionId, data.next_task_id)
                setId({id: data.id, result: 'correct'})
                setText(response?.hint)
                playSound(response?.sound)
                setTimeout(() => {
                    setStars(response.stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && response.stars && !response.success) {
                reset()
                onCompleteTask(subCollectionId, data.next_task_id)
                vibrate()
                setId({id: data.id, result: 'wrong'})
                setText(response?.hint)
                playSound(response?.sound)
                setTimeout(() => {
                    setStars(response.stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && !response.success && !response.to_next) {
                start()
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playSound(response.sound)
                setAttempt('2')
            } else if(response && response.success) {
                reset()
                onCompleteTask(subCollectionId, data.next_task_id)
                setId({id: data.id, result: 'correct'})
                setText(response.hint)
                playSound(response.sound)
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                }, 1500);
            } else if(response && !response.success && response.to_next) {
                reset()
                onCompleteTask(subCollectionId, data.next_task_id)
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response.hint)
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                }, 1500);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setThinking(false)
        }
    };

    return (
        <Animated.View entering={ZoomInEasyDown} style={{position: 'absolute', top: 24, width: windowWidth - 60, height: windowHeight - 60, alignItems: 'center', justifyContent: 'center'}}>
            {tutorial && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial />
            </View>}
            {!tutorial && <View style={{width: windowWidth * (592 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                {data.content.first_image.endsWith(".svg") ? <SvgUri uri={data.content.first_image} width={ windowWidth * (136 / 800)} height={Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)} /> : <Image source={{uri: data.content.first_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)}}/>}
                <Text style={{fontSize: 80, fontWeight: '600', color: '#555555'}}>{data.content.operation === 'addition'? '+' : ''}</Text>
                {data.content.second_image.endsWith(".svg") ? <SvgUri uri={data.content.second_image} width={ windowWidth * (136 / 800)} height={windowHeight * (136 / 360)} /> : <Image source={{uri: data.content.second_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)}}/>}
                <Text style={{fontSize: 80, fontWeight: '600', color: '#555555'}}>=</Text>
              
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>  
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
                            strokeWidth="6"
                            fill="none"
                            />
                        ))}
                        <Polyline
                            points={currentLine.join(' ')}
                            stroke="#504297"
                            strokeWidth="6"
                            fill="none"
                        />
                        </Svg>
                    </View>
                </ViewShot>
            </View>}
            <View style={{width: windowWidth * (730 / 800), height: Platform.isPad? windowWidth * (64 / 800) : 'auto', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0}}>
                <View style={{width: 'auto', height: Platform.isPad? windowWidth * (150 / 800) : windowWidth * (85 / 800), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
                    <Image source={wisy} style={{width: windowWidth * (64 / 800), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), aspectRatio: 64 / 64}}/>
                    <Game3TextAnimation text={text} thinking={thinking}/>
                </View>
                {tutorial && <TouchableOpacity onPress={() => setTutorial(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', alignSelf: 'flex-end', borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                      Skip
                    </Text>
                </TouchableOpacity>}
            </View>
            {lines.length != 0 && <TouchableOpacity onPress={() => {
                    answer()
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                    }
                    setId(null)
                }} style={{width: windowWidth * (120 / 800), backgroundColor: '#FF69B4', borderRadius: 100, height: Platform.isPad? windowWidth * (50 / 800) : windowHeight * (50 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0}}>
                <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>}
        </Animated.View>
    )
}

export default Game8Screen;