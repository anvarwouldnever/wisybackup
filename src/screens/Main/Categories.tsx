import React, { useEffect, useRef, useCallback } from "react";
import { FlatList, Platform, TouchableOpacity, useWindowDimensions, View, Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { observer } from "mobx-react-lite";
import api from "../../api/api";
import { playSound } from "../../hooks/usePlayBase64Audio";
import { useFocusEffect } from "@react-navigation/native";
import Blur from "./GamesList/SubCollections/BlurView";
import { gameStore } from "../Games/store/gameStore";
import store from "../../store/store";
import { GetSpeeches } from "../../api/methods/speeches/speech";

const Categories = () => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const gameoptions = gameStore?.categories;

    const isFirstRender = useRef(true);

    const func = async () => {
            
        if (gameStore.loadingCats) return
        if (store.isFirstOpening) return
        if (store.wisySpeaking) return

        store.setWisySpeaking(true);

        try {
            await playSound.stop()

            const response = await GetSpeeches('switch_category');
            if (response.data?.data?.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data?.data?.length);
                store.setWisyMenuText(response.data?.data[randomIndex]?.text);
                await playSound(response.data?.data[randomIndex]?.audio);
            }
        } catch (error) {
            console.log(error);
        } finally {
            store.setWisySpeaking(false);
        }
    };

    const getCollection = async(id) => {
        func()
        gameStore.setCategoryId(id);
        gameStore.resetSubCollection()
        try {
            if (gameoptions.find(cat => cat.id === id)?.collections.length > 0) return
            await gameStore.enqueueGetCollection({
                categoryId: id
            });            
        } catch (error) {
            console.log(error)
        }
    };

    useFocusEffect(
        useCallback(() => {
            const firstCategory = gameoptions[0];
            if (firstCategory?.collections?.length === 0) {
                gameStore.setCategoryId(firstCategory?.id);
                getCollection(firstCategory?.id);
            }
        }, [gameoptions])
    );    
    
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
    }, [gameStore.categoryId]);

    const renderItem = ({ item, index }) => {

        const isSvg = item?.image?.url.endsWith(".svg")

        return (
            <TouchableOpacity onPress={store.isFirstOpening ? () => {} : () => getCollection(item.id)} style={{marginRight: 8, width: Platform.isPad? windowWidth * (128 / 1194) : windowHeight * (64 / 360), alignItems: 'center', justifyContent: 'center', height: Platform.isPad? windowHeight * (128 / 834) : windowHeight * (64 / 360), borderTopLeftRadius: 100, borderTopRightRadius: 100, backgroundColor: gameStore.categoryId === item.id? 'white' : '#F8F8F833', overflow: 'hidden'}}>
                {isSvg?
                    <SvgUri width={Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360)} height={Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360)} uri={item?.image?.url} style={{backgroundColor: '#F8F8F833', borderRadius: 100}}/> 
                :
                    <Image source={{ uri: item?.image?.url }} style={{ width: Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360), height: Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360), backgroundColor: '#F8F8F833', borderRadius: 100 }}/>
                }
                {index != 0 && store.isFirstOpening && <Blur forMarket={true} isLocked={true} />}
            </TouchableOpacity>
        )
    };

    return (
        <View style={{width: 'auto', height: windowHeight * (64 / 360), position: 'absolute', bottom: 5, left: windowWidth * (320 / 800), height: 'auto'}}>
            {store.isFirstOpening && null}
            <FlatList
                data={gameoptions?.slice()}
                key={gameStore?.categories}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default observer(Categories);