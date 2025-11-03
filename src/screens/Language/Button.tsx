import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import translations from '../../../localization';
import store from '../../store/store';
import { useScale } from '../../hooks/utils/useScale';

const Button = ({ chosenLang }) => {

    const navigation = useNavigation();

    const { s, vs, isTablet } = useScale()

    const func = async() => {
        await store.setLanguage(chosenLang)
        navigation.navigate("WelcomeScreen")
    }

    return (
        <TouchableOpacity onPress={chosenLang === null? () => {} : () => func()} style={{width: '100%', height: vs(56), alignSelf: 'center', borderRadius: 100, opacity: chosenLang === null? 0.5 : 1, backgroundColor: '#504297', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: vs(35)}}>
            <Text style={{fontSize: isTablet ? vs(16) : vs(14), color: 'white', fontWeight: '600'}}>{translations[chosenLang]?.continue ?? "Continue"}</Text>
        </TouchableOpacity>
    )
}

export default Button