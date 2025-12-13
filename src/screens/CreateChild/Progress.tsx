import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useScale } from '../../hooks/utils/useScale'
import { View } from 'react-native'

const Progress = ({ stage }) => {

    const { s, vs } = useScale()

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(stage / 5, { duration: 400 });
    }, [stage]);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    return (
        <View style={{ width: '100%', height: vs(8), backgroundColor: '#F8F8F8', borderRadius: 100, overflow: 'hidden'}}>
            <Animated.View style={[{ height: '100%', backgroundColor: '#504297', borderRadius: 100}, progressStyle]}/>
        </View>
    )
}

export default Progress