import { View, Text, SafeAreaView, useWindowDimensions, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Logo from './Logo';
import { useNavigation } from '@react-navigation/native';
import api from '../api/api';

const ForgotPassword = () => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    const [email, setEmail] = useState<string>('');
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);

    // anvartashpulatov2@gmail.com

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        setIsValidEmail(validateEmail(text));
    };

    const resetPassword = async () => {
        try {
            const response = await api.forgotPassword(email);
            if (response.is_success) {
                console.log('email sent');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <View style={{ alignSelf: 'flex-start' }}>
                <Logo />
            </View>
            <View style={{ gap: windowHeight * (20 / 800), position: 'absolute', alignSelf: 'center' }}>
                <View style={{ width: windowWidth * (312 / 360), height: windowHeight * (88 / 800), justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: '600', color: '#222222', fontSize: windowHeight * (20 / 800), textAlign: 'center' }}>Forgot your password?</Text>
                    <Text style={{ fontWeight: '400', color: '#555555', fontSize: windowHeight * (14 / 800), textAlign: 'center', lineHeight: windowHeight * (24 / 800) }}>
                        Enter your email address and we will send you instructions to reset your password
                    </Text>
                </View>
                <TextInput
                    onChangeText={handleEmailChange}
                    placeholderTextColor={"#B1B1B1"}
                    placeholder='Email address'
                    style={{
                        borderWidth: 1,
                        fontSize: windowHeight * (14 / 800),
                        fontWeight: '600',
                        marginTop: 30,
                        borderColor: '#E5E5E5',
                        width: windowWidth * (312 / 360),
                        height: windowHeight * (56 / 800),
                        borderRadius: 100,
                        paddingHorizontal: 16
                    }}
                />
                <TouchableOpacity
                    onPress={isValidEmail ? () => resetPassword() : undefined} // Блокируем вызов функции, если email невалидный
                    style={{
                        backgroundColor: '#504297',
                        width: windowWidth * (312 / 360),
                        height: windowHeight * (56 / 800),
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isValidEmail ? 1 : 0.5 // Меняем прозрачность в зависимости от валидности email
                    }}
                >
                    <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: windowHeight * (14 / 800), textAlign: 'center' }}>
                        Send
                    </Text>
                </TouchableOpacity>
                <View style={{ width: windowWidth * (312 / 360), height: windowHeight * (20 / 800), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Text style={{ color: '#555555', fontWeight: '600', fontSize: windowHeight * (12 / 800), textAlign: 'center' }}>Back to</Text>
                    <Text onPress={() => navigation.goBack()} style={{ color: '#504297', fontWeight: '600', fontSize: windowHeight * (12 / 800), textAlign: 'center' }}>Log in</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ForgotPassword;
