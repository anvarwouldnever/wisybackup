import { View, Text } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import store from '../../store/store'
import { useScale } from '../../hooks/utils/useScale'

const Texts = ({ labels }) => {

    const { s, vs } = useScale()

    return (
        <View style={{ width: s(312), height: vs(88), justifyContent: 'space-between' }}>
                    
            <Text style={{ fontWeight: '600', color: '#222222', fontSize: vs(20), textAlign: 'center' }}>{labels?.forgot_password}</Text>
            
            <Text style={{ fontWeight: '400', color: '#555555', fontSize: vs(14), textAlign: 'center', lineHeight: vs(24) }}>
                {labels?.forgot_password_instructions}
            </Text>

        </View>
    )
}

export default Texts