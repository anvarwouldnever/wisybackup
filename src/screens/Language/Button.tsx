import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import translations from '../../../localization';
import store from '../../store/store';
import { useScale } from '../../hooks/useScale';

const Button = ({ chosenLang }) => {

    const navigation = useNavigation();

    const { s, vs } = useScale()

    const func = async() => {
        await store.setLanguage(chosenLang?.tag)
        navigation.navigate("WelcomeScreen")
    }

    return (
        <TouchableOpacity onPress={chosenLang === null? () => {return} : () => func()} style={{width: s(312), height: vs(56), alignSelf: 'center', borderRadius: 100, opacity: chosenLang === null? 0.5 : 1, backgroundColor: '#504297', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: vs(14), color: 'white', fontWeight: '600'}}>{translations[chosenLang?.tag]?.continue ?? "Continue"}</Text>
        </TouchableOpacity>
    )
}

export default Button