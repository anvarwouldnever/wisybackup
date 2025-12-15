import React from 'react'
import { BlurView } from 'expo-blur'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useScale } from '../../../../hooks/utils/useScale';

const Blur = ({ isLocked, forMarket, height, width, borderRadius }) => {

    const { s, vs } = useScale()

    if (!isLocked) return null;

    return (
        <BlurView
            intensity={7}
            tint="light"
            style={{
                flex: 1,
                position: 'absolute',
                alignSelf: 'center',
                width: width || 'auto', 
                height: height || 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: borderRadius,
                overflow: 'hidden'
            }}
        >
            {!forMarket && <Ionicons name='lock-closed' size={24} color={'#504297'}/>}
        </BlurView>
    )
}

export default Blur