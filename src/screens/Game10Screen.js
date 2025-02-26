import { View, Text, useWindowDimensions, Platform, Image, TouchableOpacity, PanResponder, Vibration } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Game8Tutorial from '../components/Game8Tutorial';
import { useNavigation } from '@react-navigation/native';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import wisy from '../images/pandaHead.png'
import Svg, { Polyline } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import api from '../api/api'
import store from '../store/store';
import * as FileSystem from 'expo-file-system';
import { playSound } from '../hooks/usePlayBase64Audio';
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation';
import useTimer from '../hooks/useTimer';
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'

const Game10Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const viewShotRef = useRef(null);

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
    const [wisySpeaking, setWisySpeaking] = useState(false)
        const lottieRef = useRef(null);
    
        useEffect(() => {
            if (wisySpeaking) {
                setTimeout(() => {
                    lottieRef.current?.play(180, 0);
                }, 1);
            } else {
                setTimeout(() => {
                    lottieRef.current?.reset();
                }, 1);
            }
        }, [wisySpeaking]);

    const { getTime, start, stop, reset } = useTimer();

    useEffect(() => {
            const introPlay = async() => {
                try {
                    setLock(true)
                    if (level === introTaskIndex && (!tutorialShow || tutorials == 0)) {
                                            setWisySpeaking(true);
                                            setText(introText);
                                            await playSoundWithoutStopping(introAudio);
                                        }
                } catch (error) {
                    console.log(error)
                } finally {
                    try {
                        if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials == 0)) {
                                                    setText(data?.content?.question)
                                                    setWisySpeaking(true);
                                                    await playSound(data?.content?.speech);
                                                }
                    } catch (error) {
                        console.error("cОшибка при воспроизведении звука:", error);
                    } finally {
                        setText(null);
                        setWisySpeaking(false)
                        setLock(false)
                    }
                }
            }
    
            introPlay()
        }, [data?.content?.speech, tutorialShow]);
                
                    const playVoice = async (sound) => {
                        try {
                            setWisySpeaking(true)
                            await playSound(sound);
                        } catch (error) {
                            console.error("Ошибка при воспроизведении звука:", error);
                        } finally {
                            setText(null);
                            setWisySpeaking(false)
                            setLock(false)
                        }
                    };

    useEffect(() => {
        start();
        return () => {
            reset();
        }
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

    const vibrate = () => {
                Vibration.vibrate(500);
            };

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
            const image = await saveAndShareImage()
            setThinking(true)
            setLock(true)
            const response = await api.answerHandWritten({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, images: [image], lead_time: lead_time, token: store.token, lang: store.language})
            if (response && response.stars && !response.success) {
                reset()
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                vibrate()
                setId({id: data.id, result: 'wrong'})
                setText(response?.hint)
                
                try {
                    setWisySpeaking(true)
                    await playSound(response?.sound)
                } catch (error) {
                    console.log(error)
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    setTimeout(() => {
                        setStars(response?.stars);
                        setEarnedStars(response?.stars - response?.old_stars)
                        setLevel(prev => prev + 1);
                        setLock(false)
                    }, 1500);
                }
                return;
            }
            else if (response && response.stars && response.success) {
                reset()
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: data.id, result: 'correct'})
                setText(response.hint)
                
                try {
                    setWisySpeaking(true)
                    await playSound(response?.sound)
                } catch (error) {
                    console.log(error)
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    setTimeout(() => {
                        setStars(response?.stars);
                        setEarnedStars(response?.stars - response?.old_stars)
                        setLevel(prev => prev + 1);
                        setLock(false)
                    }, 1500);
                }
                return;
            }
            else if (response && !response.success && !response.to_next) {
                start()
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playVoice(response?.sound)
                setAttempt('2')
            } else if(response && response.success) {
                reset()
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: data.id, result: 'correct'})
                setText(response.hint)

                try {
                    setWisySpeaking(true)
                    await playSound(response?.sound)
                } catch (error) {
                    console.log(error)
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    setTimeout(() => {
                        setLevel(prev => prev + 1);
                        setAttempt('1');
                        setLock(false)
                    }, 1500);
                }
            } else if(response && !response.success && response.to_next) {
                reset()
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response.hint)
                try {
                    setWisySpeaking(true)
                    await playSound(response?.sound)
                } catch (error) {
                    console.log(error)
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    setTimeout(() => {
                        setLevel(prev => prev + 1);
                        setAttempt('1');
                        setLock(false)
                    }, 1500);
                }
            }
        } catch (error) {
            setLock(false)
        } finally {
            setThinking(false)
        }
    };


    return (
        <View entering={ZoomInEasyDown} style={{position: 'absolute', top: 24, width: windowWidth - 60, height: windowHeight - 60, alignItems: 'center', justifyContent: 'center'}}>
            {tutorialShow && tutorials.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
            {(!tutorialShow || tutorials == 0) && <View style={{width: windowWidth * (408 / 800), height: windowHeight * (184 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: windowWidth * (184 / 800), height: Platform.isPad? windowWidth * (184 / 800) : windowHeight * (184 / 360), borderRadius: 10}}>
                    <Text style={{fontSize: 112, color: "#504297", fontWeight: '600', textAlign: 'center'}}>A</Text>
                </View>
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>  
                    <View
                        {...panResponder.panHandlers}
                        style={{backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: windowWidth * (184 / 800), height: Platform.isPad? windowWidth * (184 / 800) : windowHeight * (184 / 360), borderRadius: 10}}
                    >
                        <Svg height='100%' width='100%'>
                        {lines.map((line, index) => (
                            <Polyline
                            key={index}
                            points={line.join(' ')}
                            stroke="#504297"
                            strokeWidth="4"
                            fill="none"
                            />
                        ))}
                        <Polyline
                            points={currentLine.join(' ')}
                            stroke="#504297"
                            strokeWidth="4"
                            fill="none"
                        />
                        </Svg>
                    </View>
                </ViewShot>
            </View>}
            {(!tutorialShow || tutorials == 0) && <View style={{width: windowWidth * (730 / 800), height: Platform.isPad? windowWidth * (64 / 800) : 'auto', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0}}>
                <View style={{width: 'auto', height: Platform.isPad? windowWidth * (150 / 800) : 'auto', alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
                    <LottieView
                        ref={lottieRef}
                        resizeMode="cover"
                        source={speakingWisy}
                        style={{
                            width: windowWidth * (64 / 800),
                            height: Platform.isPad ? windowWidth * (64 / 800) : windowHeight * (64 / 360),
                            aspectRatio: 64 / 64,
                        }}
                        autoPlay={false}
                        loop={true}
                    />
                    {text && text != '' && <Game3TextAnimation text={text} thinking={thinking}/>}
                </View>
            </View>}
            {tutorialShow && tutorials.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', alignSelf: 'flex-end', borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                                  Skip
                                </Text>
                            </TouchableOpacity>}
            {lines.length != 0 && <TouchableOpacity onPress={lock? () => {return} : () => {
                    answer()
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                    }
                    setId(null);
                }} style={{width: windowWidth * (120 / 800), backgroundColor: '#FF69B4', borderRadius: 100, height: Platform.isPad? windowWidth * (50 / 800) : windowHeight * (50 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0}}>
                <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>}
        </View>
    )
}

export default Game10Screen;


        // const fileName = uri.split('/').pop();
        // const destinationUri = `${FileSystem.documentDirectory}${fileName}`;

        // await FileSystem.copyAsync({
        //     from: uri,
        //     to: destinationUri,
        // });

        // if (await Sharing.isAvailableAsync()) {
        //     await Sharing.shareAsync(destinationUri);
        // } else {
        //     console.log("Sharing is not available on this platform.");
        // }
        // } catch (error) {
        // console.error("Error saving and sharing image:", error);