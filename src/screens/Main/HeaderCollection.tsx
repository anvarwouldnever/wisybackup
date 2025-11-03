import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import store from "../../store/store";
import { observer } from "mobx-react-lite";
import { gameStore } from "../Games/store/gameStore";
import { useScale } from "../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";

const HeaderCollection = () => {

    const { s, vs } = useScale()

    const func = async() => {
        if (store.isFirstOpening) return
        gameStore.resetSubCollection()
        if (store.wisySpeaking) return
        // try {
        //     playSound.stop()
        //     store.setWisySpeaking(true)
        //     const response = await api.getSpeech('enter_collections_screen', store.language)
        //     store.setWisyMenuText(response[0]?.text)
        //     await playSound(response[0]?.audio)
        // } catch (error) {
        //     console.log(error)
        // } finally {
        //     store.setWisySpeaking(false)
        // }
    }

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', width: 'auto', justifyContent: 'center', columnGap: s(6)}}>
            
            <TouchableOpacity onPress={() => func()} style={{width: s(20), height: s(20), backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                
                <Ionicons name='arrow-back' size={s(10)} color={'#504297'} />
            
            </TouchableOpacity>
            
            <Text style={{fontWeight: '600', color: 'white', fontSize: s(10), textAlign: 'center', textAlignVertical: 'center', alignSelf: 'center'}}>
                
                {gameStore?.collectionName}

            </Text>

        </View>
    )
}

export default observer(HeaderCollection);