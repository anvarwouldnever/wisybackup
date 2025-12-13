import { StyleSheet, Platform } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useScale } from '../../../../hooks/utils/useScale';

const Blur = ({ isLocked, forMarket, height, width }) => {

    const { s, vs } = useScale()

    if (!isLocked) return null;

    return (
        <BlurView
            intensity={7}
            tint="light"
            style={{
                ...StyleSheet.absoluteFillObject,
                width: vs(width) || 'auto', 
                height: vs(height) || 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                overflow: 'hidden'
            }}
        >
            {!forMarket && <Ionicons name='lock-closed' size={24} color={'#504297'}/>}
        </BlurView>
    )
}

export default Blur