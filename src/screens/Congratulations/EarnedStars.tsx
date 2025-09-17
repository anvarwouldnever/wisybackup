import { View, Text, Platform, useWindowDimensions } from 'react-native'
import React from 'react'
import Animated, { BounceIn, useAnimatedStyle } from 'react-native-reanimated'

const EarnedStars = ({ starsContainerRef, starsContainerOpacity, earnedStars }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const starsContainerStyle = useAnimatedStyle(() => ({
        opacity: starsContainerOpacity.value,
    }));

    return (
        <Animated.View ref={starsContainerRef} entering={BounceIn.delay(1700).duration(800).springify(400)} style={[starsContainerStyle, {width: windowWidth * (75 / 800), height: windowHeight * (40 / 360), backgroundColor: '#B3ABDB', position: 'absolute', borderRadius: 100, alignSelf: 'flex-end', gap: 1, top: Platform.isPad? '30%' : '35%', right: -40, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 10}]}>
            <Text style={{fontWeight: '600', color: 'white', fontSize: windowWidth * (23 / 800), textAlign: 'center', alignSelf: 'flex-end'}}>+{`${earnedStars.length}`}</Text>
        </Animated.View>
    )
}

export default EarnedStars