import React, { useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, LinearTransition, withSpring, withDelay, ZoomInEasyDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics'
import useTimer from '../../hooks/utils/useTimer';
import store from '../../store/store';
import { useIntroSequence } from '../../hooks/useIntroSequence';
import WisyHint from './components/WisyHint';
import OverlayHint from './components/OverlayHint';
import PlaceholderBlock from './Game17/PlaceholderBlock';
import { useDragAndDropAnswer } from '../../hooks/answer/useDragAndDropAnswerLogic';
import { useScale } from '../../hooks/utils/useScale';

const DraggableItem = ({ item, checkDropZone, lock, opacity, draggingId, setDraggingId, s, clicked }) => {
    
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            if (!lock) {
                runOnJS(clicked)()
                runOnJS(setDraggingId)(item?.id);
            };
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

            const hit = runOnJS(checkDropZone)(event.absoluteX, event.absoluteY, item?.image, item);

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
            <Animated.View layout={LinearTransition.duration(500)} style={[{ width: s(40), zIndex: draggingId == item.id? 1000 : 0, height: s(40), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}]}>
                <Animated.Image source={{ uri: item?.image }} style={[animatedStyleMove, { width: s(30), height: s(30), opacity: draggingId == item.id? opacity : 1, resizeMode: 'contain'}]} />
            </Animated.View>
        </GestureDetector>
    );
};

const Game17Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {

    const { s, vs } = useScale()

    const { start, reset } = useTimer();

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);
    
    const [draggingId, setDraggingId] = useState(null);

    const shuffleArray = (array) => {
        return array.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
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

    const { answer, isActive } = useDragAndDropAnswer({ data, subCollectionId, onCompleteTask, isFromAttributes, setId, levelHandlers: { setLevel, setStars, setEarnedStars, setText }, uiHandlers: { setText, setLock, setWisySpeaking, setThinking }, attemptState: { attempt, setAttempt }});

    const { clicked } = useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });
    
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
    }, [draggableObjects.length]);

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

                setTimeout(() => {
                    setAnswered((prev) => prev.filter(item => item !== id));
                    setPlaceholderObjects((prev) =>
                        prev.map((p) =>
                            p.id === id ? { ...p, draggedUri: null } : p
                        )
                    );
                setLock(false)
                }, 1500);
            
                hit = true;
                break;
            }
        }
    
        return hit;
    };

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            
            <View style={{ flexDirection: 'column', height: 'auto', alignSelf: 'center', rowGap: vs(70)}}>
                
                <PlaceholderBlock placeholderObjects={placeholderObjects} placeholderRefs={placeholderRefs} id={id} answered={answered} />

                {draggableObjects?.length === 0 ?
                    <View style={{ height: s(40), width: s(250) }}>

                    </View> 
                :
                    <Animated.View entering={ZoomInEasyDown} style={{ width: s(250), height: 'auto', flexDirection: 'row', columnGap: s(7), alignItems: 'center', justifyContent: 'center'}}>
                        {draggableObjects?.map((item) => (
                            <DraggableItem clicked={clicked} key={item?.id} item={item} checkDropZone={checkDropZone} lock={lock} opacity={1} draggingId={draggingId} setDraggingId={setDraggingId} s={s} />
                        ))}
                    </Animated.View>
                }

            </View>

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
