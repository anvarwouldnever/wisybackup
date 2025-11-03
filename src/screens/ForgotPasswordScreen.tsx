import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import Logo from '../components/Logo';
import GoBack from './ForgotPassword/GoBack';
import { useScale } from '../hooks/utils/useScale';
import Button from './ForgotPassword/Button';
import Input from './ForgotPassword/Input';
import Texts from './ForgotPassword/Texts';

const ForgotPasswordScreen = () => {

    const { s, vs } = useScale()

    const [email, setEmail] = useState<string>('');
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
    const [error, setError] = useState<string>('')

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            
            <View style={{ alignSelf: 'flex-start' }}>
                <Logo />
            </View>
            
            <View style={{ gap: vs(20), position: 'absolute', alignSelf: 'center' }}>
                
                <Texts />

                <Input error={error} setEmail={setEmail} setIsValidEmail={setIsValidEmail} />

                {error != '' && <Text style={{textAlign: 'center', fontWeight: '600', color: 'red'}}>{error}</Text>}
                
                <Button isValidEmail={isValidEmail} email={email} setError={setError} />

                <GoBack />

            </View>

        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
