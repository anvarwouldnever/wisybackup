import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, TouchableOpacity, Text, View, StatusBar, Image, Vibration, Platform, Dimensions, useWindowDimensions } from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedProps, runOnJS } from "react-native-reanimated";
import { toJS } from "mobx";
import speaker from '../images/tabler_speakerphone.png'
import { playSound } from "../hooks/usePlayBase64Audio";
import useTimer from "../hooks/useTimer";
import { playSoundWithoutStopping } from "../hooks/usePlayWithoutStoppingBackgrounds";
import Game3TextAnimation from "../animations/Game3/Game3TextAnimation";
import LottieView from "lottie-react-native";
import speakingWisy from '../lotties/headv9.json'
import Game8Tutorial from "../components/Game8Tutorial";
import black from '../images/tabler_speakerphone2.png';
import api from "../api/api";
import store from "../store/store";
import blackRed from '../images/darkRedSpeaker.png'
import * as Haptics from 'expo-haptics'

const AnimatedLine = Animated.createAnimatedComponent(Line);

const Game14Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {
    
    // console.log(data?.content?.pairs[0]?.target_pair)
    
    const [lines, setLines] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [answered, setAnswered] = useState([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);  
    const [wrongObject, setWrongObject] = useState();  
    
    const lineStartX = useSharedValue(0);
    const lineStartY = useSharedValue(0);
    const lineEndX = useSharedValue(0);
    const lineEndY = useSharedValue(0);

    const mainContainerOffset = { top: 24 };

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const timeoutRef = useRef(null);
    const lottieRef = useRef(null);

    const imageRefs = useRef(new Map());
    const imageLayouts = useSharedValue([]);

    const answersRefs = useRef(new Map());
    const answersLayouts = useSharedValue([]);
    
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

    // useEffect(() => {
    //     if (!text) return;
    //     const timeoutId = setTimeout(() => {
    //         setText(null);
    //     }, 3000);
    
    //     return () => clearTimeout(timeoutId);
    // }, [text]); 

    const { getTime, start, stop, reset } = useTimer();

    useEffect(() => {
        start();
        return () => {
            reset();
        }
    }, []);

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

    const animatedProps = useAnimatedProps(() => ({
        x1: lineStartX.value,
        y1: lineStartY.value,
        x2: lineEndX.value,
        y2: lineEndY.value,
    }));

    const addCurvedLine = (data) => {
        setIsDrawing(false);
        setLines((prev) => [...prev, data]);
    };

    const Lines = () => {
        return (
            <Svg
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            >
                {lines.map((line, index) => {
                    const dx = line.x2 - line.x1;
                    const dy = line.y2 - line.y1;
    
                    // Рассчитываем контрольные точки для кривой Безье
                    const controlX1 = line.x1 + dx * 0.50; // Первая контрольная точка на 25% от начала
                    const controlY1 = line.y1;
                    const controlX2 = line.x2 - dx * 0.50; // Вторая контрольная точка на 25% от конца
                    const controlY2 = line.y2;
    
                    const pathData = `M ${line.x1},${line.y1} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${line.x2},${line.y2}`;
    
                    return <Path key={index} d={pathData} stroke={line.color} strokeWidth="2" fill="none" />;
                })}
    
                {isDrawing && <AnimatedLine onResponderMove={(_) => {}} animatedProps={animatedProps} stroke={"#504297"} strokeWidth="2" />}
            </Svg>
        );
    };

    const images = toJS(data?.content?.pairs ?? []).map((item, index) => ({
        ...item,
        key: String(index + 1),
    }));
    
    useEffect(() => {
        if (answers.length === 0) { // Только первый раз перемешиваем
            setAnswers(
                images
                    .map((item) => ({ ...item.target_pair, key: item.key }))
                    .sort(() => Math.random() - 0.5)
            );
        }
    }, [images]);

    useEffect(() => {
        setTimeout(() => {
            const layouts = [];
            imageRefs.current.forEach((view, key) => {
                if (view) {
                    view.measure((x, y, width, height, pageX, pageY) => {
                        layouts.push({ key, x: pageX, y: pageY, width, height });
                        if (layouts.length === images.length) {
                            imageLayouts.value = layouts;
                        }
                    });
                }
            });
        }, 500);
    }, [images]);

    const isActive = useRef(true);
    
    useEffect(() => {
        isActive.current = true;
    
        return () => {
            isActive.current = false;
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const layouts = [];
            answersRefs.current?.forEach((view, key) => {
                if (view) {
                    view.measure((x, y, width, height, pageX, pageY) => {
                        layouts.push({ key, x: pageX, y: pageY, width, height });
                        if (layouts.length === answers.length) {
                            answersLayouts.value = layouts;
                        }
                    });
                }
            });
        }, 1000);
    }, [answers]);

    const answer = async(params) => {
        try {
            if (!isActive.current) return
            const lead_time = getTime();
            stop();
            setThinking(true)
            setLock(true)
            const response = await api.answerTaskObjectMatching({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, success: params.answer, lead_time: lead_time, token: store.token, lang: store.language, pair_id: params.pair_id, target_pair_id: params.target_pair_id})
            if (!isActive.current) return
            if (response && response.stars && response.success && isActive.current) {
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
            else if (response && response.stars && !response.success && isActive.current) {
                if (!isActive.current) return
                reset()
                if (isFromAttributes) {
                            // store.loadCategories();
                        } else {
                            onCompleteTask(subCollectionId, data.next_task_id)
                        }
                // setId({id: answer, result: 'wrong'})
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
                // setId({id: answer, result: 'wrong'})
                vibrate();
                setText(response.hint)
                playVoice(response?.sound)
                setAttempt('2')
            } else if(response && response.success && isActive.current) {
                if (!isActive.current) return
                reset()
                if (isFromAttributes) {
                    // store.loadCategories();
                } else {
                    onCompleteTask(subCollectionId, data.next_task_id)
                }
                // setId({id: answer, result: 'correct'})
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
                // setId({id: answer, result: 'wrong'})
                vibrate();
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
            }
        } catch (error) {
            console.log(error)
            setLock(false)
            setText(error)
            setWrongObject(null)
            setLines(prev => prev.slice(0, -1));
        } finally {
            setThinking(false);
        }
    };

    const addToAnswered = (key) => {
        setAnswered((prev) => [...prev, key]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    };

    const isPointInsideImage = (x, y, key) => {
        'worklet';
        const adjustedX = x + 30; // Учитываем смещение по X
        const adjustedY = y + mainContainerOffset.top; // Учитываем смещение по Y
        const totalImages = imageLayouts.value.length;
    
        let rightSideThreshold = 0;
    
        if (totalImages === 5) {
            rightSideThreshold = 2;
        } else if (totalImages === 6) {
            rightSideThreshold = 3;
        } else if (totalImages <= 4) {
            rightSideThreshold = 0; // Нет правых элементов
        }
    
        for (let i = 0; i < totalImages; i++) {
            const image = imageLayouts.value[i];
    
            if (
                adjustedX >= image.x &&
                adjustedX <= image.x + image.width &&
                adjustedY >= image.y &&
                adjustedY <= image.y + image.height
            ) {
                const isRightSide = i >= totalImages - rightSideThreshold; // Проверяем, правый ли элемент
                const isCorrect = image.key === key;

                const originalImage = images.find(img => img.key === image.key);

                if (image.key !== key) {
                    if (answered.includes(image.key)) {
                        return { inside: false }
                    }
                    runOnJS(answer)({ answer: false, pair_id: originalImage?.id, target_pair_id: originalImage?.target_pair?.id });
                    runOnJS(setWrongObject)(key)
                    return {
                        inside: true,
                        newX: isRightSide ? image.x - 30 : image.x + image.width - 30,
                        newY: image.y + image.height / 2 - mainContainerOffset.top,
                        targetIndex: i,
                        color: isCorrect ? '#ADD64D' : '#EA6E6E',
                    }; 
                }

                runOnJS(addToAnswered)(key);
    
                return {
                    inside: true,
                    newX: isRightSide ? image.x - 30 : image.x + image.width - 30,
                    newY: image.y + image.height / 2 - mainContainerOffset.top,
                    targetIndex: i,
                    color: isCorrect ? '#ADD64D' : '#EA6E6E',
                };
            }
        }
        return { inside: false };
    };
       
    const isPointInsideAnsweRight = (x, y, key, id) => {
        'worklet';
        const adjustedX = x + 30; // Учитываем смещение по X
        const adjustedY = y + mainContainerOffset.top;  
        
        for (let i = 0; i < answersLayouts.value.length; i++) {
            const answerLayout = answersLayouts.value[i];
    
            if (
                adjustedX >= answerLayout.x &&
                adjustedX <= answerLayout.x + answerLayout.width &&
                adjustedY >= answerLayout.y &&
                adjustedY <= answerLayout.y + answerLayout.height
            ) {
                const originalAnswer = answers.find(ans => ans.key === answerLayout.key);
                
                const isCorrect = answerLayout.key === key;

                if (answerLayout.key !== key) {
                    if (answered.includes(answerLayout.key)) {
                        return { inside: false }
                    }
                    runOnJS(answer)({ answer: false, pair_id: id, target_pair_id: originalAnswer?.id });
                    runOnJS(setWrongObject)(answerLayout.key)

                    return {
                        inside: true,
                        newX: answerLayout.x + answerLayout.width - 30, // Правая граница объекта
                        newY: answerLayout.y + answerLayout.height / 2 - mainContainerOffset.top,
                        targetIndex: i,
                        color: isCorrect ? '#ADD64D' : '#EA6E6E',
                    };
                }  
                
                runOnJS(addToAnswered)(key);
                return {
                    inside: true,
                    newX: answerLayout.x + answerLayout.width - 30, // Правая граница объекта
                    newY: answerLayout.y + answerLayout.height / 2 - mainContainerOffset.top,
                    targetIndex: i,
                    color: isCorrect ? '#ADD64D' : '#EA6E6E',
                };
            }
        }
        return { inside: false };
    };

    const isPointInsideAnswerLeft = (x, y, key, id) => {
        'worklet';
        const adjustedX = x + 30;
        const adjustedY = y + mainContainerOffset.top;
    
        for (let i = 0; i < answersLayouts.value.length; i++) {
            const answerLayout = answersLayouts.value[i];
    
            if (
                adjustedX >= answerLayout.x &&
                adjustedX <= answerLayout.x + answerLayout.width &&
                adjustedY >= answerLayout.y &&
                adjustedY <= answerLayout.y + answerLayout.height
            ) {
                const originalAnswer = answers.find(ans => ans.key === answerLayout.key);
                const isCorrect = answerLayout.key === key;

                if (answerLayout.key !== key) {
                    if (answered.includes(answerLayout.key)) {
                        return { inside: false }
                    }
                    runOnJS(answer)({ answer: false, pair_id: id, target_pair_id: originalAnswer?.id });
                    runOnJS(setWrongObject)(answerLayout.key)
                    return {
                        inside: true,
                        newX: answerLayout.x - 30,
                        newY: answerLayout.y + answerLayout.height / 2 - mainContainerOffset.top,
                        targetIndex: i,
                        color: isCorrect ? '#ADD64D' : '#EA6E6E',
                    };
                }  

                runOnJS(addToAnswered)(key);
                return {
                    inside: true,
                    newX: answerLayout.x - 30,
                    newY: answerLayout.y + answerLayout.height / 2 - mainContainerOffset.top,
                    targetIndex: i,
                    color: isCorrect ? '#ADD64D' : '#EA6E6E',
                };
            }
        }
        return { inside: false };
    };    

    useEffect(() => {
        if (answered.length === images.length) {
            answer({ answer: true })
        }
    }, [answered])

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
            setLines(prevLines => prevLines.slice(0, -1));
            setWrongObject(null)
            setLock(false);
        }
    };
    
    return (
        <View style={{top: mainContainerOffset.top, width: windowWidth - 60, height: windowHeight - 60, position: "absolute", alignItems: "center"}}>
            <Lines />

            {tutorialShow && tutorials?.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                <Game8Tutorial tutorials={tutorials}/>
            </View>}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{width: windowWidth * (448 / 800), height: windowHeight * (300 / 360), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute'}}>
                <View style={{width: windowWidth * (80 / 800), height: windowHeight * (312 / 360), alignItems: 'center', gap: images.length === 4 || images.length === 3 ? 12 : 16, justifyContent: 'center', flexDirection: 'column'}}>
                    {(images.length === 4 || images.length === 3 ? images : images.length === 5 || images.length === 6 ? images.slice(0, 3) : []).map((item, index) => {

                        const gesture = Gesture.Pan()
                        .onBegin((event) => {
                            if (lock || answered.includes(item.key)) return;
                            runOnJS(setIsDrawing)(true);
                            lineStartX.value = event.absoluteX - 30;
                            lineStartY.value = event.absoluteY - mainContainerOffset.top;
                            lineEndX.value = event.absoluteX - 30;
                            lineEndY.value = event.absoluteY - mainContainerOffset.top;
                        })
                        .onUpdate((event) => {
                            if (lock || answered.includes(item.key)) return;
                            lineEndX.value = event.absoluteX - 30
                            lineEndY.value = event.absoluteY - mainContainerOffset.top
                        })
                        .onEnd((event) => {
                            if (lock || answered.includes(item.key)) return;
                            let { inside, newX, newY, targetIndex, color } = isPointInsideAnswerLeft(lineEndX.value, lineEndY.value, item.key, item?.id);
                        
                            if (inside) {
                                
                                const startObject = imageLayouts.value.find(a => a.key === item.key);
                                if (startObject) {
                                    lineStartX.value = startObject.x + startObject.width - 30;
                                    lineStartY.value = startObject.y + startObject.height / 2 - mainContainerOffset.top;
                                }
                        
                                runOnJS(addCurvedLine)({
                                    x1: lineStartX.value,
                                    y1: lineStartY.value,
                                    x2: newX,
                                    y2: newY,
                                    color: color
                                });
                            } else {
                                lineStartX.value = 0;
                                lineStartY.value = 0;
                                lineEndX.value = 0;
                                lineEndY.value = 0;
                            }
                        });

                        return (
                            <GestureDetector key={item.key} gesture={gesture}>
                                <View style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key) && images?.length != 4 && images?.length != 3 ? '#ADD64D' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                    <View ref={(view) => imageRefs.current.set(item.key, view)} onLayout={() => {}} style={{ borderRadius: 8, width: images?.length === 3? windowWidth * (96 / 800) : images?.length === 4? windowWidth * (69 / 800) :  windowWidth * (80 / 800), height: images?.length === 3? windowHeight * (96 / 360) : images?.length === 4? windowHeight * (69 / 360) : windowHeight * (80 / 360), backgroundColor: answered.includes(item.key) && images?.length != 4 && images?.length != 3? '#ADD64D4D' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                                        <Image source={{ uri: item?.image }} style={{ width: images.length === 3? windowWidth * (80 / 800) : windowWidth * (64 / 800), height: images.length === 3? windowHeight * (81 / 360) : windowHeight * (64 / 360), resizeMode: 'contain' }}/>
                                    </View>
                                </View>
                            </GestureDetector>
                        )
                    })}
                </View>
                <View style={{width: windowWidth * (160 / 800), height: windowHeight * (300 / 360), alignItems: 'center', justifyContent: 'center', gap: images.length === 4 || images.length === 3 ? 12 : 16, flexDirection: 'column', overflow: 'visible'}}>
                    {answers.map((item, index) => {
        
                        const type = item?.text ? 'text' : 'image'

                        const gesture = Gesture.Pan()
                            .onBegin((event) => {
                                if (lock || answered.includes(item.key)) return;
                                runOnJS(setIsDrawing)(true);
                                lineStartX.value = event.absoluteX - 30;
                                lineStartY.value = event.absoluteY - mainContainerOffset.top;
                                lineEndX.value = event.absoluteX - 30;
                                lineEndY.value = event.absoluteY - mainContainerOffset.top;
                            })
                            .onUpdate((event) => {
                                if (lock || answered.includes(item.key)) return;
                                lineEndX.value = event.absoluteX - 30
                                lineEndY.value = event.absoluteY - mainContainerOffset.top
                            })
                            .onEnd((event) => {
                                if (lock || answered.includes(item.key)) return;
                                const { inside, newX, newY, targetIndex, color } = isPointInsideImage(lineEndX.value, lineEndY.value, item?.key);
                                
                                if (inside) {
                                    
                                    const answer = answersLayouts.value.find(a => a.key === item.key);
                                    if (answer) {
                                        const totalImages = imageLayouts.value.length;
                                        let rightSideThreshold = 0;
                            
                                        if (totalImages === 5) {
                                            rightSideThreshold = 2;
                                        } else if (totalImages === 6) {
                                            rightSideThreshold = 3;
                                        }
                            
                                        const isTargetRightSide = targetIndex >= totalImages - rightSideThreshold;
                            
                                        lineStartX.value = isTargetRightSide ? answer.x + answer.width - 30 : answer.x - 30;
                                        lineStartY.value = answer.y + answer.height / 2 - mainContainerOffset.top;
                                    }
                            
                                    runOnJS(addCurvedLine)({
                                        x1: lineStartX.value,
                                        y1: lineStartY.value,
                                        x2: newX,
                                        y2: newY,
                                        color: color
                                    });
                                } else {
                                    lineStartX.value = 0;
                                    lineStartY.value = 0;
                                    lineEndX.value = 0;
                                    lineEndY.value = 0;
                                }
                            });
                        
                            return (
                                <GestureDetector key={item.key} gesture={gesture}>
                                    {type == 'text'? 
                                        <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{width: 'auto', height: windowHeight * (40 / 360), backgroundColor: 'transparent', borderRadius: 100, flexDirection: 'row', gap: 5, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                            <View style={{minWidth: windowWidth * (110 / 800), maxWidth: 'auto', height: windowHeight * (40 / 360), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : 'white', borderTopLeftRadius: 100, borderBottomLeftRadius: 100, justifyContent: 'center', paddingHorizontal: windowWidth * (16 / 800) }}>
                                                <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (12 / 360), textAlign: 'center'}}>{item?.text}</Text>
                                            </View>
                                            <TouchableOpacity onPress={lock? () => {return} : () => playSound(item?.speech)} style={{width: windowWidth * (46 / 800), height: windowHeight * (40 / 360), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : '#B3ABDB', borderTopRightRadius: 100, borderBottomRightRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image source={answered.includes(item.key)? black : wrongObject == item.key? blackRed : speaker} style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), resizeMode: 'contain'}}/>
                                            </TouchableOpacity>
                                        </View>
                                    :
                                    type == 'image' &&
                                    <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#D81616' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                        <View style={{width: images.length === 4? windowWidth * (69 / 800) : windowWidth * (96 / 800), height: images.length === 4? windowHeight * (69 / 360) : windowHeight * (96 / 360), backgroundColor: answered.includes(item.key)? '#ADD64D4D' : wrongObject == item.key? '#D816164D' : 'white', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <Image source={{ uri: item?.image }} style={{width: windowWidth * (80 / 800), height: windowHeight * (81 / 360)}}/>
                                        </View> 
                                    </View>   
                                    }
                                </GestureDetector>
                            )
                    })}
                </View>
                {images.length === 4 || images.length === 3 ? null : <View style={{width: windowWidth * (80 / 800), height: windowHeight * (272 / 360), alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column'}}>
                    {images.length === 4 || images.length === 3 ? null : (
                        <View 
                            style={{ 
                                width: windowWidth * (80 / 800), 
                                height: windowHeight * (272 / 360),
                                justifyContent: 'center',
                                alignItems: 'center', 
                                gap: 16, 
                                flexDirection: 'column' 
                            }}
                        >
                            {(images.length === 5 || images.length === 6 ? images.slice(3) : []).map((item, index) => {

                                const gesture = Gesture.Pan()
                                .onBegin((event) => {
                                    if (lock || answered.includes(item.key)) return;
                                    runOnJS(setIsDrawing)(true);
                                    lineStartX.value = event.absoluteX - 30;
                                    lineStartY.value = event.absoluteY - mainContainerOffset.top;
                                    lineEndX.value = event.absoluteX - 30;
                                    lineEndY.value = event.absoluteY - mainContainerOffset.top;
                                })
                                .onUpdate((event) => {
                                    if (lock || answered.includes(item.key)) return;
                                    lineEndX.value = event.absoluteX - 30
                                    lineEndY.value = event.absoluteY - mainContainerOffset.top
                                })
                                .onEnd((event) => {
                                    if (lock || answered.includes(item.key)) return;
                                    let { inside, newX, newY, targetIndex, color } = isPointInsideAnsweRight(lineEndX.value, lineEndY.value, item.key, item?.id);
                                
                                    if (inside) {

                                        const answer = imageLayouts.value.find(a => a.key === item.key);
                                        if (answer) {
                                            lineStartX.value = answer.x - 30; // Левая граница ответа
                                            lineStartY.value = answer.y + answer.height / 2 - mainContainerOffset.top;
                                        }
                                
                                        runOnJS(addCurvedLine)({
                                            x1: lineStartX.value,
                                            y1: lineStartY.value,
                                            x2: newX,
                                            y2: newY,
                                            color: color
                                        });
                                    } else {
                                        lineStartX.value = 0;
                                        lineStartY.value = 0;
                                        lineEndX.value = 0;
                                        lineEndY.value = 0;
                                    }
                                });

                                return (
                                    <GestureDetector key={item.key} gesture={gesture}>
                                        <View style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key)? '#ADD64D' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                            <View ref={(view) => imageRefs.current.set(item.key, view)} onLayout={() => {}} style={{ borderRadius: 8, width: windowWidth * (80 / 800), height: windowHeight * (80 / 360), backgroundColor: answered.includes(item.key)? '#ADD64D4D' : 'white', justifyContent: 'center', alignItems: 'center' }}>
                                                <Image source={{ uri: item?.image }} style={{ width: windowWidth * (64 / 800), height: windowHeight * (64 / 360), resizeMode: 'contain' }}/>
                                            </View>
                                        </View>
                                    </GestureDetector>
                                )
                            })}
                        </View>
                    )}
                </View>}
            </View>}
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) &&  <View style={{width: windowWidth * (255 / 800), position: 'absolute', left: 0, bottom: 0, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
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
            {tutorialShow && tutorials?.length > 0 && 
            <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', alignSelf: 'flex-end', borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                    Skip
                </Text>
            </TouchableOpacity>}
            {/* <Lines /> */}
        </View>
    );
};

export default Game14Screen;

{/* <View style={{position: 'absolute', left: 30, top: 150}}>
                <Button title="Добавить" onPress={() => setCurve(prev => prev + 0.1)}/>
                <Text style={{color: 'black'}}>
                    текущее: {curve.toFixed(2)}
                </Text>
                <Button title="Убавить" onPress={() => setCurve(prev => prev - 0.1)}/>
            </View> */}

            {/* <Lines /> */}