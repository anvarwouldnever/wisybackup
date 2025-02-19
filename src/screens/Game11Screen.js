import React, { useState, useRef, useEffect } from 'react';
import { View, Text, useWindowDimensions, PanResponder, Image, TouchableOpacity, Platform, Vibration } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import lion from '../images/pig.png'
import speaker from '../images/speaker2.png'
import store from '../store/store';
import { Audio } from 'expo-av';
import api from '../api/api'
import wisy from '../images/pandaHead.png'
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { playSound } from '../hooks/usePlayBase64Audio';
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation';
import { SvgUri } from 'react-native-svg';
import useTimer from '../hooks/useTimer';
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'

const Game11Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio}) => {

    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const sound = React.useRef(new Audio.Sound());
    const audio = data?.content?.audio

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const word = `${data?.content?.word}`.split('');

    const viewShotRef = useRef(null);

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);

    const [wisySpeaking, setWisySpeaking] = useState(false)
        const lottieRef = useRef(null);
    
        useEffect(() => {
            if (wisySpeaking) {
                setTimeout(() => {
                    lottieRef.current?.play();
                }, 1);
            } else {
                lottieRef.current?.reset();
            }
        }, [wisySpeaking]);

    const { getTime, start, stop, reset } = useTimer();

    useEffect(() => {
            const introPlay = async() => {
                try {
                    await playSoundWithoutStopping(introAudio)
                } catch (error) {
                    console.log(error)
                } finally {
                    try {
                        setText(data?.content?.question)
                        setWisySpeaking(true);
                        await playSound(data?.content?.speech);
                    } catch (error) {
                        console.error("cОшибка при воспроизведении звука:", error);
                    } finally {
                        setText(null);
                        setWisySpeaking(false)
                    }
                }
            }
    
            introPlay()
        }, [data?.content?.speech]);
                        
                            const playVoice = async (sound) => {
                                try {
                                    setWisySpeaking(true)
                                    await playSound(sound);
                                } catch (error) {
                                    console.error("Ошибка при воспроизведении звука:", error);
                                } finally {
                                    setText(null);
                                    setWisySpeaking(false)
                                }
                            };

    useEffect(() => {
        
        start();
        return () => {
            reset();
        }
    }, [])

    useEffect(() => {
        return () => {
            sound.current.unloadAsync();
        };
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
                            }, [id]);
    
    const vibrate = () => {
                Vibration.vibrate(500);
            };

    const voice = async () => {
        try {
            store.setPlayingMusic(false);
            await sound.current.loadAsync({ uri: audio });
            await sound.current.playAsync();
    
            sound.current.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    store.setPlayingMusic(true);
                    sound.current.unloadAsync();
                }
            });
        } catch (error) {
            console.log("Error playing audio:", error);
            await sound.current.unloadAsync();
        }
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
            // console.log(image)
            setThinking(true)
            const response = await api.answerHandWritten({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, images: [image], lead_time: lead_time, token: store.token, lang: store.language})
            playVoice(response?.sound)
            if (response && response.stars && response.success) {
                reset()
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: data.id, result: 'correct'})
                setText(response?.hint)
                
                setTimeout(() => {
                    setStars(response?.stars);
                    setEarnedStars(response?.stars - response?.old_stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && response.stars && !response.success) {
                reset()
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response?.hint)
                
                setTimeout(() => {
                    setStars(response?.stars);
                    setEarnedStars(response?.stars - response?.old_stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && !response.success && !response.to_next) {
                start()
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response.hint)
                
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
                
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                }, 1500);
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

    // {data.content.first_image.endsWith(".svg") ? <SvgUri uri={data.content.first_image} width={ windowWidth * (136 / 800)} height={Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)} /> : <Image source={{uri: data.content.first_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)}}/>}

    return (
        <View style={{ position: 'absolute', top: 24, width: windowWidth - 60, height: windowHeight - 60, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{ minWidth: windowWidth * (320 / 800), height: Platform.isPad? windowWidth * (260 / 800) : windowHeight * (260 / 360), alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute'}}>
                <View style={{ width: windowWidth * (244 / 800), height: Platform.isPad? windowWidth * (140 / 800) : windowHeight * (140 / 360), backgroundColor: '#FFFFFF', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                {data.content.image.endsWith(".svg") ? <SvgUri uri={data.content.image} width={windowWidth * (108 / 800)} height={Platform.isPad? windowWidth * (108 / 800) : windowHeight * (108 / 360)} /> : <Image source={{ uri: data.content.image }} style={{width: windowWidth * (108 / 800), height: Platform.isPad? windowWidth * (108 / 800) : windowHeight * (108 / 360)}}/>}
                    <TouchableOpacity onPress={() => voice()} style={{width: windowWidth * (64 / 800), borderWidth: 1, height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), borderRadius: 100, backgroundColor: '#B3ABDB', borderColor: '#DFD0EE', borderWidth: 4, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={speaker} style={{width: windowWidth * (30 / 800), height: Platform.isPad? windowWidth * (30 / 800) : windowHeight * (30 / 360)}}/>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    {word.map((letter, index) => {
                        const isUnknown = letter === '*';

                        return (
                            <View key={index} style={{ width: windowWidth * (96 / 800), height: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                                {isUnknown ? (
                                    <ViewShot ref={viewShotRef} style={{borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? "#ADD64D" : id?.id == data.id && id?.result == 'wrong'? '#D81616' : '#504297', borderRadius: 10, borderWidth: 2}} options={{ format: 'png', quality: 1 }}>  
                                        <View
                                            {...panResponder.panHandlers}
                                            style={{ backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: windowWidth * (94 / 800), height: Platform.isPad? windowWidth * (94 / 800) : windowHeight * (94 / 360), borderRadius: 8}}
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
                                ) : (
                                    <Text style={{ fontSize: 64, fontWeight: '600', textAlign: 'center', color: '#504297' }}>{letter}</Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
            <View style={{width: 'auto', position: 'absolute', left: 0, bottom: 0, height: Platform.isPad? windowWidth * (150 / 800) : windowHeight * (80 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
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
                <Game3TextAnimation text={text} thinking={thinking}/>
            </View>
            {lines.length != 0 && <TouchableOpacity onPress={() => {
                answer()
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                }
                setId(null);
                }} style={{width: windowWidth * (120 / 800), backgroundColor: '#FF69B4', borderRadius: 100, height: Platform.isPad? windowWidth * (50 / 800) : windowHeight * (50 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0}}>
                <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>}
        </View>
    );
};

export default Game11Screen;


