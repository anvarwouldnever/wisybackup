import { View } from 'react-native'
import React from 'react'
import { useScale } from '../../../hooks/utils/useScale'

const Dots = ({ currentIndex, length }) => {

    const { s, vs } = useScale()

    return (
        <View style={{width: s(132), height: 'auto', flexDirection: 'row', justifyContent: 'space-between'}}>
            {Array.from({ length })?.map((dot, index) => (
                <View key={index} style={{width: vs(12), height: vs(12), borderRadius: 100, backgroundColor: currentIndex === index ? '#504297' : '#E5E5E5'}}/>
            ))}
        </View>
    )
}

export default Dots