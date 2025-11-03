import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import translations from '../../../localization'
import store from '../../store/store'

const Back = () => {

    const { s, vs } = useScale()

    const navigation = useNavigation();

    const onPress = () => {
        store.setPlayingMusic(true)
        navigation.goBack()
    }

    return (
        <TouchableOpacity onPress={() => onPress()} style={{ flexDirection: 'row', width: 'auto', height: 'auto', backgroundColor: 'white', alignItems: 'center', alignSelf: 'flex-start', columnGap: vs(5) }}>
                    
            <Ionicons name='chevron-back' size={vs(24)} />
                
            <Text style={{fontWeight: '600', color: '#222222', fontSize: vs(16)}}>
                {translations?.[store.language]?.back}
            </Text>
        
        </TouchableOpacity>
    )
}

export default Back;