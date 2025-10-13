import { TouchableOpacity, Keyboard } from 'react-native'
import React, { useState, useRef } from 'react'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import store from '../../../store/store';
import { useAudioRecorder } from '../../../hooks/useAudioRecorder';
import { Message } from '../../../api/methods/chat/message';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useScale } from '../../../hooks/useScale';

const ChatMicroAnimation = ({text, flatListRef, firstMessageRef}) => {

    const { startRecording, stopRecording } = useAudioRecorder();

    const [thinking, setThinking] = useState(false)
    const [microOn, setMicroOn] = useState(false);

    let pressTimeout = useRef(null);
    let isRecordingStarted = useRef(false);

    const { s, vs } = useScale()

    const animatedMicro = useAnimatedStyle(() => {
        
        const scaleX = withTiming(microOn ? 1.5 : 1, {duration: 100})
        const scaleY = withTiming(microOn ? 1.5 : 1, {duration: 100})
    
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
                    const response = await Message( store.playingChildId.id, false, '', uri);
                    await store.setMessages({ type: 'text', text: response?.data?.data?.content, author: 'MyWisy' });

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
                    await store.setMessages({ type: 'text', text: "Something went wrong, try again later", author: 'MyWisy' });
                    return
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

            <TouchableOpacity disabled={thinking} onPressIn={PressIn} onPressOut={PressOut} style={{width: vs(40), height: vs(40), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: text === ''? '#E5E5E5' : '#C4DF84'}}>
                
                <Ionicons name='mic-outline' size={vs(20)} />
            
            </TouchableOpacity> 

        </Animated.View>
    )
}

export default ChatMicroAnimation;