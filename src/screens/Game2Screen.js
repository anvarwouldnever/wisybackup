import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, useWindowDimensions, Image, Platform, Vibration } from "react-native"
import Game2Animals1Animation from "../animations/Game2/Game2Animals1Animation";
import wisy from '../images/pandaHead.png'
import Game2Text1Animation from "../animations/Game2/Game2Text1Animation";
import api from '../api/api'
import { playSound } from "../hooks/usePlayBase64Audio";
import store from "../store/store";
import useTimer from "../hooks/useTimer";
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'

const Game2Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question)
    const [attempt, setAttempt] = useState('1')
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

    // console.log(data)

    // useEffect(() => {
    //             if (!text) return;
    //             console.log("render")
    //             const timeoutId = setTimeout(() => {
    //                 setText(null);
    //             }, 3000);
            
    //             return () => clearTimeout(timeoutId);
    //         }, [text]); 

    useEffect(() => {
        start();
        return () => {
            reset();
        }
    }, [])

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

    const vibrate = () => {
        Vibration.vibrate(500);
    };

    const answer = async({ answer }) => {
        try {
            const lead_time = getTime();
            stop();
            setId(null);
            setThinking(true);
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer, lead_time: lead_time, token: store.token, lang: store.language})
            playVoice(response?.sound)
            if (response && response.stars && response.success) {
                reset()
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
                return;
            }
            else if (response && response.stars && !response.success) {
                reset()
                if (isFromAttributes) {
                            store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                vibrate()
                setId({id: answer, result: 'wrong'})
                setText(response.hint)
                
                setTimeout(() => {
                    setStars(response?.stars);
                    setEarnedStars(response?.stars - response?.old_stars)
                    setLevel(prev => prev + 1);
                }, 1500);
                return
            }
            else if (response && !response.success && !response.to_next) {
                start();
                setId({id: answer, result: 'wrong'})
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
                setText(response.hint)
                
                setId({id: answer, result: 'correct'})
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

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - 60, height: windowHeight - 60, justifyContent: 'center'}}>
            {data && <Game2Animals1Animation id={id} text={text} answer={answer} images={data?.content?.images} animal={data?.content?.title} setId={setId} audio={data?.content?.title_audio}/>}
            <View style={{width: windowWidth * (255 / 800), height: Platform.isPad? windowHeight * (60 / 360) : windowHeight * (80 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', position: 'absolute', bottom: 0, left: 0, flexDirection: 'row'}}>
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
                {text && text != '' && <Game2Text1Animation text={text} thinking={thinking}/>} 
            </View>
        </View>
    )
}

export default Game2Screen; 