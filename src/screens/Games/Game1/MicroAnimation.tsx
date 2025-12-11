import React, { useState, useRef } from "react";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { TouchableOpacity, Image, useWindowDimensions, Platform } from "react-native";
import { observer } from "mobx-react-lite";
import { useAudioRecorder } from "../../../hooks/useAudioRecorder";
import store from "../../../store/store";

const MicroAnimation = ({ sendAnswer, correctAnswer, incorrectAnswerToNext, incorrectAnswer, setText, clicked }) => {
    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [microOn, setMicroOn] = useState(false);
    const { startRecording, stopRecording, isRecording } = useAudioRecorder();

    const pressStartTime = useRef<number | null>(null);

    const handlePressIn = async () => {
        pressStartTime.current = Date.now();
        setMicroOn(true);
        store.setPlayingMusic(false);
        await startRecording();
    };

    const handlePressOut = async () => {
        setMicroOn(false);
        await store.setPlayingMusic(true);

        const pressDuration = Date.now() - (pressStartTime.current || 0);
        pressStartTime.current = null;

        if (pressDuration < 350) {
            console.log("Tap too short, ignore recording");
            if (isRecording.current) {
                await stopRecording();
            }
            return;
        }

        const uri = await stopRecording();
        if (!uri) return;
    
        try {
            const requestStatus = await sendAnswer(uri);
    
            if (requestStatus?.to_next && requestStatus?.success) {
                return correctAnswer(requestStatus?.hint, requestStatus?.stars, requestStatus?.sound, requestStatus?.old_stars, requestStatus?.success_phrase, requestStatus?.success_phrase_sound);
            } else if (requestStatus?.to_next && !requestStatus?.success) {
                return incorrectAnswerToNext(requestStatus?.hint, requestStatus?.stars, requestStatus?.sound, requestStatus?.old_stars);
            } else if (!requestStatus?.to_next && !requestStatus?.success) {
                return incorrectAnswer(requestStatus?.hint, requestStatus?.sound);
            } else {
                setText(requestStatus?.hint);
            }
        } catch (e) {
            console.warn("Ошибка стопа записи:", e);
        }
    };

    const animatedMicro = useAnimatedStyle(() => {
        const scaleX = withTiming(microOn ? 1.2 : 1, { duration: 100 })
        const scaleY = withTiming(microOn ? 1.2 : 1, { duration: 100 })
        const backgroundColor = withTiming(microOn ? "#504297" : "#B3ABDB", { duration: 100 })
        const borderWidth = withTiming(microOn ? 4 : 1, { duration: 100 })

        return {
            transform: [{ scaleX }, { scaleY }],
            backgroundColor,
            borderWidth
        }
    })

    return (
        <Animated.View
            style={[
                animatedMicro,
                {
                    borderStyle: 'solid',
                    borderColor: '#B3ABDB80',
                    borderRadius: 100,
                    backgroundColor: '#B3ABDB',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: windowWidth * (64 / 800),
                    height: windowWidth * (64 / 800)
                }
            ]}
        >
            <TouchableOpacity
                onPress={() => clicked()}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: 100
                }}
            >
                <Image
                    source={microOn ? require('../../../images/tabler_microphone-white.png') : require('../../../images/tabler_microphone.png')}
                    style={{
                        width: windowWidth * (24 / 800),
                        height: Platform.isPad
                            ? windowWidth * (24 / 800)
                            : windowHeight * (24 / 360),
                        aspectRatio: 1
                    }}
                />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default observer(MicroAnimation)
