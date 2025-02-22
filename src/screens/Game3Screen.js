import { View, Text, TouchableOpacity, Image, useWindowDimensions, Platform, ImageBackground, Vibration } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Animated, { ZoomInEasyDown, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import wisy from '../images/pandaHead.png'
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation'
import Game3AnimalsAnimation from '../animations/Game3/Game3AnimalsAnimation'
import store from '../store/store'
import api from '../api/api'
import { playSound } from '../hooks/usePlayBase64Audio'
import useTimer from '../hooks/useTimer'
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'

const Game3Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText }) => {

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
                vibrate()
                setId({id: answer, result: 'wrong'})
                setText(response?.hint)
                
                setTimeout(() => {
                    setStars(response?.stars);
                    setEarnedStars(response?.stars - response?.old_stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && !response.success && !response.to_next) {
                start();
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
        <Animated.View entering={ZoomInEasyDown} style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, flexDirection: 'row', justifyContent: 'center'}}>
            {data && data && <Game3AnimalsAnimation id={id} answer={answer} images={data.content.images} setId={setId}/>}
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
            </View>
        </Animated.View>
    )
}

export default Game3Screen;

// setLevel(prev => {
//     const nextLevel = prev + 1;
//     if (nextLevel < data.length) {
//         // Увеличиваем уровень, если он меньше длины данных
//         setText(data.content.wisy_question); // Здесь используем следующий уровень
//         return nextLevel;
//     } else {
//         return prev; // Достигнут последний уровень
//     }
// });

 // useEffect(() => {
    //     const getData = () => {
    //         const singleChoiceItems = games.filter(item => 
    //             item.type === 'single_choice' &&
    //             item.content?.sub_type === 'simple'
    //         );
    
    //         if (singleChoiceItems.length > 0) {
    //             setData(singleChoiceItems);
    //             setText(singleChoiceItems[0].content.wisy_question);
    //         } else {
    //             console.log("Элементы с type 'single_choice' не найдены");
    //         }
    //     };
    
    //     getData();
    // }, []);