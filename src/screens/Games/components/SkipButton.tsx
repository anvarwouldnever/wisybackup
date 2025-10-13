import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import AnimatedPaw from '../../../components/AnimatedPaw'
import { useScale } from '../../../hooks/useScale'

type Props = {
    visible: boolean
    onSkip: () => void
    showPaw?: boolean
}

const SkipButton = observer(({ visible, onSkip, showPaw = false }: Props) => {
    
    if (!visible) return null

    const { s, vs } = useScale()

    return (
        <TouchableOpacity onPress={() => onSkip()} style={{ width: s(40), height: s(20), backgroundColor: 'white', position: 'absolute', bottom: s(4), right: 0, borderRadius: 100, alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            
            <Text style={{ fontWeight: '600', fontSize: s(6), color: '#504297' }}>
                Skip
            </Text>
        
            {showPaw && <AnimatedPaw />}

        </TouchableOpacity>
    )
})

export default SkipButton;