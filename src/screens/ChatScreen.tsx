import React, { useState, useRef } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import store from "../store/store";
import { observer } from "mobx-react-lite";
import ChatFlatlist from "./Chat/ChatFlatlist";
import ChatRecsFlatlist from "./Chat/ChatRecsFlatlist";
import SendInput from "./Chat/SendInput";
import { Message } from "../api/methods/chat/message";
import { useScale } from "../hooks/utils/useScale";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "./Chat/Back";
import { chatStore } from "./Chat/store/chatStore";

const ChatScreen = () => {
    
    const [text, setText] = useState('');
    const [thinking, setThinking] = useState(false);

    const flatListRef = useRef(null);
    const firstMessageRef = useRef(null);
    
    const sendMessage = async (currentText) => {
        setText('')
        setThinking(true);
    
        await chatStore.setMessage({ type: 'text', text: currentText, author: 'You' });
    
        setTimeout(async () => {
            await chatStore.setMessage({ type: 'thinking', text: 'Thinking', author: 'MyWisy' });
        }, 100);
    
        try {
            const response = await Message(store.playingChildId.id, true, currentText, undefined);
                
            await chatStore.setMessage({ type: 'text', text: response.data?.data?.content, author: 'MyWisy' });

            setTimeout(() => {
                if (firstMessageRef?.current) {
                    firstMessageRef.current.measure((x, y, width, height) => {
                        const firstMessageHeight = height;
                        if (firstMessageHeight > 700) {
                            flatListRef?.current?.scrollToOffset({ offset: firstMessageHeight - 400 });
                        }
                    });
                }
            }, 100);
            
        } catch (error) {
            await chatStore.setMessage({ type: 'text', text: "Something went wrong, try again later", author: 'MyWisy' });
        } finally {
            setThinking(false);
        }
    };

    const { s, vs } = useScale()

    const [keyboardActive, setKeyboardActive] = useState(false);
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', paddingHorizontal: vs(20), paddingBottom: vs(20), paddingTop: vs(15) }}>
            
            { !keyboardActive &&
                <Back />
            }
            
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={vs(10)}>
                
                <ChatFlatlist flatListRef={flatListRef} firstMessageRef={firstMessageRef}/>
                
                <View style={{ width: '100%', rowGap: vs(10), alignItems: 'center' }}>
                    
                    <ChatRecsFlatlist sendMessage={sendMessage}/>
                    
                    <SendInput setKeyboardActive={setKeyboardActive} text={text} thinking={thinking} sendMessage={sendMessage} setText={setText} firstMessageRef={firstMessageRef} flatListRef={flatListRef}/>
                
                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default observer(ChatScreen);