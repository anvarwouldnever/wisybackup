import React, { useEffect, useState, useRef } from "react";
import { FlatList, Platform, TouchableOpacity, useWindowDimensions, View, Image } from "react-native";
import store from "../store/store";
import { SvgUri } from "react-native-svg";
import { observer } from "mobx-react-lite";
import api from "../api/api";
import { playSound } from "../hooks/usePlayBase64Audio";

const GameCategories = ({ setActiveCategory, activeCategory, setSubCollections, setText, setWisySpeaking, wisySpeaking }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const gameoptions = store?.categories

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const func = async () => {
            try {
                setWisySpeaking(true);
                const sound = await api.getSpeech('switch_category', store.language);
                if (sound.length > 0) {
                    const randomIndex = Math.floor(Math.random() * sound.length);
                    setText(sound[randomIndex]?.text);
                    await playSound(sound[randomIndex]?.audio);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setWisySpeaking(false)
            }
        };
        
        func();
    }, [activeCategory]);

    const renderItem = ({ item, index }) => {

        const isSvg = item?.image?.url.endsWith(".svg")

        return (
            <TouchableOpacity onPress={() => {
                    setActiveCategory(index);
                    setSubCollections(null)
                }} style={{marginRight: 8, width: Platform.isPad? windowWidth * (128 / 1194) : windowHeight * (64 / 360), alignItems: 'center', justifyContent: 'center', height: Platform.isPad? windowHeight * (128 / 834) : windowHeight * (64 / 360), borderTopLeftRadius: 100, borderTopRightRadius: 100, backgroundColor: activeCategory === index? 'white' : '#F8F8F833'}}>
                {isSvg?
                    <SvgUri width={Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360)} height={Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360)} uri={item?.image?.url} style={{backgroundColor: '#F8F8F833', borderRadius: 100}}/> 
                :
                    <Image source={{ uri: item?.image?.url }} style={{ width: Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360), height: Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360), backgroundColor: '#F8F8F833', borderRadius: 100 }}/>
                }
            </TouchableOpacity>
        )
    }

    return (
        <View style={{width: 'auto', height: windowHeight * (64 / 360), position: 'absolute', bottom: 5, left: windowWidth * (320 / 800), height: 'auto'}}>
            <FlatList
                data={gameoptions}
                key={store.categories}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default observer(GameCategories);