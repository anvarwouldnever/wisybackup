import { View, Text, SafeAreaView, TextInput, TouchableOpacity, useWindowDimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import api from '../api/api';
import Logo from '../components/Logo';
import eye from '../images/tabler_eye.png'
import { observer } from 'mobx-react-lite';
import store from '../store/store';

const ResetPassword = ({ route }) => {
    const token = route.params.token
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    const [email, setEmail] = useState<string>('');

    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [newPasswordHidden, setNewPasswordHidden] = useState<boolean>(true)
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState<boolean>(true)

    const isPasswordValid = (password: string) => {
        return /[A-Z]/.test(password) && password.length >= 8; // Пароль должен быть длиной >= 8 и содержать хотя бы одну заглавную букву
    };

    const resetPassword = async () => {
        try {
            const response = await api.resetPassword(store.holdEmail, token, confirmPassword, confirmPassword);
            if (response.is_success) {
                navigation.navigate("ResettedPasswordScreen")
            }
        } catch (error) {
            console.log(error);
        }
    };

    const isFormValid =
        newPassword !== '' &&
        confirmPassword !== '' &&
        newPassword === confirmPassword &&
        isPasswordValid(newPassword);

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <View style={{ alignSelf: 'flex-start' }}>
                <Logo />
            </View>
            <View style={{ gap: windowHeight * (20 / 800), position: 'absolute', alignSelf: 'center' }}>
                <View style={{ width: windowWidth * (312 / 360), height: windowHeight * (88 / 800), justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: '600', color: '#222222', fontSize: windowHeight * (20 / 800), textAlign: 'center' }}>Reset your password</Text>
                    <Text style={{ fontWeight: '400', color: '#555555', fontSize: windowHeight * (14 / 800), textAlign: 'center', lineHeight: windowHeight * (24 / 800) }}>
                        Enter your email address and we will send you instructions to reset your password
                    </Text>
                </View>
                <View style={{height: 'auto', gap: windowHeight * (12 / 800)}}>
                    
                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), borderRadius: 100, borderWidth: 1, borderColor: '#E5E5E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: windowWidth * (24 / 360)}}>
                        <TextInput
                            secureTextEntry={newPasswordHidden}
                            onChangeText={(text) => setNewPassword(text)}
                            placeholderTextColor={"#B1B1B1"}
                            placeholder='New password'
                            style={{
                                fontSize: windowHeight * (14 / 800),
                                fontWeight: '600',
                                borderColor: '#E5E5E5',
                                width: windowWidth * (250 / 360),
                                height: windowHeight * (56 / 800),
                                borderRadius: 100,
                                paddingHorizontal: windowWidth * (24 / 360)
                            }}
                        />
                        <TouchableOpacity onPress={() => setNewPasswordHidden(prev => !prev)}>
                            <Image source={eye} style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), borderRadius: 100, borderWidth: 1, borderColor: '#E5E5E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: windowWidth * (24 / 360)}}>
                        <TextInput
                            onChangeText={(text) => setConfirmPassword(text)}
                            secureTextEntry={confirmPasswordHidden}
                            placeholderTextColor={"#B1B1B1"}
                            placeholder='Confirm password'
                            style={{
                                fontSize: windowHeight * (14 / 800),
                                fontWeight: '600',
                                borderColor: '#E5E5E5',
                                width: windowWidth * (250 / 360),
                                height: windowHeight * (56 / 800),
                                borderRadius: 100,
                                paddingHorizontal: windowWidth * (24 / 360)
                            }}
                        />
                        <TouchableOpacity onPress={() => setConfirmPasswordHidden(prev => !prev)}>
                            <Image source={eye} style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={{color: '#555555', fontSize: windowHeight * (12 / 800), fontWeight: '400', textAlign: 'center'}}>
                        Password must contain 1 uppercase letter
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={isFormValid ? () => resetPassword() : undefined} // Блокируем вызов функции, если email невалидный
                    style={{
                        backgroundColor: '#504297',
                        width: windowWidth * (312 / 360),
                        height: windowHeight * (56 / 800),
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isFormValid ? 1 : 0.5 // Меняем прозрачность в зависимости от валидности email
                    }}
                >
                    <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: windowHeight * (14 / 800), textAlign: 'center' }}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default observer(ResetPassword);