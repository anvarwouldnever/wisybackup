import { View, Image, Platform, useWindowDimensions, Vibration, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import wisy from '../images/pandaHead.png'
import Game4TextAnimation from '../animations/Game4/Game4TextAnimation'
import Game4AnimalsAnimation from '../animations/Game4/Game4AnimalsAnimation'
import store from '../store/store'
import api from '../api/api'
import { playSound } from '../hooks/usePlayBase64Audio'
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation'
import useTimer from '../hooks/useTimer'
import LottieView from 'lottie-react-native'
import speakingWisy from '../lotties/headv9.json'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'
import Game8Tutorial from '../components/Game8Tutorial'

const Game4Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, level, introTaskIndex, tutorials, tutorialShow, setTutorialShow }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);

    const [wisySpeaking, setWisySpeaking] = useState(false);
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
        start();
        return () => {
            reset();
        }
    }, [])

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
    
    const vibrate = () => {
        Vibration.vibrate(500);
    };

    const answer = async({ answer }) => {
        try {
            const lead_time = getTime();
            stop();
            setId(null)
            setThinking(true)
            setLock(true)
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer, lead_time: lead_time, token: store.token, lang: store.language})
            if (response && response.stars && response.success) {
                console.log(response)
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
                    setLock(false)
                }, 1500);
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
                setText(response?.hint)
                
                setTimeout(() => {
                    setStars(response?.stars);
                    setEarnedStars(response?.stars - response?.old_stars)
                    setLevel(prev => prev + 1);
                    setLock(false)
                }, 1500);
            }
            else if (response && !response.success && !response.to_next) {
                start();
                setId({id: answer, result: 'wrong'})
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
                setId({id: answer, result: 'correct'})
                setText(response.hint)
                
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                    setLock(false)
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
                    setLock(false)
                }, 1500);
            }
        } catch (error) {
            console.log(error)
            setLock(false)
        } finally {
            setThinking(false)
        }
    }

    return (
        <View style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, justifyContent: 'center'}}>
            {tutorialShow && tutorials.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
            {data && (!tutorialShow || tutorials == 0) && <Game4AnimalsAnimation lock={lock} id={id} answer={answer} audio={data.content.question_audio} images={data.content.images} setId={setId}/>}
            <View style={{width: 'auto', height: Platform.isPad? windowHeight * (60 / 360) : windowHeight * (80 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', left: 0, bottom: 0}}>
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
            {tutorialShow && tutorials.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', position: 'absolute', bottom: 0, right: 0, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                                            Skip
                                        </Text>
                                    </TouchableOpacity>}
        </View>
    )
}

export default Game4Screen;

// useEffect(() => {
    //     const getData = () => {
    //         const singleChoiceItems = games.filter(item => 
    //             item.type === 'single_choice' &&
    //             item.content?.sub_type === 'with_audio'
    //         );
        
    //         if (singleChoiceItems) {
    //             setData(singleChoiceItems)
    //             setText(singleChoiceItems[level].content.wisy_question)
    //         } else {
    //             console.log("No item with type 'single_choice' found");
    //         }
    //     }

    //     getData()
    // }, [])

    // setLevel(prev => {
    //     const nextLevel = prev + 1;
    //     if (nextLevel < data.length) {
    //         // Увеличиваем уровень, если он меньше длины данных
    //         setText(data[nextLevel].content.wisy_question); // Здесь используем следующий уровень
    //         return nextLevel;
    //     } else {
    //         return prev; // Достигнут последний уровень
    //     }
    // });