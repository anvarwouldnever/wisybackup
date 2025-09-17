import React, { useEffect, useRef } from 'react'
import LottieView from 'lottie-react-native'
import timerLot from '../../lotties/5-0 фулл.json'
import { useScale } from '../../hooks/useScale'

const Timer = () => {

    const { s, vs } = useScale()

    const timer = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            timer.current?.reset(); 
            timer.current?.play();
        }, 0);

        return () => {
            clearTimeout(timeout); 
        };
    }, []);

    return (
        <LottieView 
            ref={timer}
            source={timerLot}
            autoPlay={true}
            loop={false}
            style={{ width: vs(40), height: vs(40), alignSelf: 'center' }}
        />
    )
}

export default Timer;