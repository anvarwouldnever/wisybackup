import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import store from '../../store/store'
import Animated from 'react-native-reanimated'
import { useScale } from '../../hooks/utils/useScale'

const LanguageReturn = ({ setScreen }) => {

    const { s, vs } = useScale()

    return (
        <Animated.View style={{width: s(312), height: vs(28), alignItems: 'center', flexDirection: 'row', gap: s(8)}}>
            
            <TouchableOpacity onPress={() => setScreen('Settings')} style={{justifyContent: 'center', alignItems: 'center', width: 'auto', height: 'auto'}}>
                <Image style={{width: s(24), height: vs(24)}} source={require('../../images/narrowLeftBlack.png')}/>
            </TouchableOpacity>

            <Text style={{color: '#222222', fontWeight: '600', fontSize: vs(20)}}>{translations?.[store.language]?.language}</Text>

        </Animated.View>
    )
}

export default LanguageReturn