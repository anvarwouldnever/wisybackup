import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import store from '../../store/store'
import { useScale } from '../../hooks/useScale'
import { useNavigation } from '@react-navigation/native'
import api from '../../api/api'

const Button = ({ setError, email, isValidEmail }) => {

    const { s, vs } = useScale()

    const navigation = useNavigation()
    
    const resetPassword = async () => {
        try {
            const response = await api.forgotPassword(email);
            if (response.is_success) {
                await store.setHoldEmail(email);
                navigation.navigate("EmailConfirmScreen")
            } else {
                setError(response)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TouchableOpacity onPress={isValidEmail ? () => resetPassword() : () => navigation.navigate("ResetPassword")} style={{ backgroundColor: '#504297', width: s(312), height: vs(56), borderRadius: 100, alignItems: 'center', justifyContent: 'center', opacity: isValidEmail ? 1 : 0.5 }}>

            <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize:vs(14), textAlign: 'center' }}>
                {translations?.[store.language]?.send}
            </Text>

        </TouchableOpacity>
    )
}

export default Button