import { View } from 'react-native'
import React from 'react'
import { useScale } from '../../../hooks/utils/useScale'

const Dots = ({ avatars, currentAvatar }) => {

    const { s, vs } = useScale()

    return (
        <View style={{width: s(156), height: 'auto', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            {avatars?.map((_, index) => {
                return (
                    <View key={index} style={{width: vs(12), height: vs(12), borderRadius: 100, opacity: 0.9, backgroundColor: currentAvatar === index ? '#504297' : '#E5E5E5'}}/>
                )
            })}
        </View> 
    )
}

export default Dots