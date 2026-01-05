import React, { useState } from "react";
import { Modal, TouchableOpacity, TextInput, View, KeyboardAvoidingView, TouchableWithoutFeedback, Text, Image } from "react-native";
import { ChangePassword } from "../../../api/methods/auth/auth";
import { useScale } from "../../../hooks/utils/useScale";

const NewPasswordModal = ({ setModal, setSecure, secure, modal, setPopUpModal, labels }) => {

    const { s, vs, isTablet } = useScale()
    const [newPassword, setNewPassword] = useState("");

    const onPress = () => {
        if (newPassword.length <= 8 || !/[A-Z]/.test(newPassword)) return

        ChangePassword(newPassword);
        setModal(false);
        setPopUpModal(true);
    }

    return (
        <Modal transparent={true} visible={modal} animationType='slide' onRequestClose={() => setModal(false)} >
            
            <TouchableOpacity activeOpacity={0} style={{ height: '100%' }} onPress={() => setModal(false)}>   
                
                <KeyboardAvoidingView style={{ position: 'absolute', bottom: 0, width: '100%' }} behavior='padding'>
                    
                    <TouchableWithoutFeedback>
                        
                        <View style={{width: '100%', height: 'auto', backgroundColor: 'white', borderRadius: vs(24), shadowColor: 'black', shadowRadius: 600, shadowOpacity: 1, padding: vs(25), rowGap: vs(15) }}>
                            
                            <View style={{width: '100%', alignSelf: 'center', height: 'auto', rowGap: vs(15), alignItems: 'center'}}>
                                
                                <Text style={{color: '#222222', fontSize: vs(16), fontWeight: '600', alignSelf: 'flex-start' }}>Change password</Text>
                                
                                <View style={{width: '100%', height: 'auto', alignItems: 'center', rowGap: vs(15)  }}>
                                    
                                    <View style={{borderRadius: 100, height: vs(56), width: '100%', borderWidth: 1, borderColor: '#E5E5E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: vs(16)}}>
                                        
                                        <TextInput 
                                            style={{ borderRadius: 100, height: '100%', fontSize: vs(14), alignItems: 'center', fontWeight: '600', width: '90%' }}
                                            placeholder={labels?.new_password}
                                            placeholderTextColor={'#B1B1B1'}
                                            secureTextEntry={secure}
                                            onChangeText={(text) => setNewPassword(text)}
                                        />
                                        
                                        <TouchableOpacity onPress={() => setSecure(prev => !prev)}>
                                            
                                            <Image source={require('../../../images/tabler_eye.png')} style={{ width: vs(24), height: vs(24) }}/>
                                        
                                        </TouchableOpacity>

                                    </View>

                                    <Text style={{ fontWeight: '500', fontSize: vs(12), color: '#555555' }}>{labels?.passwordUppercaseRule}</Text>
                                
                                </View>

                            </View>

                            <TouchableOpacity onPress={() => onPress()} style={{ backgroundColor: '#504297', opacity: newPassword.length < 8 || !/[A-Z]/.test(newPassword) ? 0.5 : 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: '100%', height: vs(56), alignSelf: 'center' }}>
                                
                                <Text style={{color: '#FFFFFF', fontWeight: '600', fontSize: vs(14) }}>
                                    {labels?.save}
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </TouchableWithoutFeedback>

                </KeyboardAvoidingView>

            </TouchableOpacity>

        </Modal>
    )
}

export default NewPasswordModal;