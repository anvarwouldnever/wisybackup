import React, { useRef, useEffect, useState } from 'react';
import { View, useWindowDimensions, Image, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, { BounceIn, FadeOut, useAnimatedProps, withTiming, runOnJS, useSharedValue, useAnimatedStyle, withDelay, FadeIn, withSequence, withSpring } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import lot from '../lotties/x3.json'

const AnimatedLine = Animated.createAnimatedComponent(Line);

const TestScreen = () => {

    return (
        <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <LottieView 
                source={lot}
                autoPlay
                style={{ width: 30, height: 30, backgroundColor: 'purple' }}
                loop={true}
                resizeMode='contain'
            />
        </View>
    )
};

export default TestScreen;