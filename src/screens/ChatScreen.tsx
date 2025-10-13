import React, { useState, useRef } from "react";
import { KeyboardAvoidingView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import store from "../store/store";
import { observer } from "mobx-react-lite";
import ChatFlatlist from "./Chat/ChatFlatlist";
import ChatRecsFlatlist from "./Chat/ChatRecsFlatlist";
import SendInput from "./Chat/SendInput";
import translations from "../../localization";
import { Message } from "../api/methods/chat/message";
import { useScale } from "../hooks/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
    
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [thinking, setThinking] = useState(false);
    const flatListRef = useRef(null);
    const firstMessageRef = useRef(null);
    
    const sendMessage = async (currentText) => {
        setText('')
        setThinking(true);
    
        await store.setMessages({ type: 'text', text: currentText, author: 'You' });
    
        setTimeout(async () => {
            await store.setMessages({ type: 'thinking', text: 'Thinking', author: 'MyWisy' });
        }, 100);
    
        try {
            const response = await Message(store.playingChildId.id, true, currentText, undefined);
                
            await store.setMessages({ type: 'text', text: response.data?.data?.content, author: 'MyWisy' });

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
            await store.setMessages({ type: 'text', text: "Something went wrong, try again later", author: 'MyWisy' });
        } finally {
            setThinking(false);
        }
    };

    const { s, vs } = useScale()

    const [keyboardActive, setKeyboardActive] = useState(false);
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', paddingHorizontal: vs(20), paddingBottom: vs(20), paddingTop: vs(15) }}>
            
            { !keyboardActive &&
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', width: 'auto', height: 'auto', backgroundColor: 'white', alignItems: 'center', alignSelf: 'flex-start', columnGap: vs(5) }}>
                    
                    <Ionicons name='chevron-back' size={vs(24)} />
                        
                    <Text style={{fontWeight: '600', color: '#222222', fontSize: vs(16)}}>
                        {translations?.[store.language]?.back}
                    </Text>
                
                </TouchableOpacity>
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