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
import blackRed from '../images/darkRedSpeaker.png'
import black from '../images/tabler_speakerphone2.png';
import RenderComponent from '../components/Game16/RenderComponent'

const Game16Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const lottieRef = useRef(null);

    const animal = data?.content?.image?.url
    const isAnimalSvg = data?.content?.image?.url && data?.content?.image?.url.endsWith('.svg');
    
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
            await playSoundWithoutStopping.stop()
            await playSound.stop()
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
            setWisySpeaking(false)
            setText(null);
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
    }

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
                                
    // useEffect(() => {
    //     if (id?.id && id?.result) {
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current);
    //         }
    //         timeoutRef.current = setTimeout(() => {
    //             setId(null);
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

    const answer = async({ answer }) => {
        try {
            if (!isActive.current) return
            const lead_time = getTime();
            stop();
            setId(null)
            setThinking(true)
            setLock(true)
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer, lead_time: lead_time, token: store.token, lang: store.language})
            if (!isActive.current) return
            if (response && response.stars && response.success && isActive.current) {
                if (!isActive.current) return
                reset();
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: answer, result: 'correct'})
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
                        setLock(false)
                        setId(null);
                    }, 1000);
                }
                return;
            }
            else if (response && response.stars && !response.success && isActive.current) {
                if (!isActive.current) return
                reset();
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: answer, result: 'wrong'})
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
                    setId(null);
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
            else if (response && !response.success && !response.to_next && isActive.current) {
                if (!isActive.current) return
                start()
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playVoice(response?.sound)
                setAttempt('2')
            } else if(response && response.success && isActive.current) {
                if (!isActive.current) return
                reset();
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                setId({id: answer, result: 'correct'})
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
                        setLock(false)
                        setId(null);
                    }, 1000);
                }
            } else if(response && !response.success && response.to_next && isActive.current) {
                if (!isActive.current) return
                reset();
                if (isFromAttributes) {
                    // store.loadCategories();
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
                        setId(null);
                    }, 1000);
                }
            }
        } catch (error) {
            console.log(error)
            setLock(false)
            setText("probably server overload, try again later")
        } finally {
            setThinking(false)
        }
    }

    const voice = async(sound) => {
        if (!sound) return
        try {
            setLock(true)
            await playSound2(sound)
        } catch (error) {
            setText('error loading the sound')
            setLock(false)
        } finally {
            setLock(false)
        }
    }

    return (
        <Animated.View entering={ZoomInEasyDown} style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, flexDirection: 'row', justifyContent: 'center'}}>
            {tutorialShow && tutorials?.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <RenderComponent animal={animal} isAnimalSvg={isAnimalSvg} answer={answer} id={id} setId={setId} lock={lock} data={data} voice={voice}/> }
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) &&  <View style={{width: windowWidth * (255 / 800), position: 'absolute', left: 0, bottom: 0, height: Platform.isPad? windowWidth * (80 / 800) : 'auto', alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
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
                <View style={{marginBottom: 30}}>
                    <Game3TextAnimation text={text} thinking={thinking}/>
                </View>
            </View>}
            {tutorialShow && tutorials?.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', alignSelf: 'flex-end', borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                                                                                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                                                                                  Skip
                                                                                </Text>
                                                                            </TouchableOpacity>}
        </Animated.View>
    )
}

export default Game16Screen;