import React, { useEffect, useRef, useCallback } from "react";
import { FlatList, View } from "react-native";
import { observer } from "mobx-react-lite";
import { playSound } from "../../hooks/usePlaySound";
import { useFocusEffect } from "@react-navigation/native";
import { gameStore } from "../Games/store/gameStore";
import store from "../../store/store";
import { GetSpeeches } from "../../api/methods/speeches/speech";
import { useScale } from "../../hooks/utils/useScale";
import { getCategories } from "./Categories/hooks/getCategories";
import CategoryItem from "./Categories/CategoryItem";

const Categories = () => {

    const gameoptions = gameStore?.categories;

    const { s, vs } = useScale()

    getCategories()

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
            const firstCategory = gameoptions?.[0];
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

    const onPress = (item) => {
        if(store.isFirstOpening) return; 
        getCollection(item?.id)
    }

    return (
        <View style={{ width: '62%', position: 'absolute', bottom: 5, right: 0 }}>
            {store.isFirstOpening && null}
            <FlatList
                data={gameoptions?.slice()}
                key={gameStore?.categories}
                renderItem={({ item, index }) => <CategoryItem index={index} item={item} onPress={onPress} />}
                keyExtractor={(item) => item?.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ columnGap: vs(10) }}
            />
        </View>
    )
}

export default observer(Categories);