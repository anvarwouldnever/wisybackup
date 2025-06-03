import { View, Platform, useWindowDimensions, Vibration, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
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
            setTimeout(() => {
                lottieRef.current?.reset();
            }, 1);
        }
    }, [wisySpeaking]);

    const { getTime, start, stop, reset } = useTimer();

    useEffect(() => {
        start();
        return () => {
            reset();
        }
    }, [])

    const isActive = useRef(true);

    useEffect(() => {
        isActive.current = true;
    
        return () => {
            isActive.current = false;
        };
    }, []);

    useEffect(() => {
        const introPlay = async() => {
            await playSound.stop()
            await playSoundWithoutStopping.stop()
            try {
                setLock(true)
                if (level === introTaskIndex && (!tutorialShow || tutorials?.length === 0)) {
                    setWisySpeaking(true);
                    setText(introText);
                    await playSoundWithoutStopping(introAudio);
                }
            } catch (error) {
                console.log(error)
            } finally {
                try {
                    if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials?.length === 0)) {
                        setText(data?.content?.question)
                        setWisySpeaking(true);
                        await playSoundWithoutStopping(data?.content?.speech);
                    }
                } catch (error) {
                    console.error("cОшибка при воспроизведении звука:", error);
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    try {
                        if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials?.length === 0)) {
                            await playSound(data?.content?.question_audio);
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        setLock(false);
                    }
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
        if (!isActive.current) return;
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
            } else {
                setTimeout(() => {
                    setId(null)
                    setLock(false)
                }, 1000);
            }
            
        }
    };
    
    const vibrate = () => {
        Vibration.vibrate(500);
    };

    const answer = async({ answer }) => {
        try {
            if (!isActive.current) return;
            const lead_time = getTime();
            stop();
            setId(null)
            setThinking(true)
            setLock(true)
            playSound.stop()
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer, lead_time: lead_time, token: store.token, lang: store.language})
            if (!isActive.current) return;
            if (response && response.stars && response.success && isActive.current) {
                console.log(response)
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: answer, result: 'correct'})
                setText(response?.hint)

                try {
                    if (!isActive.current) return;
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
                    }, 1500);
                }
                return;
            }
            else if (response && response.stars && !response.success && isActive.current) {
                if (!isActive.current) return;
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                vibrate()
                setId({id: answer, result: 'wrong'})
                setText(response?.hint)

                try {
                    if (!isActive.current) return;
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
                    }, 1500);
                }
                return;
            }
            else if (response && !response.success && !response.to_next && isActive.current) {
                if (!isActive.current) return;
                start();
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playVoice(response?.sound)
                setAttempt('2')
            } else if(response && response.success) {
                if (!isActive.current) return;
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: answer, result: 'correct'})
                setText(response.hint)

                try {
                    if (!isActive.current) return;
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
                    }, 1500);
                }
                return;
            } else if(response && !response.success && response.to_next && isActive.current) {
                if (!isActive.current) return;
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)

                try {
                    if (!isActive.current) return;
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
                    }, 1500);
                }
                return;
            }
        } catch (error) {
            console.log(error)
            setLock(false)
            setText(error)
        } finally {
            setThinking(false)
        }
    };

    const voiceForTask = async(sound) => {
        if (!sound) return;
        try {
            setLock(true)
            await playSound(sound)
        } catch (error) {
            setText('error loading the sound')
            setLock(false)
        } finally {
            setLock(false)
        }
    }

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, justifyContent: 'center'}}>
            {tutorialShow && tutorials?.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
            {data && (!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <Game4AnimalsAnimation lock={lock} id={id} answer={answer} audio={data?.content?.question_audio} images={data?.content?.images} setId={setId} voiceForTask={voiceForTask}/>}
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
            {tutorialShow && tutorials?.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowHeight * (58 / 360), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', position: 'absolute', bottom: 0, right: 0, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                                            Skip
                                        </Text>
                                    </TouchableOpacity>}
        </View>
    )
}

export default Game4Screen;