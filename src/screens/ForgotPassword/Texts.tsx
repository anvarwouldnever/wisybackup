import { View, Text } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import store from '../../store/store'
import { useScale } from '../../hooks/utils/useScale'

const Texts = () => {

    const { s, vs } = useScale()

    return (
        <View style={{ width: s(312), height: vs(88), justifyContent: 'space-between' }}>
                    
            <Text style={{ fontWeight: '600', color: '#222222', fontSize: vs(20), textAlign: 'center' }}>{translations?.[store.language]?.forgotUrPassword}?</Text>
            
            <Text style={{ fontWeight: '400', color: '#555555', fontSize: vs(14), textAlign: 'center', lineHeight: vs(24) }}>
                {translations?.[store.language]?.enterYourEmailAddressAnd}
            </Text>

        </View>
    )
}

export default Texts