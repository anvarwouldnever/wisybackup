import { View, Text, Image, useWindowDimensions, Platform, TouchableOpacity, Vibration } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation'
import wisy from '../images/pandaHead.png'
import api from '../api/api'
import { playSound } from '../hooks/usePlayBase64Audio'
import store from '../store/store'
import galochka from '../images/galochka.png'
import x from '../images/wrongX.png'
import useTimer from '../hooks/useTimer'
import { SvgUri } from 'react-native-svg'
import speaker from '../images/tabler_speakerphone.png'
import { playSound2 } from '../hooks/usePlaySound2'
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'
import Game8Tutorial from '../components/Game8Tutorial'

const Game16Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
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

    useEffect(() => {
            const introPlay = async() => {
                try {
                    setLock(false)
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
                        setLock(true)
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
            setWisySpeaking(false)
            setText(null);
            setLock(false)
        }
    }

    useEffect(() => {
        if (!text) return;
        const timeoutId = setTimeout(() => {
            setText(null);
        }, 3000);
    
        return () => clearTimeout(timeoutId);
    }, [text]); 

    const { getTime, start, stop, reset } = useTimer();

    useEffect(() => {
        start();
        return () => {
            reset();
        }
    }, [])

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
            }, 2500);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [id]);

    const answer = async({ answer }) => {
        try {
            const lead_time = getTime();
            stop();
            setId(null)
            setThinking(true)
            setLock(true)
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer, lead_time: lead_time, token: store.token, lang: store.language})
            if (response && response.stars && response.success) {
                reset();
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: answer, result: 'correct'})
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
            else if (response && response.stars && !response.success) {
                reset();
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: answer, result: 'wrong'})
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
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playVoice(response?.sound)
                setAttempt('2')
            } else if(response && response.success) {
                reset();
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: answer, result: 'correct'})
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
                reset();
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: answer, result: 'wrong'})
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
            console.log(error)
            setLock(false)
        } finally {
            setThinking(false)
        }
    }
    const animal = data?.content?.image?.url
    const isAnimalSvg = data?.content?.image?.url && data?.content?.image?.url.endsWith('.svg');

    const RenderGame13Component = () => {

        return (
            <View style={{width: windowWidth * (392 / 800), height: windowHeight * (280 / 360), flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center'}}>
                <View style={{backgroundColor: '', borderRadius: 10, width: 'auto', height: 'auto'}}>
                    {animal ? (
                        isAnimalSvg ? (
                            <SvgUri uri={animal} style={{ width: windowWidth * (176 / 800), height: windowHeight * (176 / 360)}} />
                            ) : (
                            <Image source={{ uri: animal }} style={{ width: windowWidth * (176 / 800), height: Platform.isPad? windowWidth * (176 / 800) : windowHeight * (176 / 360), resizeMode: 'contain' }} />
                        )
                    ) : null}
                </View>
                <View style={{width: windowWidth * (575 / 800), gap: 16, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    {data && data.content.options && data.content.options.map((option: any, index: any) => {
                        return !option.audio ? (
                            <TouchableOpacity
                              key={index}
                              onPress={lock? () => {return} : () => {
                                answer({ answer: option.id });
                                if (timeoutRef.current) {
                                  clearTimeout(timeoutRef.current);
                                }
                                setId(null);
                              }}
                              style={{
                                width: windowWidth * (120 / 800),
                                height: Platform.isPad ? windowWidth * (56 / 800) : windowHeight * (56 / 360),
                                backgroundColor:
                                  id?.id == option.id && id?.result == 'correct'
                                    ? '#ADD64D'
                                    : id?.id == option.id && id?.result == 'wrong'
                                    ? 'red'
                                    : 'white',
                                borderColor:
                                  id?.id == option.id && id?.result == 'correct'
                                    ? '#ADD64D'
                                    : id?.id == option.id && id?.result == 'wrong'
                                    ? '#D81616'
                                    : 'white',
                                borderWidth: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 100,
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: '600',
                                  fontSize: windowWidth * (14 / 800),
                                  color: id?.id == null ? 'black' : id?.id != null && id?.id == option.id ? 'black' : '#D4D1D1',
                                }}
                              >
                                {option.text}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View key={index} style={{width: windowWidth * (181 / 800), height: Platform.isPad ? windowWidth * (40 / 800) : windowHeight * (40 / 360), flexDirection: 'row', gap: 5}}>
                                <TouchableOpacity style={{width: windowWidth * (131 / 800), height: Platform.isPad ? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                                    <Text
                                        style={{
                                        fontWeight: '600',
                                        fontSize: windowWidth * (12 / 800),
                                        color: id?.id == null ? 'black' : id?.id != null && id?.id == option.id ? 'black' : '#D4D1D1',
                                        }}
                                    >
                                        {option.text}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => playSound2(option.audio)} style={{width: windowWidth * (46 / 800), height: Platform.isPad ? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: '#B3ABDB', borderRadius: 100, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={speaker} style={{width: windowWidth * (24 / 800), height:  windowWidth * (24 / 800)}}/>
                                </TouchableOpacity>
                            </View>
                          );
                        })}
                </View>
            </View>
        )
    }

    return (
        <Animated.View entering={ZoomInEasyDown} style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, flexDirection: 'row', justifyContent: 'center'}}>
            {tutorialShow && tutorials.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
            {(!tutorialShow || tutorials == 0) && <RenderGame13Component />}
            {(!tutorialShow || tutorials == 0) &&  <View style={{width: windowWidth * (255 / 800), position: 'absolute', left: 0, bottom: 0, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
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
            </View>}
            {tutorialShow && tutorials.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', alignSelf: 'flex-end', borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                                                                                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                                                                                  Skip
                                                                                </Text>
                                                                            </TouchableOpacity>}
        </Animated.View>
    )
}

export default Game16Screen;