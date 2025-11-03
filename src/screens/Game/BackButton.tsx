import { Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import translations from '../../../localization';
import { playSound } from '../../hooks/usePlaySound';
import store from '../../store/store';
import { useScale } from '../../hooks/utils/useScale';

const BackButton = ({ setIsFrozen }) => {

    const navigation = useNavigation()

    const { s, vs } = useScale()

    const goBack = () => {
        playSound.stop(true);
        navigation.goBack();
        setIsFrozen(true);
    };

    return (
        <TouchableOpacity onPress={() => goBack()} style={{backgroundColor: 'white', width: 'auto', height: 'auto', columnGap: s(4), paddingHorizontal: s(10), paddingVertical: s(5), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
            <Image source={require('../../images/narrowleft-purple.png')} style={{width: s(10), height: s(10)}}/>
            <Text style={{fontWeight: '600', fontSize: s(6), color: '#504297'}}>{translations?.[store.language]?.exit}</Text>
        </TouchableOpacity>
    )
}

export default BackButton