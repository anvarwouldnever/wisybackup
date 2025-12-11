import { View } from 'react-native'
import React, { useEffect } from 'react'
import { gameStore } from '../screens/Games/store/gameStore'
import { observer } from 'mobx-react-lite'

const Counter = () => {

    useEffect(() => {
        gameStore.startTimer()
    }, [gameStore.timer]);

    return (
        <View style={{ position: 'absolute', width: 0, height: 0 }} />
    )
}

export default observer(Counter)