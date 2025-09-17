import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import store from '../../store/store'
import { useNavigation } from '@react-navigation/native'
import { useScale } from '../../hooks/useScale'

const Buttons = () => {

    const navigation = useNavigation();

    const { s, vs } = useScale()

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: s(312), height: 'auto', alignSelf: 'center', marginBottom: vs(20), rowGap: vs(10) }}>
                
            <TouchableOpacity
                onPress={() => navigation.navigate('AuthScreen', {authOption: 'signup'})}
                style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#504297', width: s(312), height: vs(56), borderRadius: 100, borderWidth: 1, borderColor: 'black', }}
            >
                <Text style={{ fontWeight: '600', fontSize: vs(14), color: '#FFFFFF', }}>{translations?.[store.language]?.signup}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={() => navigation.navigate('AuthScreen', {authOption: 'login'})}
                style={{ alignItems: 'center', justifyContent: 'center', width: s(312), height: vs(56), borderRadius: 100, borderWidth: 1, borderColor: '#E5E5E5', }}
            >
                <Text style={{ fontWeight: '600', fontSize: vs(14), color: '#504297'}}>{translations?.[store.language]?.login}</Text>
            </TouchableOpacity>

        </View>
    )
}

export default Buttons