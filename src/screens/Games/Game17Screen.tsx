import React, { useRef, useEffect, useState } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, LinearTransition, withSpring, withDelay, ZoomInEasyDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics'
import useTimer from '../../hooks/useTimer';
import store from '../../store/store';
import { useIntroSequence } from '../../hooks/useIntroSequence';
import WisyHint from './components/WisyHint';
import OverlayHint from './components/OverlayHint';
import PlaceholderBlock from './Game17/PlaceholderBlock';
import { useDragAndDropAnswer } from '../../hooks/useDragAndDropAnswerLogic';

const DraggableItem = ({ item, windowWidth, windowHeight, checkDropZone, lock, opacity, draggingId, setDraggingId }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            if (lock) return;
            runOnJS(setDraggingId)(item?.id);
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
                item?.image,
                item
            );

            if (hit) return;

            translateX.value = withDelay(50, withSpring(0, { damping: 80, stiffness: 500 }));
            translateY.value = withDelay(50, withSpring(0, { damping: 80, stiffness: 500 }));
        });

    const animatedStyleMove = useAnimatedStyle(() => {
        return lock
            ? { transform: [{ translateX: 0 }, { translateY: 0 }] }
            : { transform: [{ translateX: translateX.value }, { translateY: translateY.value }] };
    });

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View layout={LinearTransition.duration(500)} style={[{ width: windowWidth * (80 / 800), zIndex: draggingId == item.id? 1000 : 0, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}]}>
                <Animated.Image source={{ uri: item?.image }} style={[animatedStyleMove, { width: windowHeight * (64 / 360), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), opacity: draggingId == item.id? opacity : 1, resizeMode: 'contain'}]} />
            </Animated.View>
        </GestureDetector>
    );
};

const Game17Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {
    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const { start, reset } = useTimer();

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);
    
    const [draggingId, setDraggingId] = useState(null);

    const shuffleArray = (array) => {
        return array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    };
    
    const [draggableObjects, setDraggableObjects] = useState(() => {
        const items = data?.content?.answers
            ?.flatMap(item => item?.images.map(image => ({ id: image?.id, image: image?.url }))) || [];
        return shuffleArray(items);
    });

    const [placeholderObjects, setPlaceholderObjects] = useState(
        data?.content?.answers?.map(item => ({
            ...item,
            draggedUri: null,
            possibleAnswers: item?.images.map(image => image?.id)
        })) || []
    );

    const [answered, setAnswered] = useState([]);

    const placeholderRefs = useRef(new Map());
    const [placeholders, setPlaceholders] = useState(new Map());

    const { answer, isActive } = useDragAndDropAnswer({ data, subCollectionId, onCompleteTask, isFromAttributes, setId, levelHandlers: { setLevel, setStars, setEarnedStars }, uiHandlers: { setText, setLock, setWisySpeaking, setThinking }, attemptState: { attempt, setAttempt }});

    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });
    
    useEffect(() => {
        isActive.current = true;
        start();
                                  
        return () => {
            isActive.current = false;
            reset();
        };
    }, []);

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
    
    useEffect(() => {
        if (draggableObjects.length === 0) {
            answer({answer: true})
        }
    }, [answered]);

    const checkDropZone = (touchX, touchY, draggedUri, draggedItem) => {
        let hit = false;

        for (const [id, { x, y, width, height }] of placeholders.entries()) {
            const isInside = touchX >= x && touchX <= x + width && touchY >= y && touchY <= y + height;
    
            if (isInside) {
                const foundPlaceholder = placeholderObjects.find(p => p.id === id);
                if (!foundPlaceholder.possibleAnswers.includes(draggedItem.id)) {
                    answer({answer: false, answer_id: id, image_id: draggedItem.id});
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

    return (
        <View style={{ flex: 1, position: 'absolute', alignSelf: 'center', alignItems: 'center', width: windowWidth - 60, height: windowHeight - 45}}>
            
            <PlaceholderBlock placeholderObjects={placeholderObjects} placeholderRefs={placeholderRefs} id={id} answered={answered} />

            <Animated.View entering={ZoomInEasyDown} style={{ width: windowWidth * (560 / 800), height: windowHeight * (80 / 360), marginTop: windowHeight * (50 / 360), flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', alignSelf: 'center', bottom: 0}}>
                {draggableObjects?.map((item) => (
                    <DraggableItem key={item?.id} item={item} windowWidth={windowWidth} windowHeight={windowHeight} checkDropZone={checkDropZone} lock={lock} opacity={1} draggingId={draggingId} setDraggingId={setDraggingId}/>
                ))}
            </Animated.View>

            <OverlayHint visible={store.isBlacked}>
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            </OverlayHint>

            {!store?.isBlacked && (
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            )}

        </View>
    );
};

export default Game17Screen;
