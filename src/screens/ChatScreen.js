import React, { useState, useRef, useEffect } from "react";
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, useWindowDimensions, Dimensions } from "react-native";
import narrowleft from '../images/tablerleft.png'
import { useNavigation } from "@react-navigation/native";
import wisypfp from '../images/wisypfp.png'
import dog from '../images/Dog.png'
import arrow from '../images/arrowupblack.png'
import PlayVoiceMessage from "../components/PlayVoiceMessage";
import api from '../api/api'
import store from "../store/store";
import { observer } from "mobx-react-lite";
import DotsAnimation from "../animations/DotsAnimation";
import ChatMicroAnimation from "../animations/ChatMicroAnimation";
import ChatFlatlist from "./Chat/ChatFlatlist";
import ChatRecsFlatlist from "./Chat/ChatRecsFlatlist";
import SendInput from "./Chat/SendInput";
import translations from "../../localization";

const ChatScreen = () => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [thinking, setThinking] = useState(false);
    const flatListRef = useRef(null);
    const firstMessageRef = useRef(null);

    // const [keyboardActive, setKeyboardActive] = useState(false);
    
    const sendMessage = async (currentText) => {
        setText('')
        setThinking(true);
    
        await store.setMessages({ type: 'text', text: currentText, author: 'You' });
    
        setTimeout(async () => {
            await store.setMessages({ type: 'thinking', text: 'Thinking', author: 'MyWisy' });
        }, 100);
    
        try {
            const response = await api.sendMessage({
                child_id: store.playingChildId.id,
                message: currentText,
                token: store.token,
                isText: true,
                lang: store.language
            });
                
            await store.setMessages({ type: 'text', text: response?.content, author: 'MyWisy' });

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
    
    return (
        <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <KeyboardAvoidingView style={{gap: windowWidth * (12 / 360)}} behavior='position' keyboardVerticalOffset={Platform.OS == 'android'? 10 : 0}>
                <View style={{width: windowWidth * (328 / 360), height: windowHeight * (630 / 800), alignSelf: 'center'}}>
                    <ChatFlatlist flatListRef={flatListRef} firstMessageRef={firstMessageRef}/>
                </View>
                <View style={{width: windowWidth * (328 / 360), gap: 16, alignSelf: 'center', alignItems: 'center', marginBottom: Platform.OS === 'android'? 0 : windowHeight * (30 / 800)}}>
                    <ChatRecsFlatlist sendMessage={sendMessage}/>
                    <SendInput text={text} thinking={thinking} sendMessage={sendMessage} setText={setText} firstMessageRef={firstMessageRef} flatListRef={flatListRef}/>
                </View>
            </KeyboardAvoidingView>
            <View style={{gap: windowWidth * (4 / 360), width: windowWidth * (328 / 360), height: windowHeight * (75 / 932), backgroundColor: 'white', flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', top: 0}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={narrowleft} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    <Text style={{fontWeight: '600', color: '#222222', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (20 / 800), marginLeft: 2}}>{translations?.[store.language]?.back}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default observer(ChatScreen);