import { View, Text } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'

const Inputs = ({ error, answer }) => {

    const { s, vs } = useScale()

    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: s(216), height: vs(48), backgroundColor: 'white' }}>
            {Array(4).fill(0).map((_, idx) => (
                <Text key={idx} style={{
                    width: s(45),
                    fontWeight: '600',
                    fontSize: vs(24),
                    lineHeight: vs(45),
                    color: '#222222',
                    height: vs(48),
                    borderRadius: 4,
                    backgroundColor: '#F8F8F8',
                    borderWidth: 1,
                    borderColor: error? 'red' : '#F1F1F1',
                    textAlign: 'center'
                }}>
                    {answer[idx] !== undefined ? answer[idx] : ''}
                </Text>
            ))}
        </View>
    )
}

export default Inputs