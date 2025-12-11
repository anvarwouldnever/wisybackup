import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { openInbox, getEmailClients } from "react-native-email-link";
import Modal from 'react-native-modal'
import { useScale } from '../../hooks/utils/useScale';
import translations from '../../../localization';
import store from '../../store/store';
import { Ionicons } from '@expo/vector-icons';

const EmailModal = ({ modal, setModal }) => {

    const [clients, setClients] = useState<any>()

    const { s, vs, isTablet } = useScale()

    useEffect(() =>{
        const getClients = async() => {
            const clients = await getEmailClients();
            console.log(clients)
            setClients(clients)
        }
        getClients()
    }, [])

    return (
        <Modal animationOutTiming={1} animationOut={'slideOutDown'} hideModalContentWhileAnimating  isVisible={modal} onBackdropPress={() => setModal(false)} backdropOpacity={0.3} style={{ width: '100%', height: '100%', alignItems: 'center', position: 'absolute', alignSelf: 'center', justifyContent: 'flex-end' }} >
            
            <View style={{ width: '100%', height: vs(250), backgroundColor: 'white', borderTopLeftRadius: vs(35), borderTopRightRadius: vs(35), alignSelf: 'center', alignItems: 'center', paddingTop: vs(12), paddingHorizontal: vs(22), paddingBottom: vs(50), justifyContent: 'space-between'}}>
                
                <View style={{  width: vs(48), height: vs(4), backgroundColor: '#D4D1D1', borderRadius: 100 }} />

                <Text style={{ alignSelf: 'flex-start', color: '#222222', fontWeight: '600', fontSize: isTablet ? vs(16) : vs(14) }}>
                    {translations?.[store.language]?.chooseEmailProvider}
                </Text>

                <View style={{ width: '100%', height: 'auto', rowGap: vs(10) }}>

                    <TouchableOpacity onPress={() => { setModal(false); openInbox({app: 'gmail'})}} style={{ width: '100%', height: vs(56), borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingHorizontal: vs(20), columnGap: vs(10) }}>
                        
                        <Ionicons name='logo-google' size={vs(24)} />
                        
                        <Text style={{ fontSize: vs(14), color: '#222222', fontWeight: '600'}}>{translations?.[store.language]?.open} Gmail</Text>
                    
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setModal(false); openInbox({ app: clients[0]?.iOSAppName })}} style={{ width: '100%', height: vs(56), borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingHorizontal: vs(20), columnGap: vs(10) }}>
                        
                        <Ionicons name='logo-apple' size={vs(24)} />
                        
                        <Text style={{ fontSize: vs(14), color: '#222222', fontWeight: '600'}}>{translations?.[store.language]?.open} Mail</Text>
                    
                    </TouchableOpacity>

                </View>

            </View>

        </Modal>
    )
}

export default EmailModal