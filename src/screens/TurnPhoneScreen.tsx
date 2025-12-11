import { View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { useScale } from '../hooks/utils/useScale';

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
                style={{ width: vs(350), height: vs(350), borderWidth: 1 }}
                source={require('../lotties/turnphone.json')}
                onAnimationFailure={() => console.log('pizdec')}
                onAnimationLoaded={() => console.log('pizdec')}
            />
        </View>
    );
};

export default TurnPhoneScreen;
