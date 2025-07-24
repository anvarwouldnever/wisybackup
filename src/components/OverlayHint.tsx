import { View, useWindowDimensions } from 'react-native';
import Modal from 'react-native-modal'

const OverlayHint = ({ visible, onClose, children }) => {

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    return (
        <Modal animationIn={'lightSpeedIn'} animationOut={'fadeOut'} isVisible={visible} style={{position: 'absolute', width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 84}}>
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                }}
            >
            {children}
            </View>
        </Modal>
    )
}

export default OverlayHint