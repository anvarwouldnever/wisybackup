import { Button, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { useScale } from '../hooks/utils/useScale';
import anim from '../lotties/data2.json'

const TurnPhoneScreen = () => {

    const { s, vs } = useScale();
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        animationRef.current.play()
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <LottieView
                ref={animationRef}
                loop
                autoPlay
                style={{ width: vs(350), height: vs(350), backgroundColor: '#eee', aspectRatio: 1 }}
                source={require('../lotties/data2.json')}
            />

            <Button
                title="Restart Animation"
                onPress={() => {
                    animationRef.current?.reset();
                    animationRef.current?.play();
                }}
            />

        </View>
    );
};

export default TurnPhoneScreen;
