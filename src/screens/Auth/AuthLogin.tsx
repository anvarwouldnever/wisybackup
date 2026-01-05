import React, { useState } from "react";
import { Linking, View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator, Keyboard } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import store from "../../store/store";
import { observer } from 'mobx-react-lite'
import { openInbox } from "react-native-email-link";
import { useNavigation } from "@react-navigation/native";
import translations from "../../../localization";
import { Login } from "../../api/methods/auth/auth";
import * as SecureStore from 'expo-secure-store';
import { useScale } from "../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";

const AuthLogin = ({ toggleOption, playersScreen, labels }) => {

    const handleOpenUrl = async (url) => {
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          await Linking.openURL(url);
        }
    };

    const { s, vs, isTablet } = useScale();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const signIn = async() => {
        try {
            setLoading(true);
            const response = await Login(email, password)
            if (response.data?.token) {
                Keyboard.dismiss()
                await SecureStore.setItemAsync('token', response.data?.token);
                playersScreen()
            }            
        } catch (error) {
            console.log(error?.response?.data)
            setError(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Animated.View entering={FadeInRight} style={{justifyContent: 'space-between', marginTop: vs(30), alignSelf: 'center', width: '100%', height: 'auto', rowGap: vs(20)}}>
                
            <Text style={{textAlign: 'center', color: '#222222', fontWeight: '600', fontSize: isTablet ? vs(22) : vs(20)}}>{labels?.hello}!</Text>

            <View style={{alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: 'auto', gap: vs(20)}}>
                
                <View style={{ rowGap: vs(12), width: '100%', height: 'auto' }}>
                    
                    <TextInput 
                        onChangeText={(text) => setEmail(text)} 
                        keyboardType='email-address' 
                        style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), padding: vs(16), borderRadius: 100, borderWidth: 1, borderColor: error? '#D83636' : '#E5E5E5', borderStyle: 'solid', width: '100%', height: vs(56)}} 
                        placeholderTextColor={'#B1B1B1'} 
                        placeholder={labels?.email_address}
                    />
                        
                    <TextInput 
                        onChangeText={(text) => setPassword(text)} 
                        keyboardType='visible-password' 
                        style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), padding: vs(16), borderRadius: 100, borderWidth: 1, borderColor: error? '#D83636' : '#E5E5E5', borderStyle: 'solid', width: '100%', height: vs(56)}} 
                        placeholderTextColor={'#B1B1B1'} 
                        placeholder={labels?.password} 
                        secureTextEntry={true}
                    />
                    
                </View>

                {error &&
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <Text style={{ fontWeight: '600', fontSize: vs(12), alignItems: 'center', color: '#D83636', paddingLeft: vs(16)}}>{error}</Text>
                    </View>
                }
                    
                <Text onPress={() => navigation.navigate("ForgotPassword")} style={{color: '#555555', fontSize: isTablet ? vs(14) : vs(12), fontWeight: '600', alignSelf: 'flex-start', paddingLeft: vs(16)}}>{labels?.forgot_password}</Text>
                    
            </View>
            
            <TouchableOpacity disabled={!email || !password || password?.length < 8} onPress={() => signIn()} style={{justifyContent: 'center', alignItems: 'center', opacity: email != '' && password != '' && password?.length >= 8? 1 : 0.5, alignSelf: 'center', width: '100%', height: vs(56), backgroundColor: '#504297', borderRadius: 100 }}>
                <Text style={{fontWeight: '600', color: 'white', textAlign: 'center', fontSize: isTablet? vs(16) : vs(14)}}>{labels?.continue}</Text>
            </TouchableOpacity>

            <View style={{height: 1, width: '100%', backgroundColor: '#E5E5E5'}}/>

            <View style={{justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', width: '100%', height: 'auto', rowGap: vs(12)}}>
                
                <TouchableOpacity onPress={() => openInbox()} style={{ alignItems: 'center', flexDirection: 'row', padding: 16, width: '100%', height: vs(56), borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 100, columnGap: vs(15)}}>
                    <Ionicons name='logo-google' size={vs(22)} />
                    <Text style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), color: '#222222'}}>{labels?.continue_with_google}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOpenUrl('https://www.gmail.com')} style={{ alignItems: 'center', flexDirection: 'row', padding: 16, width: '100%', height: vs(56), borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 100, columnGap: vs(15)}}>
                    <Ionicons name='logo-apple' size={vs(22)} />
                    <Text style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), color: '#222222'}}>{labels?.continue_with_apple}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOpenUrl('https://www.facebook.com')} style={{ alignItems: 'center', flexDirection: 'row', padding: 16, width: '100%', height: vs(56), borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 100, columnGap: vs(15)}}>
                    <Ionicons name='logo-facebook' size={vs(22)} />
                    <Text style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), color: '#222222'}}>{labels?.continue_with_facebook}</Text>
                </TouchableOpacity>

            </View>
            
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: vs(20)}}>
                
                <Text style={{color: '#555555', fontWeight: '600', fontSize: isTablet ? vs(14) : vs(12)}}>{translations?.[store.language]?.iDontHaveAcc}</Text>
                
                <TouchableOpacity onPress={() => toggleOption('signup')} style={{marginLeft: 2}}>
                    <Text style={{color: '#504297', fontWeight: '600', fontSize: isTablet ? vs(14) : vs(12)}}>{translations?.[store.language]?.signup}</Text>
                </TouchableOpacity>

            </View>
            
            {loading && <ActivityIndicator color='#504297' style={{position: 'absolute', alignSelf: 'center', top: 0, left: 0, right: 0, bottom: 0}}/>}
            
        </Animated.View>
    )
}

export default observer(AuthLogin);