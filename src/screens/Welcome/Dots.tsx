import { View, Text } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'

const Dots = ({ currentIndex, onboardings }) => {

    const { s, vs } = useScale()

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', width: 'auto', gap: s(12), height: 12 }}>
            {onboardings?.map((_, index) => (
                <View
                    key={index}
                    style={{backgroundColor: currentIndex === index ? '#504297' : '#E5E5E5', width: 12, height: 12, borderRadius: 100, opacity: 0.9,}}
                />
            ))}
        </View>
    )
}

export default Dots