import { View, Text, Platform, TouchableOpacity, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import store from '../../store/store'
import api from '../../api/api'
import star from '../../images/tabler_star-filled.png';
import x from '../../images/xConfirmModal.png';
import galka from '../../images/galkaConfirmModal.png'

const ModalConfirm = ({ modal, setModal, setAnimationStart, currentAnimation }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const purchaseItem = async() => {
            try {
                const purchase = await api.purchaseItem({child_id: store.playingChildId.id, item_id: currentAnimation?.id, token: store.token})
                // if (purchase.is_error) {
                //     setModal(false);
                //     setAnimationStart(false);
                //     setCurrentAnimation(null)
                // } else {
                    setModal(false);
                    setAnimationStart(true);
                    store.setPlayingChildStars(-currentAnimation?.cost);
    
                // }
            } catch (error) {
                // console.log(error)
            }
        }

    return (
            <Modal backdropOpacity={0.1} onBackdropPress={() => setModal(false)} isVisible={modal} style={{width: windowWidth * (268 / 800), height: Platform.isPad? windowWidth * (216 / 800) : windowHeight * (216 / 360), backgroundColor: 'white', borderRadius: 10, position: 'absolute', top: windowHeight * (40 / 360), left: windowWidth * (394 / 800), alignItems: 'center'}}>
                <Text style={{fontWeight: '600', color: '#000000', fontSize: 24, textAlign: 'center', position: 'absolute', alignSelf: 'center', top: windowHeight * (30 / 360)}}>Please Confirm</Text>
                <View style={{width: windowWidth * (63 / 800), height: windowHeight * (38 / 360), flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', alignSelf: 'center', top: windowHeight * (60 / 360)}}>
                    <Image source={star} style={{width: windowWidth * (38 / 800), height: windowHeight * (38 / 360)}}/>
                    <Text style={{color: '#000000', fontSize: windowHeight * (32 / 360), fontWeight: '600', textAlign: 'center', textAlignVertical: 'center'}}>
                        {currentAnimation?.cost}
                    </Text>
                </View>
                <View style={{width: windowWidth * (129 / 800), height: windowHeight * (53 / 360), position: 'absolute', alignSelf: 'center', bottom: windowHeight * (25 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => {
                            setModal(false)
                        }} style={{backgroundColor: '#E94343', width: windowWidth * (53 / 800), height: windowHeight * (53 / 360), borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={x} style={{width: windowWidth * (36 / 800), height: windowHeight * (32 / 360), resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => purchaseItem()} style={{backgroundColor: '#28B752', width: windowWidth * (53 / 800), height: windowHeight * (53 / 360), borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={galka} style={{width: windowWidth * (36 / 800), height: windowHeight * (32 / 360), resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                </View>
            </Modal>
    )
}

export default ModalConfirm