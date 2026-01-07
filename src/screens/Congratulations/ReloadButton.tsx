import { TouchableOpacity } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'
import Ionicons from '@expo/vector-icons/Ionicons'
import store from '../../store/store'
import { gameStore } from '../Games/store/gameStore'

const ReloadButton = ({ replay }) => {

    const { s, vs } = useScale()

    const onPress = () => {
        if (store.isFirstOpening || gameStore.loadingGames) return
        replay()
    }

    return (
        <TouchableOpacity onPress={() => onPress()} style={{width: s(19), height: '100%', backgroundColor: '#B3ABDB', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name='reload-sharp' color={'white'} size={s(8)} />
        </TouchableOpacity>
    )
}

export default ReloadButton