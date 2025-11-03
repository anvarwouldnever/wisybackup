import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { useScale } from '../hooks/utils/useScale'

const AnimatedPaw = () => {

    const scale = useSharedValue(1);

    const { s, vs } = useScale()

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
            source={require('../images/paw.png')}
            style={[
                {
                    width: s(25),
                    height: s(25),
                    position: 'absolute',
                    right: -s(10),
                    bottom: -s(10),
                },
                animatedStyle
            ]}
        />
    )
}

export default AnimatedPaw