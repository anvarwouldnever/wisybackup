import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import store from '../../store/store'
import { useScale } from '../../hooks/useScale'
import { useNavigation } from '@react-navigation/native'
import api from '../../api/api'
import { ForgotPassword } from '../../api/methods/auth/auth'

const Button = ({ setError, email, isValidEmail }) => {

    const { s, vs } = useScale()

    const navigation = useNavigation()
    
    const resetPassword = async () => {
        try {
            const response = await ForgotPassword(email);
            if (response.data?.is_success) {
                await store.setHoldEmail(email);
                navigation.navigate("EmailConfirmScreen")
            }
        } catch (error) {
            console.log(error);
            setError(error.response.data.message)
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