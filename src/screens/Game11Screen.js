import React, { useState, useRef, useEffect } from 'react';
import { View, Text, useWindowDimensions, PanResponder, Image, TouchableOpacity, Platform, Vibration, Share } from 'react-native';
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
import Game8Tutorial from '../components/Game8Tutorial';

const Game11Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const sound = React.useRef(new Audio.Sound());
    const audio = data?.content?.audio

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const word = `${data?.content?.word}`.split('');

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);
    const [wisySpeaking, setWisySpeaking] = useState(false)
    
    const lottieRef = useRef(null);
    const timeoutRef = useRef(null);
    const viewShotRef = useRef(null);

    // console.log(data)
    
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
            await playSoundWithoutStopping.stop()
            await playSound.stop()
            try {
                setLock(true)
                if (level === introTaskIndex && introAudio && introText && (!tutorialShow || tutorials.length == 0)) {
                    console.log('ran')
                    setWisySpeaking(true);
                    setText(introText);
                    await playSoundWithoutStopping(introAudio);
                }
            } catch (error) {
                console.log(error);
            } finally {
                try {
                    if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials.length == 0)) {
                        setText(data?.content?.question)
                        setWisySpeaking(true);
                        await playSound(data?.content?.speech);
                    }
                } catch (error) {
                    console.error("cОшибка при воспроизведении звука:", error);
                } finally {
                    setText(null);
                    setWisySpeaking(false)
                    setLock(false);
                }
            }
        }

        introPlay()

        return () => {
            playSound.stop()
            playSoundWithoutStopping.stop()
        }

    }, [data?.content?.speech, tutorialShow]);
                        
    const playVoice = async (sound) => {
        if (!isActive.current) return
        try {
            setWisySpeaking(true)
            await playSound(sound);
        } catch (error) {
            console.error("Ошибка при воспроизведении звука:", error);
        } finally {
            setText(null);
            setWisySpeaking(false)
            if (sound) {
                setId(null)
                setLock(false)
                setLines([])
            } else {
                setTimeout(() => {
                    setId(null)
                    setLock(false)
                    setLines([])
                }, 1500);
            }
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
                        
    // useEffect(() => {
    //     if (id?.id && id?.result) {
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current);
    //         }
    //         timeoutRef.current = setTimeout(() => {
    //             setId(null);
    //             setLines([]);
    //         }, 2500);
    //     }
    //     return () => {
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current);
    //         }
    //     };
    // }, [id]);
    
    const isActive = useRef(true);
    
    useEffect(() => {
        isActive.current = true;
    
        return () => {
            isActive.current = false;
        };
    }, []);
    
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

            // await Sharing.shareAsync(uri);

            return file;
        } catch (error) {
            console.error("Error saving and sharing image:", error);
        }
    };

    const answer = async() => {
        try {
            if (!isActive.current) return
            const lead_time = getTime();
            stop();
            setId(null)
            const image = await saveAndShareImage()
            // console.log(image)
            setThinking(true)
            setLock(true)
            const response = await api.answerHandWritten({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, images: [image], lead_time: lead_time, token: store.token, lang: store.language})
            if (!isActive.current) return
            if (response && response.stars && response.success && isActive.current) {
                if (!isActive.current) return
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: data.id, result: 'correct'})
                setText(response?.hint)
                
                try {
                    if (!isActive.current) return
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
                        setId(null);
                        setLock(false);
                        setLines([]);
                    }, 1500);
                }
                return;
            }
            else if (response && response.stars && !response.success && isActive.current) {
                if (!isActive.current) return
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response?.hint)
                
                try {
                    if (!isActive.current) return
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
                        setId(null)
                        setLock(false)
                        setLines([])
                    }, 1500);
                }
                return;
            }
            else if (response && !response.success && !response.to_next && isActive.current) {
                if (!isActive.current) return
                start()
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playVoice(response?.sound)
                setAttempt('2')
            } else if(response && response.success && isActive.current) {
                if (!isActive.current) return
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: data.id, result: 'correct'})
                setText(response.hint)

                try {
                    if (!isActive.current) return
                    setWisySpeaking(true)
                    await playSound(response?.sound)
                } catch (error) {
                    console.log(error)
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    if (sound) {
                        setId(null)
                        setLock(false)
                        setLines([])
                    } else {
                        setTimeout(() => {
                            setId(null)
                            setLock(false)
                            setLines([])
                        }, 1500);
                    }
                    setTimeout(() => {
                        setLevel(prev => prev + 1);
                        setAttempt('1');
                    }, 1500);
                }
            } else if(response && !response.success && response.to_next && isActive.current) {
                if (!isActive.current) return
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: data.id, result: 'wrong'})
                vibrate()
                setText(response.hint)
                try {
                    if (!isActive.current) return
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
                        setId(null)
                        setLock(false)
                        setLines([])
                    }, 1500);
                }
            }
        } catch (error) {
            // console.log(error)
            setLock(false)
            setText(error)
        } finally {
            setThinking(false)
        }
    };

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

    // {data.content.first_image.endsWith(".svg") ? <SvgUri uri={data.content.first_image} width={ windowWidth * (136 / 800)} height={Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)} /> : <Image source={{uri: data.content.first_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)}}/>}

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, justifyContent: 'center', alignItems: 'center'}}>
            {tutorialShow && tutorials?.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
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
                                            style={{ backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), height: Platform.isPad? windowWidth * (94 / 800) : windowHeight * (94 / 360), borderRadius: 8}}
                                        >
                                            <Svg height='100%' width='100%'>
                                            {lines.map((line, index) => (
                                                <Polyline
                                                    key={index}
                                                    points={line.join(' ')}
                                                    stroke="#504297"
                                                    strokeWidth="2"
                                                    fill="none"
                                                />
                                            ))}
                                            <Polyline
                                                points={currentLine.join(' ')}
                                                stroke="#504297"
                                                strokeWidth="2"
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
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && 
            <View style={{width: windowWidth * (255 / 800), position: 'absolute', left: 0, bottom: 0, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
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
            </View>}
            {tutorialShow && tutorials?.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', alignSelf: 'flex-end', borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
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
    );
};

export default Game11Screen;


