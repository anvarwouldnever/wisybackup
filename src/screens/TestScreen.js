import React, { useRef, useEffect, useState } from 'react';
import { View, useWindowDimensions, Image, Text, TouchableOpacity, Platform, Button } from 'react-native';
import Animated, { BounceIn, FadeOut, useAnimatedProps, withTiming, runOnJS, useSharedValue, useAnimatedStyle, withDelay, FadeIn, withSequence, withSpring } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import lot from '../lotties/x3.json'
import Modal from "react-native-modal";
import useTimer from '../hooks/useTimer';

const TestScreen = () => {

    const { getTime, start, stop, reset } = useTimer();
    console.log('sekunda')

    const handleGetTime = () => {
        console.log(`Текущее время: ${getTime()} секунд`);
    };

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
            <Button title="Старт" onPress={start} />
            <Button title="Стоп" onPress={stop} />
            <Button title="Сброс" onPress={reset} />
            <Button title="Получить время" onPress={handleGetTime} />
        </View>
    )
};

export default TestScreen;