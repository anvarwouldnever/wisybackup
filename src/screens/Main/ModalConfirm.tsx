import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import store from '../../store/store'
import { useScale } from '../../hooks/utils/useScale'
import { gameStore } from '../Games/store/gameStore'
import { Purchase } from '../../api/methods/market/purchase'

const ModalConfirm = ({ modal, setModal, setAnimationStart, currentAnimation, setAnimation, setCurrentAnimation }) => {

    const purchaseItem = async() => {
        try {
            // const purchase = await Purchase(store?.playingChildId?.id, currentAnimation?.id)
            // if (purchase?.data?.is_error) {
            //     setModal(false);
            //     setAnimationStart(false);
            //     setCurrentAnimation(null)
            // } else {
                setModal(false);
                setAnimationStart(true);
                store.setPlayingChildStars(-currentAnimation?.cost);
            // }
        } catch (error) {
            console.log(error?.response?.data?.message)
            setModal(false);
            setAnimationStart(false);
            setCurrentAnimation(null)
        }
    }

    const { s, vs } = useScale();

    return (
        <Modal animationInTiming={100} animationIn={'fadeInUp'} backdropOpacity={0.3} onBackdropPress={() => setModal(false)} isVisible={modal} style={{ width: '60%', height: 'auto', alignItems: 'center', alignSelf: 'flex-end' }}>
                
            <View style={{ width: s(120), height: s(100), backgroundColor: 'white', borderRadius: 10, justifyContent: 'space-between', padding: s(12) }}>
                
                <View style={{ width: '100%', rowGap: s(5), alignItems: 'center', justifyContent: 'center' }}>
                    
                    <Text style={{ fontWeight: '600', color: '#000000', fontSize: s(10), textAlign: 'center' }}>Please Confirm</Text>

                    <View style={{ flexDirection: 'row', width: '100%', columnGap: s(3), alignItems: 'center', justifyContent: 'center'  }}>

                        <Image source={require('../../images/star.png')} style={{width: s(15), height: s(15)}}/>
                        
                        <Text style={{ color: '#000000', fontSize: s(15), fontWeight: '600', textAlign: 'center', textAlignVertical: 'center' }}>
                            {currentAnimation?.cost}
                        </Text>

                    </View>

                </View>

                <View style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'center', columnGap: s(10) }}>
                    
                    <TouchableOpacity onPress={() => setModal(false)} style={{ backgroundColor: '#E94343', width: s(25), height: s(25), borderRadius: 100, justifyContent: 'center', alignItems: 'center', padding: s(5) }}>
                        
                        <Image source={require('../../images/xConfirmModal.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain'}}/>
                    
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => purchaseItem()} style={{ backgroundColor: '#28B752', width: s(25), height: s(25), borderRadius: 100, justifyContent: 'center', alignItems: 'center', padding: s(5) }}>
                        
                        <Image source={require('../../images/galkaConfirmModal.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain'}}/>
                    
                    </TouchableOpacity>

                </View>

            </View>

        </Modal>
    )
}

export default ModalConfirm