import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import translations from '../../../localization'
import Timer from './Timer'
import store from '../../store/store'
import { useScale } from '../../hooks/useScale'
import { observer } from 'mobx-react-lite'
import { gameStore } from '../Games/store/gameStore'

const TextTimer = ({ complete }) => {

    const { s, vs } = useScale()

    return (
        <TouchableOpacity disabled={gameStore.loadingGames} onPress={() => complete()} style={{width: '75%', height: '100%', backgroundColor: '#504297', borderRadius: 100, alignSelf: 'center', paddingHorizontal: vs(28), flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: s(6), fontWeight: '600', color: 'white', alignSelf: 'center'}}>{translations?.[store.language]?.continue}</Text>
            { gameStore.loadingGames ?
                <ActivityIndicator size={'small'} color={'white'} />
            :
                <Timer />
            }
        </TouchableOpacity>
    )
}

export default observer(TextTimer)