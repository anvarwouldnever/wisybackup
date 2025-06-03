import { View, Text, Image, useWindowDimensions, Platform } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import star from '../../images/Star.png';

const ProgressAnimation = ({ level, task }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const games = task?.length
    const ProgressAnimationWidth = windowWidth * (100 / 800); 
        
    const animatedProgress = useAnimatedStyle(() => {
        const progressWidth = (level / games) * ProgressAnimationWidth; // Пропорциональная ширина
    
        return {
            width: withTiming(progressWidth, { duration: 300 }),
        };
    });

    return (
        <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), position: 'absolute', right: windowWidth * (30 / 800), top: windowHeight * (25 / 360), alignItems: 'center', justifyContent: 'center', flexDirection: 'row', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
            <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), backgroundColor: 'white', borderRadius: 100, alignItems: 'center', flexDirection: 'row', padding: 2}}>
                <Animated.View style={[animatedProgress, {height: Platform.isPad? windowWidth * (8 / 800) : windowHeight * (8 / 360), backgroundColor: '#504297', borderRadius: 100}]}/>
            </View>
            <Image source={star} style={{width: windowWidth * (28 / 800), height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), aspectRatio: 28 / 28, position: 'absolute', alignSelf: 'center', right: -2, bottom: -3}}/>
        </View>
    )
}

export default ProgressAnimation