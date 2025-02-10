import { View, Text, TouchableOpacity, Image, useWindowDimensions, Keyboard } from 'react-native'
import React, { useState, useRef } from 'react'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Audio } from "expo-av";
import store from '../store/store';
import microimg from '../images/micro.png'
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import api from '../api/api'

const ChatMicroAnimation = ({text, flatListRef, firstMessageRef}) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const { startRecording, stopRecording, resetMicrophone } = useAudioRecorder();

    const [thinking, setThinking] = useState(false)
    const [microOn, setMicroOn] = useState(false);

    let pressTimeout = useRef(null);
    let isRecordingStarted = useRef(false);

    const animatedMicro = useAnimatedStyle(() => {
        
        const scaleX = withTiming(microOn ? 1.5 : 1, {duration: 100})
        const scaleY = withTiming(microOn ? 1.5 : 1, {duration: 100})
        // const backgroundColor = withTiming(microOn? "grey" : "white", { duration: 100 })
    
        return {
            transform: [
                { scaleX },
                { scaleY },
            ],
        };
    });

    async function PressOut() {
        if (pressTimeout.current) {
            clearTimeout(pressTimeout.current);
            pressTimeout.current = null;
        }

        if (!isRecordingStarted.current) {
            setMicroOn(false);
            return; // Не начинали запись, значит, просто выходим
        }

        setMicroOn(false);
        store.setPlayingMusic(true);
        isRecordingStarted.current = false;

        try {
            const uri = await stopRecording();
            if (uri) {
                setThinking(true);
                store.setMessages({ type: 'voice', text: uri, author: 'You' });
                Keyboard.dismiss();

                setTimeout(async () => {
                    await store.setMessages({ type: 'thinking', text: 'Thinking', author: 'MyWisy' });
                }, 500);

                try {
                    const response = await api.sendMessage({ child_id: store.playingChildId.id, audio: uri, token: store.token, isText: false });
                    await store.setMessages({ type: 'text', text: response?.data?.content, author: 'MyWisy' });

                    setTimeout(() => {
                        if (firstMessageRef?.current) {
                            firstMessageRef?.current.measure((x, y, width, height) => {
                                if (height > 700) {
                                    flatListRef?.current.scrollToOffset({ offset: height - 400 });
                                }
                            });
                        }
                    }, 100);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        } finally {
            setThinking(false);
            resetMicrophone()
        }
    }

    async function PressIn() {
        setMicroOn(true);

        pressTimeout.current = setTimeout(async () => {
            store.setPlayingMusic(false);
            isRecordingStarted.current = true;
            try {
                await startRecording();
            } catch (err) {
                console.error('Failed to start recording', err);
            }
        }, 200); // Минимальное время удержания
    }

    return (
        <Animated.View style={[animatedMicro]}>
            <TouchableOpacity disabled={thinking} onPressIn={PressIn} onPressOut={PressOut} style={{width: windowWidth * (40 / 360), height: windowHeight * (40 / 800), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: text === ''? '#E5E5E5' : '#C4DF84'}}>
                <Image source={microimg} style={{width: windowWidth * (13 / 360), height: windowHeight * (22 / 800)}}/>
            </TouchableOpacity> 
        </Animated.View>
    )
}

export default ChatMicroAnimation;