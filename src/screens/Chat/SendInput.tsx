import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import React from 'react'
import ChatMicroAnimation from './SendInput/ChatMicroAnimation';
import translations from '../../../localization';
import store from '../../store/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useScale } from '../../hooks/useScale';

const SendInput = ({ text, setText, sendMessage, thinking, flatListRef, firstMessageRef, setKeyboardActive }) => {

    const onSendText = () => {
        setKeyboardActive(false)
        Keyboard.dismiss();
        sendMessage(text);
        setText('');
    }

    const { s, vs } = useScale()

    return (
        <View style={{width: '100%', height: 'auto', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            
            <TextInput 
                style={{ height: '100%', borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 100, width: '85%', paddingHorizontal: vs(16), fontSize: vs(14)}}
                placeholder={translations?.[store.language]?.message}
                placeholderTextColor={'#B1B1B1'}
                onChangeText={(text) => setText(text)}
                keyboardAppearance="dark"
                value={text}
                onFocus={() => setKeyboardActive(true)}
                onBlur={() => setKeyboardActive(false)}
            />
                    
            {text === '' ? 
                
                <ChatMicroAnimation text={text} flatListRef={flatListRef} firstMessageRef={firstMessageRef}/> 
            : 
                <TouchableOpacity disabled={thinking} onPress={() => onSendText()} style={{ width: vs(40), height: vs(40), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: text === '' || thinking? '#E5E5E5' : '#C4DF84'}}>
                    
                    <Ionicons name='arrow-up' size={vs(20)} />
                
                </TouchableOpacity>
            }

        </View> 
    )
}

export default SendInput