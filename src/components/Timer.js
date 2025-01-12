import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'
import timerLot from '../lotties/x3.json'

const Timer = () => {

    const timer = useRef(null);

    useEffect(() => {
            return () => {
                timer.current?.reset();
            };
    }, []);

    return (
        <LottieView 
            ref={timer}
            source={timerLot}
            autoPlay={true}
            loop={false}
            style={{ width: 30, height: 30, alignSelf: 'center' }}
        />
    )
}

export default Timer;