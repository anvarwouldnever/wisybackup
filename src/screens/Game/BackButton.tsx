import { Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { playSound } from '../../hooks/usePlaySound';
import { useScale } from '../../hooks/utils/useScale';
import * as ScreenOrientation from "expo-screen-orientation";

const BackButton = ({ setIsFrozen, isFromAttributes, labels }) => {

    const navigation = useNavigation()

    const { s, vs } = useScale()

    const goBack = async() => {
        if (isFromAttributes) {
            setIsFrozen(true);
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            playSound.stop(true);
            setTimeout(() => {
                navigation.goBack();
            }, 150);
        } else {
            playSound.stop(true);
            navigation.goBack();
            setIsFrozen(true);
        }
    };

    return (
        <TouchableOpacity onPress={() => goBack()} style={{backgroundColor: 'white', width: 'auto', height: 'auto', columnGap: s(4), paddingHorizontal: s(10), paddingVertical: s(5), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
            
            <Image source={require('../../images/narrowleft-purple.png')} style={{ width: s(10), height: s(10) }}/>
            
            <Text style={{fontWeight: '600', fontSize: s(6), color: '#504297'}}>{labels?.exit}</Text>

        </TouchableOpacity>
    )
}

export default BackButton;