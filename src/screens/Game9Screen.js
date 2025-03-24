import { View, Text, Platform, useWindowDimensions, Image, FlatList, PanResponder, TouchableOpacity, Vibration } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import wisy from '../images/pandaHead.png'
import { Svg, Polyline } from 'react-native-svg';
import { SvgUri } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { playSound } from '../hooks/usePlayBase64Audio';
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation';
import api from '../api/api'
import store from '../store/store';
import useTimer from '../hooks/useTimer';
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'
import Game8Tutorial from '../components/Game8Tutorial';

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
    const timeoutRef = useRef(null);
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

    // console.log(introAudio, introText)

    useEffect(() => {
        const introPlay = async() => {
            try {
                setLock(true)
                if (level === introTaskIndex && introAudio && introText && (!tutorialShow || tutorials.length == 0)) {
                    setWisySpeaking(true);
                    setText(introText);
                    await playSoundWithoutStopping(introAudio);
                }
            } catch (error) {
                console.log(error)
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
                    setWisySpeaking(false);
                    setLock(false);
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
                }, 1000);
            }
        }
    };

    useEffect(() => {
        start();
        return () => {
            reset();
        }
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

    const saveAndShareImage = async () => {
        try {
            const uri = await captureRef(viewShotRef, {
                format: 'png',
                quality: 0.8,
            });

            const fileInfo = await FileSystem.getInfoAsync(uri);
            console.log("File exists:", fileInfo.exists, "URI:", uri);
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
            const lead_time = getTime();
            stop();
            const image = await saveAndShareImage()
            setId(null)
            setThinking(true)
            setLock(true)
            // console.log(data.id, attempt, store.playingChildId.id, image, lead_time, store.token, store.language)
            const response = await api.answerHandWritten({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, images: [image], lead_time: lead_time, token: store.token, lang: store.language})
            // console.log(response)
            if (response && response.stars && response.success) {
                reset()
                if (isFromAttributes) {
                    store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: data.id, result: 'correct'})
                setText(response?.hint)
                
                try {
                    setWisySpeaking(true)
                    await playSound(response?.sound)
                } catch (error) {
                    console.log(error)
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    if (response?.sound) {
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
                        setStars(response?.stars);
                        setEarnedStars(response?.stars - response?.old_stars)
                        setLevel(prev => prev + 1);
                    }, 1500);
                }
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
                
                try {
                    setWisySpeaking(true)
                    await playSound(response?.sound)
                } catch (error) {
                    console.log(error)
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    if (response?.sound) {
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
                        setStars(response?.stars);
                        setEarnedStars(response?.stars - response?.old_stars)
                        setLevel(prev => prev + 1);
                    }, 1500);
                }
                return;
            }
            else if (response && !response.success && !response.to_next) {
                start();
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
                    if (response?.sound) {
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
                    if (response?.sound) {
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
            }
        } catch (error) {
            console.log(error)
            setLock(false)
        } finally {
            setThinking(false)
        }
    };

    return (
        <View style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {tutorialShow && tutorials?.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{alignItems: 'center', width: windowWidth * (602 / 800), height: Platform.isPad? windowWidth * (239 / 800) : windowHeight * (239 / 360), flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{width: windowWidth * (602 / 800), height: Platform.isPad? windowWidth * (84 / 800) : windowHeight * (84 / 360), alignItems: 'center', borderRadius: 10, overflow: 'hidden'}}>
                    <FlatList 
                        data={images}
                        renderItem={renderItem}
                        contentContainerStyle={{backgroundColor: 'white', alignItems: 'center', borderRadius: 10, gap: windowWidth * (10 / 800), padding: 10}}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                    />
                </View>
                <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: windowWidth * (292 / 800), height: windowHeight * (115 / 360)}}>
                    <View style={{width: windowWidth * (115 / 800), height: Platform.isPad? windowWidth * (115 / 800) : windowHeight * (115 / 360), backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
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
                </View>
            </View>}
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{width: 'auto', height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, left: 0}}>
                <View style={{width: windowWidth * (255 / 800), height: Platform.isPad? windowWidth * (150 / 800) : windowHeight * (85 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
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
    )
}

export default Game9Screen;