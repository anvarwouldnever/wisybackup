import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Logo from '../components/Logo';
import EmailModal from './EmailConfirm/EmailModal';
import store from '../store/store';
import translations from '../../localization';
import { ForgotPassword } from '../api/methods/auth/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScale } from '../hooks/utils/useScale';
import { getLabels } from './Welcome/hooks/getLabels';

const EmailConfirmScreen = ({ route }) => {

    const { s, vs, isTablet } = useScale()

    const { labels } = getLabels()

    const [modal, setModal] = useState(false);
    const [timer, setTimer] = useState(20);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const email = route?.params?.email;

    const resetPassword = async () => {
        try {
            setIsButtonDisabled(true);
            setTimer(20);
            await ForgotPassword(email);
        } catch (error) {
            console.log(error?.response?.data);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isButtonDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsButtonDisabled(false);
            clearInterval(interval!);
        }

        return () => clearInterval(interval!);
    }, [timer, isButtonDisabled]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: vs(20) }}>
        
            <Logo />
        
            <View style={{ alignItems: 'center', width: '100%', height: 'auto', rowGap: vs(20)}}>
            
                <Image source={require('../images/noti-img 2 (1).png')} style={{ width: vs(250), height: vs(250)}}/>
                
                <View style={{ width: '100%', height: 'auto', alignItems: 'center', justifyContent: 'center', rowGap: vs(12)}}>
                
                    <Text style={{ color: '#222222', fontWeight: '600', fontSize: isTablet ? vs(18) : vs(16), textAlign: 'center' }}>
                        {labels?.follow_instructions}
                    </Text>
                    
                    <Text style={{ color: '#555555', fontWeight: '400', fontSize: isTablet ? vs(18) : vs(16), textAlign: 'center' }}>
                        {labels?.link_sent}
                    </Text>
                
                </View>

            </View>

            <EmailModal labels={labels} modal={modal} setModal={setModal} />
        
            <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', rowGap: vs(10)}}>
            
                <TouchableOpacity onPress={() => setModal(true)} style={{ backgroundColor: '#504297', borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: '100%', height: vs(56)}}>
                    
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: isTablet ? vs(16) : vs(14) }}>
                        {labels?.open_inbox}
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => resetPassword()} disabled={isButtonDisabled} style={{ justifyContent: 'center', borderRadius: 100, borderWidth: 1, borderColor: '#E5E5E5', alignItems: 'center', width: '100%', height: vs(56), opacity: 1}}>
                    
                    <Text style={{ color: '#504297', fontWeight: '600', fontSize: isTablet ? vs(16) : vs(14) }}>
                        {isButtonDisabled ? `${labels?.resend_code_in} 00:${timer.toString().padStart(2, '0')}` : `${translations?.[store.language]?.resendCode}`}
                    </Text>

                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
};

export default EmailConfirmScreen;
