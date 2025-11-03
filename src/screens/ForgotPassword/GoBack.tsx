import { View, Text } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'
import translations from '../../../localization'
import store from '../../store/store'
import { useNavigation } from '@react-navigation/native'

const GoBack = () => {

    const { s, vs } = useScale()

    const navigation = useNavigation()

    return (
        <View style={{ width: s(312), height: vs(20), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        
            <Text style={{ color: '#555555', fontWeight: '600', fontSize: vs(12), textAlign: 'center' }}>{translations?.[store.language]?.backTo}</Text>
            
            <Text onPress={() => navigation.goBack()} style={{ color: '#504297', fontWeight: '600', fontSize: vs(12), textAlign: 'center' }}>{translations?.[store.language]?.login}</Text>
        
        </View>
    )
}

export default GoBack