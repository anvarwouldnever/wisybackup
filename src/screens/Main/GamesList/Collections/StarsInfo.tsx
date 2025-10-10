import { View, Text, Image } from 'react-native'
import React from 'react'
import { useScale } from '../../../../hooks/useScale'

const StarsInfo = ({ item }) => {

    const { s, vs, isTablet } = useScale()

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        
            <Image source={require('../../../../images/tabler_star-filled.png')} style={{ width: vs(30),height: vs(30) }} resizeMode='contain' />
                    
            <Text style={{ fontWeight: '600', fontSize: isTablet ? s(7) : s(6), color: 'black', marginLeft: vs(10) }}>{item?.stars?.earned}</Text>
                    
            <Text style={{ fontWeight: '600', fontSize: isTablet ? s(7) : s(6), color: '#B4B4B4' }}> / {item?.stars?.total}</Text>

        </View>
    )
}

export default StarsInfo