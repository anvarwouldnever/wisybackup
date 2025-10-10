import React from "react";
import { View, TouchableOpacity, Image, Text, useWindowDimensions, Platform } from "react-native";
import arrow from '../../images/arrow-left.png';
import store from "../../store/store";
import { observer } from "mobx-react-lite";
import { gameStore } from "../Games/store/gameStore";
import { useScale } from "../../hooks/useScale";

const HeaderCollection = () => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        const { s, vs } = useScale()

        const func = async() => {
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
            <View style={{flexDirection: 'row', alignItems: 'center', width: 'auto', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={store.isFirstOpening ? () => {return} : () => 
                    func()
                } style={{width: Platform.isPad? windowWidth * (72 / 1194) : windowHeight * (40 / 360), height: Platform.isPad? windowWidth * (72 / 1194) : windowHeight * (40 / 360), backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={arrow} style={{width: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360), height: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360),}}/>
                </TouchableOpacity>
                <Text style={{fontWeight: '600', color: 'white', marginLeft: 20, fontSize: Platform.isPad? windowWidth * (20 / 800) : windowWidth * (20 / 800), textAlign: 'center', textAlignVertical: 'center', alignSelf: 'center'}}>
                    {gameStore.collectionName}
                </Text>
            </View>
        )
    }

export default observer(HeaderCollection);