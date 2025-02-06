import React, { useState } from "react";
import { FlatList, Platform, TouchableOpacity, useWindowDimensions, View, Image } from "react-native";
import store from "../store/store";
import { SvgUri } from "react-native-svg";
import { observer } from "mobx-react-lite";

const GameCategories = ({ setActiveCategory, activeCategory, setSubCollections }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const gameoptions = store?.categories

    // windowWidth * (104 / 1194)
    // windowHeight * (104 / 834)

    const renderItem = ({ item, index }) => {

        // console.log(item.image?.url)

        const isSvg = item?.image?.url.endsWith(".svg")

        return (
            <TouchableOpacity onPress={() => {
                    setActiveCategory(index);
                    setSubCollections(null)
                }} style={{marginRight: 8, width: Platform.isPad? windowWidth * (128 / 1194) : windowWidth * (64 / 800), alignItems: 'center', justifyContent: 'center', height: Platform.isPad? windowHeight * (128 / 834) : windowHeight * (64 / 360), borderTopLeftRadius: 100, borderTopRightRadius: 100, backgroundColor: activeCategory === index? 'white' : '#F8F8F833'}}>
                {isSvg?
                    <SvgUri width={Platform.isPad? windowWidth * (96 / 1194) : windowWidth * (48 / 800)} height={Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360)} uri={item?.image?.url} style={{backgroundColor: '#F8F8F833', borderRadius: 100}}/> 
                :
                    <Image source={{ uri: item?.image?.url }} style={{ width: Platform.isPad? windowWidth * (96 / 1194) : windowWidth * (48 / 800), height: Platform.isPad? windowWidth * (96 / 1194) : windowHeight * (48 / 360), backgroundColor: '#F8F8F833', borderRadius: 100 }}/>
                }
            </TouchableOpacity>
        )
    }

    return (
        <View style={{width: windowWidth * (470 / 800), height: windowHeight * (64 / 360), position: 'absolute', bottom: 5, left: windowWidth * (320 / 800), height: 'auto'}}>
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