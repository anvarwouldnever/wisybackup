import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";
import translations from "../../../localization";
import store from "../../store/store";
import { Register } from "../../api/methods/auth/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useScale } from "../../hooks/utils/useScale";

const AuthSignup = ({ proceed, toggleOption }) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { s, vs, isTablet } = useScale()

    const signUp = async() => {
        try {
            setLoading(true)
            const response = await Register(email, password)
            if (response.data?.is_success) {
                proceed()
            }

        } catch (error) {
            console.log(error)
            setError(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Animated.View style={{justifyContent: 'space-between', marginTop: vs(30), alignSelf: 'center', width: '100%', height: 'auto', rowGap: vs(20)}}>
                
                <Text style={{textAlign: 'center', color: '#222222', fontWeight: '600', fontSize: isTablet ? vs(22) : vs(20)}}>{translations?.[store.language]?.hello}!</Text>
                
                <View style={{alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: 'auto', gap: vs(12)}}>
                    
                    <TextInput 
                        onChangeText={(text) => setEmail(text)} 
                        keyboardType='email-address' 
                        style={{fontWeight: '600', fontSize: isTablet ? vs(16) : vs(14), padding: vs(16), borderRadius: 100, borderWidth: 1, borderColor: error === 'email' || error === 'email2' ? '#D83636' : '#E5E5E5', borderStyle: 'solid', width: '100%', height: vs(56)}} 
                        placeholderTextColor={'#B1B1B1'} 
                        placeholder={translations?.[store.language]?.email}
                    />
                        
                        {error &&
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <Text style={{ paddingLeft: vs(16), fontWeight: '600', fontSize: isTablet ? vs(14) : vs(12), alignItems: 'center', color: '#D83636'}}>{error}</Text>
                            </View>
                        }
                        
                    <TextInput 
                        onChangeText={(text) => setPassword(text)} 
                        keyboardType='visible-password' 
                        style={{fontWeight: '600', fontSize: isTablet ? vs(16) : vs(14), padding: vs(16), borderRadius: 100, borderWidth: 1, borderColor: error === 'password'? '#D83636' : '#E5E5E5', borderStyle: 'solid', width: '100%', height: vs(56)}} 
                        placeholderTextColor={'#B1B1B1'} 
                        placeholder={translations?.[store.language]?.password} 
                        secureTextEntry={true}
                    />

                </View>

                <TouchableOpacity disabled={!email || !password || password?.length < 8} onPress={() => signUp()} style={{justifyContent: 'center', alignItems: 'center', opacity: email != '' && password != '' && password?.length >= 8? 1 : 0.5, alignSelf: 'center', width: '100%', height: vs(56), backgroundColor: '#504297', borderRadius: 100 }}>
                    <Text style={{fontWeight: '600', color: 'white', textAlign: 'center', fontSize: isTablet ? vs(16) : vs(14)}}>{translations?.[store.language]?.continue}</Text>
                </TouchableOpacity>
                
                <View style={{height: 1, width: '100%', backgroundColor: '#E5E5E5'}}/>
                
                <View style={{justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', width: '100%', height: 'auto', rowGap: vs(12)}}>
                    
                    <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', padding: 16, width: '100%', height: vs(56), borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 100, columnGap: vs(15)}}>
                        <Ionicons name='logo-google' size={vs(22)} />
                        <Text style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), color: '#222222'}}>{translations?.[store.language]?.continueWith} Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', padding: 16, width: '100%', height: vs(56), borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 100, columnGap: vs(15)}}>
                        <Ionicons name='logo-apple' size={vs(22)} />
                        <Text style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), color: '#222222'}}>{translations?.[store.language]?.continueWith} Apple</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', padding: 16, width: '100%', height: vs(56), borderColor: '#E5E5E5', borderWidth: 1, borderRadius: 100, columnGap: vs(15)}}>
                        <Ionicons name='logo-facebook' size={vs(22)} />
                        <Text style={{fontWeight: '600', fontSize: isTablet? vs(16) : vs(14), color: '#222222'}}>{translations?.[store.language]?.continueWith} Facebook</Text>
                    </TouchableOpacity>

                </View>

                
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: vs(20)}}>
                    
                    <Text style={{color: '#555555', fontWeight: '600', fontSize: isTablet ? vs(14) : vs(12)}}>{translations?.[store.language]?.iAlrHaveAcc}</Text>
                    
                    <TouchableOpacity onPress={() => toggleOption('login')} style={{marginLeft: 2}}>
                        <Text style={{color: '#504297', fontWeight: '600', fontSize: isTablet ? vs(14) : vs(12)}}>{translations?.[store.language]?.login}</Text>
                    </TouchableOpacity>

                </View>
                
                {loading && <ActivityIndicator color='#504297' style={{position: 'absolute', alignSelf: 'center', top: 0, left: 0, right: 0, bottom: 0}}/>}

        </Animated.View>
    )
}

export default AuthSignup;