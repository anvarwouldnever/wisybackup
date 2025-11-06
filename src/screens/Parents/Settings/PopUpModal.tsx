import React from "react";
import { View, Modal, Text, Image, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useScale } from "../../../hooks/utils/useScale";

const PopUpModal = ({ modal, setModal }) => {

    const { s, vs } = useScale()

    return (
        <Modal transparent={true} visible={modal} animationType='fade' onRequestClose={() => setModal(false)}>
            
            <TouchableOpacity activeOpacity={1} style={{ flex: 1, paddingHorizontal: vs(25) }} onPress={() => setModal(false)}>
                
                <TouchableWithoutFeedback>
                    
                    <View style={{position: 'absolute', top: vs(60), alignSelf: 'center', borderRadius: 12, width: '100%', padding: vs(16), height: vs(56), backgroundColor: '#504297', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                        
                        <Text style={{fontWeight: '600', fontSize: vs(14), color: '#FFFFFF'}}>New password was saved</Text>
                        
                        <TouchableOpacity onPress={() => setModal(false)}>
                        
                            <Image source={require('../../../images/xwhite.png')} style={{ width: vs(24), height: vs(24) }}/>
                        
                        </TouchableOpacity>

                    </View>

                </TouchableWithoutFeedback>
                
            </TouchableOpacity>

        </Modal>
    )
}

export default PopUpModal;