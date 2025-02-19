import React from "react";
import { View, TouchableOpacity, Image, Text, useWindowDimensions, Platform } from "react-native";
import arrow from '../../images/arrow-left.png';
import api from "../../api/api";
import { playSound } from "../../hooks/usePlayBase64Audio";
import store from "../../store/store";

const HeaderCollection = ({ setSubCollections, name, setText, setWisySpeaking }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        const func = async() => {
            setSubCollections(null);
            try {
                setWisySpeaking(true)
                const response = await api.getSpeech('enter_collections_screen', store.language)
                setText(response[0]?.text)
                await playSound(response[0]?.audio)
            } catch (error) {
                console.log(error)
            } finally {
                setWisySpeaking(false)
            }
        }

        return (
            <View style={{flexDirection: 'row', alignItems: 'center', width: 'auto', justifyContent: 'space-between', position: 'absolute', top: windowHeight * (24 / 360), left: windowWidth * (320 / 800)}}>
                <TouchableOpacity onPress={() => func()} style={{width: Platform.isPad? windowWidth * (72 / 1194) : windowWidth * (40 / 800), height: Platform.isPad? windowWidth * (72 / 1194) : windowHeight * (40 / 360), backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={arrow} style={{width: Platform.isPad? windowWidth * (40 / 1194) : windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360),}}/>
                </TouchableOpacity>
                <Text style={{fontWeight: '600', color: 'white', marginLeft: 20, fontSize: Platform.isPad? windowWidth * (20 / 800) : windowWidth * (20 / 800), textAlign: 'center', textAlignVertical: 'center', alignSelf: 'center'}}>
                    {name}
                </Text>
            </View>
        )
    }

export default HeaderCollection;