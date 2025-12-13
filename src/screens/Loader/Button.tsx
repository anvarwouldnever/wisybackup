import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useScale } from '../../hooks/utils/useScale'
import translations from '../../../localization'
import store from '../../store/store'
import * as ScreenOrientation from "expo-screen-orientation";
import { clearChildrenCache } from '../ChoosePlayer/hooks/getChildren'

const Button = ({ setIsFrozen }) => {

    const { s, vs } = useScale()

    const navigation = useNavigation()

    const onPress = async() => {
        setIsFrozen(true)
        clearChildrenCache()

        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        setTimeout(() => {
            navigation.navigate('ChoosePlayerScreen');
        }, 100);
    }

    return (
        <TouchableOpacity onPress={() => onPress()} style={{position: 'absolute', top: vs(668),  backgroundColor: '#504297', width: s(312), height: vs(56), borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFFFFF', fontSize: vs(14), fontWeight: '600', textAlign: 'center' }}>{translations?.[store.language]?.continue}</Text>
        </TouchableOpacity>
    )
}

export default Button;