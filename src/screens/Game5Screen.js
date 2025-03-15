import { View, Image, Platform, useWindowDimensions, Vibration, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import wisy from '../images/pandaHead.png'
import Game5AnimalsAnimation from '../animations/Game5/Game5AnimalsAnimation'
import store from '../store/store'
import api from '../api/api'
import { playSound } from '../hooks/usePlayBase64Audio'
import Game2Text1Animation from '../animations/Game2/Game2Text1Animation'
import useTimer from '../hooks/useTimer'
import speakingWisy from '../lotties/headv9.json'
import LottieView from 'lottie-react-native'
import { playSound2 } from '../hooks/usePlaySound2'
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds'
import Game8Tutorial from '../components/Game8Tutorial'

const Game5Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(null);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [wisySpeaking, setWisySpeaking] = useState(false);
    const [lock, setLock] = useState(false);
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
                console.log(error);
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
                    setWisySpeaking(false);
                    setLock(false)
                }
            }
        }

        introPlay()
    }, [data?.content?.speech, tutorialShow]);
                                
    const playVoice = async (sound) => {
        try {
            setWisySpeaking(true);
            await playSound(sound);
        } catch (error) {
            console.error("Ошибка при воспроизведении звука:", error);
        } finally {
            setText(null);
            setWisySpeaking(false);
            if (sound) {
                setLock(false)
                setId(null);
            } else {
                setTimeout(() => {
                    setLock(false)
                    setId(null);
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
                reset();
                if (isFromAttributes) {
                    store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setText(response?.hint)
                setId({id: answer, result: 'correct'})
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
                        setId(null);
                    }, 1000);
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
                vibrate()
                setText(response?.hint)
                setId({id: answer, result: 'wrong'})
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
                        setLock(false);
                        setId(null);
                    }, 1000);
                }
                return;
            }
            else if (response && !response.success && !response.to_next) {
                start();
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playVoice(response?.sound)
                setAttempt('2');
            } else if(response && response.success) {
                reset();
                if (isFromAttributes) {
                    store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setText(response.hint);
                setId({id: answer, result: 'correct'})
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
                        setId(null);
                    }, 1000);
                }
            } else if(response && !response.success && response.to_next) {
                reset();
                if (isFromAttributes) {
                    store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                vibrate()
                setId({id: answer, result: 'wrong'})
                setText(response.hint)
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                    setLock(false)
                    setId(null)
                }, 1000);
            }
        } catch (error) {
            console.log(error)
            setLock(false)
        } finally {
            setThinking(false);
        }
    }

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - 60, height: windowHeight - 60, justifyContent: 'center'}}>
            {tutorialShow && tutorials?.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
            {data && (!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <Game5AnimalsAnimation lock={lock} setLock={setLock} id={id} thinking={thinking} answer={answer} animal={data.content.question_image} images={data.content.images} setId={setId}/>}
            <View style={{width: 'auto', height: Platform.isPad? windowWidth * (150 / 800) : 'auto', alignSelf: 'center', alignItems: 'flex-end', flexDirection: 'row', position: 'absolute', bottom: 0, left: 0,}}>
                {/* <Image source={wisy} style={{width: windowWidth * (64 / 800), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), aspectRatio: 64 / 64}}/> */}
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
                {text && text != '' && <View style={{marginBottom: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (70 / 800)}}>
                    <Game2Text1Animation text={text} thinking={thinking}/>
                </View>}
            </View>
            {tutorialShow && tutorials?.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', position: 'absolute', bottom: 0, right: 0, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                    Skip
                </Text>
            </TouchableOpacity>} 
        </View>
    )
}

export default Game5Screen;


// const func = async () => {
//     try {
//         setWisySpeaking(true);
//         await playSound(data?.content?.speech);
//     } catch (error) {
//         console.error("cОшибка при воспроизведении звука:", error);
//     } finally {
//         setText(null);
//         setWisySpeaking(false)
//     }
// };
                            
// func();