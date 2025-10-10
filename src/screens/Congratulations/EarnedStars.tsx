import { Text } from 'react-native'
import React from 'react'
import Animated, { BounceIn, useAnimatedStyle } from 'react-native-reanimated'
import { useScale } from '../../hooks/useScale';

const EarnedStars = ({ starsContainerRef, starsContainerOpacity, earnedStars }) => {

    const { s, vs } = useScale()

    const starsContainerStyle = useAnimatedStyle(() => ({
        opacity: starsContainerOpacity.value,
    }));

    return (
        <Animated.View ref={starsContainerRef} entering={BounceIn.delay(1700).duration(800).springify(400)} style={[starsContainerStyle, {width: s(35), height: s(20), backgroundColor: '#B3ABDB', position: 'absolute', borderRadius: 100, alignSelf: 'flex-end', top: s(30), right: -s(10) , flexDirection: 'column', justifyContent: 'center', paddingHorizontal: s(5)}]}>
            <Text style={{fontWeight: '600', color: 'white', fontSize: s(10), textAlign: 'center', alignSelf: 'flex-end'}}>+{`${earnedStars.length}`}</Text>
        </Animated.View>
    )
}

export default EarnedStars