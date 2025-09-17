import { TouchableOpacity } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/useScale'
import Ionicons from '@expo/vector-icons/Ionicons'

const ReloadButton = ({ replay }) => {

    const { s, vs } = useScale()

    return (
        <TouchableOpacity onPress={() => replay()} style={{width: vs(80), height: '100%', backgroundColor: '#B3ABDB', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name='reload-sharp' color={'white'} size={vs(28)} />
        </TouchableOpacity>
    )
}

export default ReloadButton