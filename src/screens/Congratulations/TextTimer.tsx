import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import Timer from './Timer'
import store from '../../store/store'
import { useScale } from '../../hooks/useScale'

const TextTimer = ({ complete }) => {

    const { s, vs } = useScale()

    return (
        <TouchableOpacity onPress={() => complete()} style={{width: '75%', height: '100%', backgroundColor: '#504297', borderRadius: 100, alignSelf: 'center', paddingHorizontal: vs(28), flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: vs(24), fontWeight: '600', color: 'white', alignSelf: 'center'}}>{translations?.[store.language]?.continue}</Text>
            <Timer />
        </TouchableOpacity>
    )
}

export default TextTimer