import { View, Image, Platform, useWindowDimensions, Vibration } from 'react-native'
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

const Game4Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, level, introTaskIndex }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);

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
                    if (level === introTaskIndex) {
                        setWisySpeaking(true);
                        setText(introText);
                        await playSoundWithoutStopping(introAudio);
                    }
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
            setId(null)
            setThinking(true)
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer, lead_time: lead_time, token: store.token, lang: store.language})
            playVoice(response?.sound)
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
                }, 1500);
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
                setId({id: answer, result: 'correct'})
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
        <View style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, justifyContent: 'center'}}>
            {data && <Game4AnimalsAnimation id={id} answer={answer} audio={data.content.question_audio} images={data.content.images} setId={setId}/>}
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
                <Game3TextAnimation text={text} thinking={thinking}/>
            </View>
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