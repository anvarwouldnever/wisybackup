import { View, Text } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'

const Description = ({ stars, labels }) => {

    const { s, vs } = useScale();

    return (
        <View style={{width: '100%', height: 'auto', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', rowGap: s(5), position: 'absolute', top: 0, bottom: 0}}>
            <Text style={{fontSize: s(8), fontWeight: '600', color: '#222222', alignSelf: 'center'}}>
                {stars?.length == 0 ? labels?.success_title_0 : stars?.length == 1 ? labels?.success_title_1 : stars?.length == 2 ? labels?.success_title_2 : stars?.length == 3 ? labels?.success_title_3 : labels?.congratulations}
            </Text>

            <Text style={{fontSize: s(7), fontWeight: '400', color: '#222222', alignSelf: 'center', textAlign: 'center'}}>
                {stars?.length == 0 ? labels?.success_desc_0 : stars?.length == 1 ? labels?.success_desc_1 : stars?.length == 2 ? labels?.success_desc_2 : stars?.length == 3 ? labels?.success_desc_3 : labels?.congratulations}
            </Text>
        </View>
    )
}

export default Description;
