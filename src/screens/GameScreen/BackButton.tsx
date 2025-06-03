import { View, Text, TouchableOpacity, Image, Platform, useWindowDimensions } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import narrowleft from '../../images/narrowleft-purple.png';
import translations from '../../../localization';
import { playSound } from '../../hooks/usePlayBase64Audio';
import { playSoundWithoutStopping } from '../../hooks/usePlayWithoutStoppingBackgrounds';
import store from '../../store/store';

const BackButton = ({ setIsFrozen }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation()

    const goBack = () => {
        playSound.stop();
        playSoundWithoutStopping.stop();
        navigation.goBack();
        setIsFrozen(true);
    };

    return (
        <TouchableOpacity onPress={() => goBack()} style={{backgroundColor: 'white', width: windowWidth * (85 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: windowWidth * (8 / 800), position: 'absolute', left: windowWidth * (30 / 800), top: windowHeight * (25 / 360), shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
            <Image source={narrowleft} style={{width: 24, height: 24, aspectRatio: 24 / 24}}/>
            <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), lineHeight: windowHeight * (20 / 360), color: '#504297'}}>{translations?.[store.language]?.exit}</Text>
        </TouchableOpacity>
    )
}

export default BackButton