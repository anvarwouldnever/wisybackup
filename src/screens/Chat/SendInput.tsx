import { View, Text, TextInput, TouchableOpacity, Image, useWindowDimensions, Keyboard } from 'react-native'
import React from 'react'
import ChatMicroAnimation from '../../animations/ChatMicroAnimation';
import arrow from '../../images/arrowupblack.png'
import translations from '../../../localization';
import store from '../../store/store';

const SendInput = ({ text, setText, sendMessage, thinking, flatListRef, firstMessageRef }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <View style={{width: windowWidth * (328 / 360), height: windowHeight * (40 / 800), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TextInput 
                        style={{borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 100, width: windowWidth * (280 / 360), paddingHorizontal: windowHeight * (16 / 800), paddingVertical: windowHeight * (8 / 800), fontSize: windowHeight * (14 / 800)}}
                        placeholder={translations?.[store.language]?.message}
                        placeholderTextColor={'#B1B1B1'}
                        onChangeText={(text) => setText(text)}
                        keyboardAppearance="dark"
                        value={text}
                        // onPress={() => setKeyboardActive(true)}
                    />
                    {text === ''? <ChatMicroAnimation text={text} thinking={thinking} flatListRef={flatListRef} firstMessageRef={firstMessageRef}/> 
                    : 
                    <TouchableOpacity disabled={thinking} onPress={() => {
                        // setKeyboardActive(false)
                        Keyboard.dismiss();
                        sendMessage(text);
                        setText('');
                    }} style={{width: windowWidth * (40 / 360), height: windowHeight * (40 / 800), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: text === ''? '#E5E5E5' : '#C4DF84'}}>
                        <Image source={arrow} style={{width: windowWidth * (10 / 360), height: windowHeight * (15 / 800), aspectRatio: 10 / 15}}/>
                    </TouchableOpacity>}
                </View>
    )
}

export default SendInput