import { StyleSheet, Platform } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useScale } from '../../../../hooks/utils/useScale';

const Blur = ({ isLocked, forMarket }) => {

    const { s, vs } = useScale()

    if (!isLocked) return null;

    return (
        <BlurView
            intensity={7}
            tint="light"
            style={{
                ...StyleSheet.absoluteFillObject,
                width: vs(320), 
                height: vs(370),
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