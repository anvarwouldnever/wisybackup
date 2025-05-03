import React, { useEffect, useState, useRef, useCallback } from "react";
import { FlatList, Platform, TouchableOpacity, useWindowDimensions, View, Image, Dimensions } from "react-native";
import store from "../store/store";
import { SvgUri } from "react-native-svg";
import { observer } from "mobx-react-lite";
import api from "../api/api";
import { playSound } from "../hooks/usePlayBase64Audio";
import { useFocusEffect } from "@react-navigation/native";

const GameCategories = ({ setActiveCategory, activeCategory, setSubCollections }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const gameoptions = store?.categories

    const isFirstRender = useRef(true);
    const isInitialCategorySet = useRef(false);

    const getCollection = async(id) => {
        setActiveCategory(id);
        store.resetSubCollection()
        try {
            if (gameoptions.find(cat => cat.id === id)?.collections.length > 0) return
            await store.enqueueGetCollection({
                categoryId: id
            });            
        } catch (error) {
            console.log(error)
        }
    }

    // useEffect(() => {
    //     const firstCategory = gameoptions[0];
    //     if (firstCategory?.collections?.length === 0) {
    //         console.log('ran automatically get collections')
    //         setActiveCategory(gameoptions[0]?.id);
    //         getCollection(gameoptions[0]?.id);
    //     }
    // }, [gameoptions]);

    useFocusEffect(
        useCallback(() => {
            const firstCategory = gameoptions[0];
            if (firstCategory?.collections?.length === 0) {
                console.log('ran automatically get collections')
                setActiveCategory(gameoptions[0]?.id);
                getCollection(gameoptions[0]?.id);
            }
        }, [gameoptions])
    )
    
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const func = async () => {
            try {
                await playSound.stop()
                const sound = await api.getSpeech('switch_category', store.language);
                if (sound.length > 0) {
                    store.setWisySpeaking(true);
                    const randomIndex = Math.floor(Math.random() * sound.length);
                    store.setWisyMenuText(sound[randomIndex]?.text);
                    await playSound(sound[randomIndex]?.audio);
                }
            } catch (error) {
                console.log(error);
            } finally {
                store.setWisySpeaking(false)
            }
        };

        if (!store.loadingCats && !store.wisySpeaking) {
            func();
        }
    }, [activeCategory]);

    const renderItem = ({ item }) => {

        const isSvg = item?.image?.url.endsWith(".svg")

        return (
            <TouchableOpacity onPress={() => getCollection(item.id)} style={{marginRight: 8, width: Platform.isPad? windowWidth * (128 / 1194) : windowHeight * (64 / 360), alignItems: 'center', justifyContent: 'center', height: Platform.isPad? windowHeight * (128 / 834) : windowHeight * (64 / 360), borderTopLeftRadius: 100, borderTopRightRadius: 100, backgroundColor: activeCategory === item.id? 'white' : '#F8F8F833'}}>
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