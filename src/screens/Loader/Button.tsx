import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useScale } from '../../hooks/utils/useScale'

const Button = () => {

    const { s, vs } = useScale()

    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => navigation.navigate('ChoosePlayerScreen')} style={{position: 'absolute', top: vs(668),  backgroundColor: '#504297', width: s(312), height: vs(56), borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFFFFF', fontSize: Platform.isPad? vs(10) : vs(14), fontWeight: '600', textAlign: 'center', lineHeight: 24}}>Continue</Text>
        </TouchableOpacity>
    )
}

export default Button;