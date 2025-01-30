import { View, Text, Modal, TouchableOpacity, Dimensions, Image, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import google from '../images/google.png'
import apple from '../images/apple.png'
import narrow from '../images/narrowright-purple.png'
import * as Linking from 'expo-linking';
import { openInbox, getEmailClients } from "react-native-email-link";

const EmailModal = ({ modal, setModal }) => {

    const { width, height } = Dimensions.get('window');
    const [clients, setClients] = useState<any>()

    useEffect(() =>{
        const getClients = async() => {
            const clients = await getEmailClients();
            console.log(clients)
            setClients(clients)
        }
        getClients()
    }, [])

    return (
        <Modal visible={modal} transparent={true} animationType='slide'>
            <TouchableOpacity activeOpacity={0} style={{flex: 1}} onPress={() => setModal(false)}>
                <TouchableWithoutFeedback>
                    <View style={{width: width, height: height * (262 / 800), backgroundColor: 'white', position: 'absolute', bottom: 0, borderTopRightRadius: 24, borderTopLeftRadius: 24, shadowOffset: {width: 1, height: 1}, shadowColor: 'black', shadowRadius: 450, shadowOpacity: 1, alignItems: 'center'}}>
                        <View style={{width: width * (312 / 360), height: height * (192 / 800), alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
                            <View style={{width: width * (48 / 360), height: height * (4 / 800), borderRadius: 100, backgroundColor: '#D4D1D1'}}/>
                            <View style={{width: width * (312 / 360), height: height * (164 / 800), justifyContent: 'space-between'}}>
                                <Text style={{color: '#222222', fontWeight: '600', fontSize: 16, lineHeight: 24}}>Choose email provider</Text>
                                <View style={{width: width * (312 / 360), height: height * (124 / 800), justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TouchableOpacity onPress={() => {
                                        setModal(false)
                                        openInbox({app: 'gmail'})
                                    }} style={{width: width * (312 / 360), height: height * (56 / 800), borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: width * (16 / 360)}}>
                                        <Image style={{width: width * (24 / 360), height: height * (24 / 800)}} source={google}/>
                                        <Text style={{width: width * (216 / 360), fontSize: 14, lineHeight: 24, color: '#222222', fontWeight: '600'}}>Open Gmail</Text>
                                        <Image style={{width: width * (24 / 360), height: height * (24 / 800)}} source={narrow}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { 
                                        setModal(false)
                                        openInbox({ app: clients[0]?.iOSAppName }) 
                                    }} style={{width: width * (312 / 360), height: height * (56 / 800), borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: width * (16 / 360)}}>
                                        <Image style={{width: width * (24 / 360), height: height * (24 / 800)}} source={apple}/>
                                        <Text style={{width: width * (216 / 360), fontSize: 14, lineHeight: 24, color: '#222222', fontWeight: '600'}}>Open Mail</Text>
                                        <Image style={{width: width * (24 / 360), height: height * (24 / 800)}} source={narrow}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default EmailModal