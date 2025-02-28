import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedProps, withSpring } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const TestScreen = () => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
            console.log(event)
        })
        .onEnd(() => {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
        });

        const animatedProps = useAnimatedProps(() => ({
            transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
        }));

    return (
            <Svg width={'100%'} height={'100%'} style={{backgroundColor: 'pink'}}>
                <GestureDetector gesture={panGesture}>
                    <AnimatedPath
                        d="M50,50 L150,50 L100,150 Z"
                        fill="blue"
                        stroke="black"
                        strokeWidth={2}
                        animatedProps={animatedProps}
                        onResponderMove={(_) => {}}
                    />
                </GestureDetector>
            </Svg>
    );
};

export default TestScreen;
