import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import speakingWisy from '../../../lotties/headv9.json';
import Game3TextAnimation from '../Game3/Game3TextAnimation';
import { useScale } from '../../../hooks/utils/useScale';

const WisyHint = ({ text, thinking, wisySpeaking }) => {

    const lottieRef = useRef(null);

    const { s, vs } = useScale()

    useEffect(() => {
        if (wisySpeaking) {
            setTimeout(() => {
                lottieRef.current?.play(180, 0);
            }, 1);
        } else {
            setTimeout(() => {
                lottieRef.current?.reset();
            }, 1);
        }
    }, [wisySpeaking]);

    return (
        <View style={{ width: 'auto', position: 'absolute', left: 0, bottom: 0, height: 'auto', alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row', pointerEvents: 'box-none'}}>
            
            <LottieView
                ref={lottieRef}
                resizeMode="cover"
                source={speakingWisy}
                style={{
                    width: s(30),
                    height: s(30)
                }}
                autoPlay={false}
                loop={true}
            />

            {(text && text !== '') || thinking ? (
                <Game3TextAnimation text={text} thinking={thinking} />
            ) : null}

        </View>
    );
};

export default WisyHint;
