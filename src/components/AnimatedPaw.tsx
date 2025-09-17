import { View, Text, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import lapa from '../images/paw.png'

const AnimatedPaw = () => {

    const scale = useSharedValue(1);

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.1, { duration: 500 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.Image
            source={lapa}
            style={[
                {
                    width: windowHeight * (60 / 360),
                    height: windowHeight * (60 / 360),
                    position: 'absolute',
                    right: -20,
                    bottom: -30,
                },
                animatedStyle
            ]}
        />
    )
}

export default AnimatedPaw