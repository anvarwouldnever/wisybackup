import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Logo from '../components/Logo';
import GoBack from './ForgotPassword/GoBack';
import { useScale } from '../hooks/utils/useScale';
import Button from './ForgotPassword/Button';
import Input from './ForgotPassword/Input';
import Texts from './ForgotPassword/Texts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLabels } from './Welcome/hooks/getLabels';

const ForgotPasswordScreen = () => {

    const { s, vs } = useScale()

    const { labels } = getLabels()

    const [email, setEmail] = useState<string>('');
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
    const [error, setError] = useState<string>('')

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            
            <View style={{ alignSelf: 'flex-start' }}>
                <Logo />
            </View>
            
            <View style={{ gap: vs(20), position: 'absolute', alignSelf: 'center', width: '100%', alignItems: 'center' }}>
                
                <Texts labels={labels} />

                <Input labels={labels} error={error} setEmail={setEmail} setIsValidEmail={setIsValidEmail} />

                {error != '' && <Text numberOfLines={2} style={{ textAlign: 'center', fontWeight: '600', color: 'red', width: '50%', alignSelf: 'center' }}>{error}</Text>}
                
                <Button labels={labels} isValidEmail={isValidEmail} email={email} setError={setError} />

                <GoBack />

            </View>

        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
