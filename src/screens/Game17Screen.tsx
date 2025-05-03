import React, { useRef, useEffect, useState } from 'react';
import { Image, View, useWindowDimensions, Platform, Vibration, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, FadeIn, Easing, LinearTransition, withSpring, withDelay, FadingTransition, EntryExitTransition, SequencedTransition } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics'
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation';
import speakingWisy from '../lotties/headv9.json'
import LottieView from 'lottie-react-native';
import { playSound } from '../hooks/usePlayBase64Audio';
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds';
import useTimer from '../hooks/useTimer';
import store from '../store/store';
import api from '../api/api';
import galochka from '../images/gamepassed.png'
import x from '../images/wrongAnswerX.png'

const DraggableItem = ({ item, windowWidth, windowHeight, checkDropZone, lock, opacity, draggingId, setDraggingId }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            if (lock) return;
            runOnJS(setDraggingId)(item.id);
        })
        .onUpdate((event) => {
            if (lock) {
                translateX.value = 0;
                translateY.value = 0;
                return;
            }
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (lock) {
                translateX.value = 0;
                translateY.value = 0;
                return;
            }

            const hit = runOnJS(checkDropZone)(
                event.absoluteX,
                event.absoluteY,
                item.image,
                item
            );

            if (hit) return;

            translateX.value = withDelay(50, withSpring(0, { damping: 20, stiffness: 200 }));
            translateY.value = withDelay(50, withSpring(0, { damping: 20, stiffness: 200 }));
        });

    const animatedStyleMove = useAnimatedStyle(() => {
        return lock
            ? { transform: [{ translateX: 0 }, { translateY: 0 }] }
            : { transform: [{ translateX: translateX.value }, { translateY: translateY.value }] };
    });

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View layout={LinearTransition.duration(500)} style={[{ width: windowWidth * (80 / 800), zIndex: draggingId == item.id? 1000 : 0, height: windowHeight * (80 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}]}>
                <Animated.Image source={{ uri: item?.image }} style={[animatedStyleMove, { width: windowHeight * (64 / 360), height: windowHeight * (64 / 360), opacity: draggingId == item.id? opacity : 1}]} />
            </Animated.View>
        </GestureDetector>
    );
};

const Game17Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {
    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);
    
    const [opacity, setOpacity] = useState(1)
    const [draggingId, setDraggingId] = useState(null);

    const [draggableObjects, setDraggableObjects] = useState(
        data?.content?.answers
            ?.flatMap(item => item.images.map(image => ({ id: image.id, image: image.url }))) || []
    );

    const [placeholderObjects, setPlaceholderObjects] = useState(
        data?.content?.answers?.map(item => ({
            ...item,
            draggedUri: null,
            possibleAnswers: item.images.map(image => image.id)
        })) || []
    );

    // console.log(data?.content?.answers[0].images)

    const [answered, setAnswered] = useState([]);

    const lottieRef = useRef(null);

    const placeholderRefs = useRef(new Map());
    const [placeholders, setPlaceholders] = useState(new Map());

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

    const { getTime, start, stop, reset } = useTimer();

    const playVoice = async (sound) => {
        if (!isActive.current) return
        try {
            setWisySpeaking(true);
            await playSound(sound);
        } catch (error) {
            console.error("Ошибка при воспроизведении звука:", error);
        } finally {
            setWisySpeaking(false);
            setText(null);
            setLock(false);
        }
    };

    const isActive = useRef(true);
    
    useEffect(() => {
        isActive.current = true;
    
        return () => {
            isActive.current = false;
        };
    }, []);

    const answer = async(params) => {
            try {
                if (!isActive.current) return
                const lead_time = getTime();
                stop();
                setThinking(true);
                setLock(true);
                const response = await api.answerDragAndDrop({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, success: params.answer, lead_time: lead_time, token: store.token, lang: store.language, answer_id: params.answer_id, image_id: params.image_id})
                if (!isActive.current) return
                if (response && response.stars && response.success && isActive.current) {
                    if (!isActive.current) return
                    reset()
                    if (isFromAttributes) {
                        // store.loadCategories();
                    } else {
                        onCompleteTask(subCollectionId, data.next_task_id)
                    }
                    setText(response?.hint);
    
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
                        }, 1500);
                    }
                    return;
                }
                else if (response && response.stars && !response.success && isActive.current) {
                    if (!isActive.current) return
                    reset()
                    if (isFromAttributes) {
                        // store.loadCategories();
                    } else {
                        onCompleteTask(subCollectionId, data.next_task_id)
                    }
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
                        }, 1500);
                    }
                    return;
                }
                else if (response && !response.success && !response.to_next && isActive.current) {
                    if (!isActive.current) return
                    start();
                    vibrate();
                    setText(response?.hint)
                    playVoice(response?.sound)
                    setAttempt('2')
                } else if(response && response.success && !response.to_next && isActive.current) {
                    if (!isActive.current) return
                    reset()
                    if (isFromAttributes) {
                        // store.loadCategories();
                    } else {
                        onCompleteTask(subCollectionId, data.next_task_id)
                    }
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
                            setLevel(prev => prev + 1);
                            setAttempt('1');
                            setLock(false)
                        }, 1500);
                    } 
                } else if(response && response.success && response.to_next && isActive.current) {
                    if (!isActive.current) return
                    reset()
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
                        }, 1500);
                    }
                } else if(response && !response.success && response.to_next && isActive.current) {
                    if (!isActive.current) return
                    reset()
                    if (isFromAttributes) {
                        // store.loadCategories();
                    } else {
                        onCompleteTask(subCollectionId, data.next_task_id)
                    }
                    vibrate();
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
                            setLevel(prev => prev + 1);
                            setAttempt('1');
                            setLock(false)
                        }, 1500);
                    }
                }
            } catch (error) {
                console.log(error)
                setLock(false)
                setText(error)
            } finally {
                setThinking(false)
            }
    };

    useEffect(() => {
        start();
        return () => {
            reset();
        }
    }, []);

    const vibrate = () => {
        Vibration.vibrate(500);
    };

    useEffect(() => {
        setTimeout(() => {
            const layouts = new Map();
    
            placeholderRefs.current.forEach((ref, id) => {
                if (ref) {
                    ref.measure((x, y, width, height, pageX, pageY) => {
                        layouts.set(id, { x: pageX, y: pageY, width, height });
    
                        if (layouts.size === placeholderObjects.length) {
                            runOnJS(setPlaceholders)(layouts); // Обновляем состояние
                        }
                    });
                }
            });
        }, 1000);
    }, [placeholderObjects]);

    const checkDropZone = (touchX, touchY, draggedUri, draggedItem) => {
        let hit = false;

        for (const [id, { x, y, width, height }] of placeholders.entries()) {
            const isInside = touchX >= x && touchX <= x + width && touchY >= y && touchY <= y + height;
    
            if (isInside) {
                const foundPlaceholder = placeholderObjects.find(p => p.id === id);
                if (!foundPlaceholder.possibleAnswers.includes(draggedItem.id)) {
                    // setId({id: id, result: 'wrong'});
                    // setOpacity(0);
                    answer({answer: false, answer_id: id, image_id: draggedItem.id});
                    // setAnswered((prev) => prev.filter(answeredId => answeredId !== id));
                    // setPlaceholderObjects((prev) =>
                    //     prev.map((p) =>
                    //         p.id === id ? { ...foundPlaceholder, draggedUri } : p
                    //     )
                    // );
                    // setTimeout(() => {
                    //     setPlaceholderObjects((prev) =>
                    //         prev.map((p) =>
                    //             p.id === id ? { ...foundPlaceholder, draggedUri: null } : p
                    //         )
                    //     );
                    //     setId(null)
                    //     setOpacity(1)
                    // }, 1500);
                    hit = false;
                    break;
                }

                setPlaceholderObjects((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...foundPlaceholder, draggedUri } : p
                    )
                );

                setDraggableObjects((prev) =>
                    prev.filter((obj) => obj.id !== draggedItem.id)
                );
                
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    
                setAnswered((prev) => {
                    const filtered = prev.filter(item => item !== id);
                    return [...filtered, id];
                });

                const filteredIds = foundPlaceholder.possibleAnswers.filter(id => id !== draggedItem.id);
                const exists = draggableObjects.some(obj => filteredIds.includes(obj.id));
                if (exists) {
                    setLock(true)
                    setTimeout(() => {
                        setAnswered((prev) => prev.filter(item => item !== id));
                        setPlaceholderObjects((prev) =>
                            prev.map((p) =>
                                p.id === id ? { ...p, draggedUri: null } : p
                            )
                        );
                    setLock(false)
                    }, 1500);
                }
    
                hit = true;
                break;
            }
        }
    
        return hit;
    };
    
    useEffect(() => {
        if (draggableObjects.length === 0) {
            answer({answer: true})
        }
    }, [answered]);

    return (
        <View style={{ flex: 1, position: 'absolute', alignSelf: 'center', alignItems: 'center', width: windowWidth - 60, height: windowHeight - 45}}>
            <View style={{ gap: windowWidth * (30 / 800), height: windowHeight * (184 / 360), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 24 }}>
            {placeholderObjects.map((item) => {

                return (
                    <View style={{
                                width: windowWidth * (160 / 800),
                                height: windowHeight * (168 / 360),
                                borderRadius: item?.image ? 10 : 16,
                                borderColor: id?.id == item?.id && id?.result == 'wrong' && !item?.image? '#D81616' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id) && !item?.image? '#ADD64D' : 'black',
                                borderWidth: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
                            }}
                            key={item.id}
                            ref={(el) => {
                                if (el) {
                                    placeholderRefs.current.set(item.id, el);
                                } else {
                                    placeholderRefs.current.delete(item.id);
                                }
                            }}
                        >
                        <View
                            style={{
                                width: windowWidth * (160 / 800),
                                height: windowHeight * (168 / 360),
                                borderRadius: item?.image ? 10 : 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: id?.id == item?.id && id?.result == 'wrong' && !item?.image? '#D816164D' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id) && !item?.image? '#ADD64D4D' : 'white',
                                
                            }}
                        >
                        {item?.image ? 
                            (
                                <>
                                    <Image 
                                        source={{ uri: item.image }} 
                                        style={{ 
                                            width: windowWidth * (176 / 800), 
                                            height: windowHeight * (184 / 360), 
                                            borderRadius: 16, 
                                            borderWidth: 2, 
                                            borderColor: id?.id == item?.id && id?.result == 'wrong'? '#D81616' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id)? '#ADD64D' : 'white',
                                        }} 
                                    />
                                    {item?.draggedUri && (
                                        <Animated.Image
                                            entering={FadeIn
                                                .duration(600)
                                                .delay(50)
                                                .springify()
                                                .easing(Easing.out(Easing.exp))
                                            }
                                            source={{ uri: item.draggedUri }}
                                            style={{
                                                width: windowWidth * (120 / 800),
                                                height: windowHeight * (120 / 360),
                                                position: 'absolute',
                                                alignSelf: 'center',
                                            }}
                                        />
                                    )}
                                    {answered.includes(item.id) && (
                                        <Image source={galochka} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 2, right: 2}}/>
                                    )}
                                    {id?.id == item?.id && id?.result == 'wrong' && (
                                        <Image source={x} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 2, right: 2}}/>
                                    )}
                                </>
                            ) 
                            : 
                            (
                                <View style={{flex: 1, gap: 10, padding: 16, alignItems: 'center'}}>
                                    <Text style={{position: 'absolute', bottom: windowHeight * (10 / 360), fontWeight: '600', fontSize: windowHeight * (14 / 360)}}>{item.text}</Text>
                                    {item?.draggedUri && (
                                        <Animated.Image
                                            entering={FadeIn
                                                .duration(600)
                                                .delay(50)
                                                .springify()
                                                .easing(Easing.out(Easing.exp))
                                            }
                                            source={{ uri: item.draggedUri }}
                                            style={{
                                                width: windowWidth * (120 / 800),
                                                height: windowHeight * (120 / 360),
                                                alignSelf: 'center',
                                                
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                            {answered.includes(item.id) && !item?.image && (
                                <Image source={galochka} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 5, right: 5}}/>
                            )}
                            {id?.id == item?.id && id?.result == 'wrong' && !item?.image && (
                                <Image source={x} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 5, right: 5}}/>
                            )}
                        </View>
                    </View>
                )
            })}
            </View>
            <Animated.View style={{ width: windowWidth * (560 / 800), height: windowHeight * (80 / 360), marginTop: 50, flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', alignSelf: 'center', bottom: 0}}>
                {draggableObjects.map((item) => (
                    <DraggableItem key={item.id} item={item} windowWidth={windowWidth} windowHeight={windowHeight} checkDropZone={checkDropZone} lock={lock} opacity={opacity} draggingId={draggingId} setDraggingId={setDraggingId}/>
                ))}
            </Animated.View>
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
        </View>
    );
};

export default Game17Screen;
