import React, { useRef, useEffect, useState } from 'react';
import { Image, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, FadeIn, Easing, LinearTransition, withSpring, withDelay, FadingTransition, EntryExitTransition, SequencedTransition } from 'react-native-reanimated';
import petux from '../images/petux.png';
import cow from '../images/cow.png';
import lion from '../images/lionGame2.png';
import ocean from '../images/ocean2.png';
import polyana from '../images/polyana.png';
import sky from '../images/sky.png';
import * as Haptics from 'expo-haptics'

const DraggableItem = ({ item, windowWidth, windowHeight, checkDropZone }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const [draggingId, setDraggingId] = useState(null)

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            runOnJS(setDraggingId)(item.id)
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            const hit = runOnJS(checkDropZone)(
                event.absoluteX,
                event.absoluteY,
                item.image,
                item
            );

            runOnJS(setDraggingId)(null)

            if (hit) return;

            translateX.value = withDelay(50, withSpring(0, { damping: 20, stiffness: 200 }));
            translateY.value = withDelay(50, withSpring(0, { damping: 20, stiffness: 200 }));
        });

    const animatedStyleMove = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View layout={LinearTransition.duration(500)} style={[{ width: windowWidth * (80 / 800), zIndex: draggingId == item.id? 1000 : 0, height: windowHeight * (80 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }]}>
                <Animated.Image source={item.image} style={[animatedStyleMove, { width: windowWidth * (64 / 800), height: windowHeight * (64 / 360) }]} />
            </Animated.View>
        </GestureDetector>
    );
};


const TestScreen = () => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [draggableObjects, setDraggableObjects] = useState([
        { id: 1, image: petux },
        { id: 2, image: cow },
        { id: 3, image: petux },
        { id: 4, image: lion },
        { id: 5, image: petux },
        { id: 6, image: petux },
    ]);
    const [placeholderObjects, setPlaceholderObjects] = useState([
        { id: 1, image: ocean, draggedUri: null },
        { id: 2, image: polyana, draggedUri: null },
        { id: 3, image: sky, draggedUri: null }
    ]);
    const [answered, setAnswered] = useState([])

    const placeholderRefs = useRef(new Map());
    const [placeholders, setPlaceholders] = useState(new Map());

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
    
            if (isInside && !answered.includes(id)) {
                runOnJS(setPlaceholderObjects)((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, draggedUri } : p))
                );
    
                runOnJS(setDraggableObjects)((prev) =>
                    prev.filter((obj) => obj.id !== draggedItem.id)
                );

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    
                runOnJS(setAnswered)((prev) => [...prev, id]);
    
                hit = true;
                break;
            }
        }
    
        return hit;
    };    

    return (
        <View style={{ flex: 1, position: 'absolute', alignSelf: 'center', alignItems: 'center', width: windowWidth - 60, height: windowHeight - 45}}>
            {/* {Array.from(placeholders.values()).map((item, index) => (
                <View key={index} style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                    height: item.height,
                    width: item.width,
                    borderWidth: 1
                }} />
            ))} */}
            <View style={{ width: windowWidth * (530 / 800), height: windowHeight * (184 / 360), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 24 }}>
            {placeholderObjects.map((item) => (
                <View
                    key={item.id}
                    ref={(el) => {
                        if (el) {
                            placeholderRefs.current.set(item.id, el);
                        } else {
                            placeholderRefs.current.delete(item.id);
                        }
                    }}
                    style={{
                        width: windowWidth * (160 / 800),
                        height: windowHeight * (168 / 360),
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image source={item.image} style={{ width: windowWidth * (176 / 800), height: windowHeight * (184 / 360), borderRadius: 16, borderWidth: 2, borderColor: 'white' }} />
                    {item?.draggedUri && (
                            <Animated.Image
                                entering={FadeIn
                                    .duration(600)
                                    .delay(50)
                                    .springify()
                                    .easing(Easing.out(Easing.exp))
                                }
                                source={item.draggedUri}
                                style={{
                                    width: windowWidth * (120 / 800),
                                    height: windowHeight * (120 / 360),
                                    position: 'absolute',
                                    alignSelf: 'center',
                                }}
                            />
                        )}
                </View>
            ))}
            </View>
            <Animated.View style={{ width: windowWidth * (560 / 800), height: windowHeight * (80 / 360), marginTop: 50, flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', alignSelf: 'center', bottom: 0}}>
                {draggableObjects.map((item) => (
                    <DraggableItem key={item.id} item={item} windowWidth={windowWidth} windowHeight={windowHeight} checkDropZone={checkDropZone}/>
                ))}
            </Animated.View>
        </View>
    );
};

export default TestScreen;
