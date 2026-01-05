import { TextInput } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import store from '../../store/store'
import { useScale } from '../../hooks/utils/useScale'

const Input = ({ setIsValidEmail, setEmail, error, labels }) => {

    const { s, vs } = useScale()

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        setIsValidEmail(validateEmail(text));
    };

    return (
        <TextInput
            onChangeText={handleEmailChange}
            placeholderTextColor={"#B1B1B1"}
            placeholder={labels?.email_address}
            style={{
                borderWidth: 1,
                fontSize: vs(14),
                fontWeight: '600',
                marginTop: 30,
                borderColor: error != ''? 'red' : '#E5E5E5',
                width: s(312),
                height: vs(56),
                borderRadius: 100,
                paddingHorizontal: 16
            }}
        />
    )
}

export default Input