import Modal from 'react-native-modal'
import { useScale } from '../../../hooks/utils/useScale';

const OverlayHint = ({ visible, children }) => {

    const { s, vs } = useScale()

    return (
        <Modal animationInTiming={100} animationIn={'fadeInUp'} animationOut={'fadeOut'} isVisible={visible} style={{ width: 'auto', position: 'absolute', left: -s(3), bottom: -s(7), height: 'auto', alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row', pointerEvents: 'box-none' }}>
            {children}
        </Modal>
    )
}

export default OverlayHint;