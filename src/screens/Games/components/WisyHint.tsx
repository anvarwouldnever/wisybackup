import React, { useEffect, useRef } from 'react';
import { View, Platform, useWindowDimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import speakingWisy from '../../../lotties/headv9.json';
import Game3TextAnimation from '../Game3/Game3TextAnimation';

const WisyHint = ({ text, thinking, wisySpeaking }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const lottieRef = useRef(null);

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
        <View
            style={{
                width: windowWidth * (270 / 800),
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: Platform.isPad
                    ? windowWidth * (135 / 800)
                    : windowHeight * (135 / 360),
                alignSelf: 'flex-end',
                alignItems: 'flex-end',
                flexDirection: 'row',
                pointerEvents: 'box-none',
                
            }}
        >
            <LottieView
                ref={lottieRef}
                resizeMode="cover"
                source={speakingWisy}
                style={{
                    width: windowWidth * (64 / 800),
                    height: Platform.isPad
                        ? windowWidth * (64 / 800)
                        : windowHeight * (64 / 360),
                    aspectRatio: 64 / 64,
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
