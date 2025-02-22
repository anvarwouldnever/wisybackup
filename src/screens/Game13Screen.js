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
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'

const Game13Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
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

    // console.log(data)

    const { getTime, start, stop, reset } = useTimer();

    useEffect(() => {
            const introPlay = async() => {
                try {
                    setWisySpeaking(true);
                    setText(introText);
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
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer, lead_time: lead_time, token: store.token, lang: store.language})
            playVoice(response?.sound)
            if (response && response.stars && response.success) {
                reset();
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                setId({id: answer, result: 'correct'})
                setText(response?.hint)
               
                setTimeout(() => {
                    setStars(response?.stars);
                    setEarnedStars(response?.stars - response?.old_stars)
                    setLevel(prev => prev + 1);
                }, 1500);
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
                
                setTimeout(() => {
                    setStars(response?.stars);
                    setEarnedStars(response?.stars - response?.old_stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && !response.success && !response.to_next) {
                start()
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)
                
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
                
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                }, 1500);
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
    }

    const RenderGame13Component = () => {

        const options = [{num: '1'}, {num: '2'}, {num: '3'}];

        return (
            <View style={{width: windowWidth * (592 / 800), height: windowHeight * (160 / 360), flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{width: '100%', height: windowHeight * (40 / 360), justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#222222', fontWeight: '600', fontSize: windowWidth * (24 / 800)}}>{data.content.question}</Text>
                </View>
                <View style={{width: 'auto', gap: 16, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    {data && data.content.options && data.content.options.map((option, index) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                    answer({ answer: option.id })
                                    if (timeoutRef.current) {
                                        clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                                    }
                                    setId(null);
                                }} key={index} style={{width: windowWidth * (80 / 800), height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), backgroundColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? 'red' : 'white', borderColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? '#D81616' : 'white', borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                                <Text style={{fontWeight: '600', fontSize: windowWidth * (24 / 800), color: id?.id == null? 'black' : id?.id != null && id?.id == option.id? 'black' : '#D4D1D1'}}>{option.text}</Text>
                                {/* {id?.id == option?.id && <View style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360), position: 'absolute', top: 5, right: 5, backgroundColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                                    <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (8 / 800), height: windowHeight * (8 / 360)}}/>
                                </View>} */}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }

    return (
        <Animated.View entering={ZoomInEasyDown} style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, flexDirection: 'row', justifyContent: 'center'}}>
            <RenderGame13Component />
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
                <Game3TextAnimation text={text} thinking={thinking}/>
            </View>
        </Animated.View>
    )
}

export default Game13Screen;