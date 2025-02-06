import settings from '../images/settings.png';
import settingsActive from '../images/settingsActive.png';
import chat from '../images/chat.png';
import brain from '../images/brain.png';
import brainActive from '../images/brainActive.png';
import React, { useState } from "react";
import { View, TouchableOpacity, Image, useWindowDimensions, Text, FlatList } from "react-native";
import skills from '../images/skills.png';
import skillsActive from '../images/skillsActive.png';
import heart from '../images/heart.png';
import heartActive from '../images/heartActive.png';
import { useNavigation } from "@react-navigation/native";
import store from "../store/store";
import { Svg, Path } from "react-native-svg";

const BottomTabs = ({ screen, setScreen }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    const fetchSvg = async (uri: string) => {
        try {
            const response = await fetch(uri);
    
            if (!response.ok) {
                throw new Error(`Ошибка загрузки SVG: ${response.status} ${response.statusText}`);
            }
    
            const svg = await response.text();
    
            const pathRegex = /<path[^>]*d="([^"]*)"[^>]*>/g;
    
            const svgParamsRegex = /<svg[^>]*\s(width|height|viewBox|fill)="([^"]*)"/g;
    
            const paths: { d: string; [key: string]: string }[] = [];
            let pathMatch;
            while ((pathMatch = pathRegex.exec(svg)) !== null) {
                const pathAttributes = {};
                const attributeRegex = /(\w+)="([^"]*)"/g;
                let attrMatch;
                while ((attrMatch = attributeRegex.exec(pathMatch[0])) !== null) {
                    pathAttributes[attrMatch[1]] = attrMatch[2];
                }
                paths.push(pathAttributes);
            }
    
            const svgParams: { [key: string]: string } = {};
            let match;
            while ((match = svgParamsRegex.exec(svg)) !== null) {
                svgParams[match[1]] = match[2];
            }
    
            return { paths, svgParams };
        } catch (error) {
            console.error('Ошибка загрузки SVG:', error);
            return null;
        }
    };
    

    const attributes = store.attributes

    const renderItem = ({ item }) => {

        let isSvg = item.image.endsWith('.svg');
        const svg = item?.svgData

        return (
            <TouchableOpacity activeOpacity={1} onPress={() => setScreen(item)} style={{width: windowWidth * (40 / 360), height: windowHeight * (40 / 800), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: screen.name === item.name? "#504297" : ""}}>
                {isSvg && svg ? (
                    <Svg
                        style={{
                            aspectRatio: 1
                        }}
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        fill={'none'}
                    >
                        {svg.paths.map((path, index) => (
                        <Path
                            key={index}
                            d={path.d}
                            stroke={screen.name === item.name? "white" : "#504297"}
                            strokeWidth={2}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                        />
                    ))}
                    </Svg>
                ) : (
                    <Image
                        source={{ uri: item.image }} // Условный выбор изображения
                        style={{
                            width: windowWidth * (24 / 360),
                            height: windowHeight * (24 / 800),
                            aspectRatio: 1,
                        }}
                    />
                )}
                {/* <Image source={screen === item.name? brainActive : brain} style={{width: windowWidth * (40 / 360), height: windowHeight * (40 / 800), aspectRatio: 40 / 40}}/> */}
            </TouchableOpacity>
        )
    }

    return (
        <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{width: 'auto', height: windowHeight * (56 / 800), justifyContent: 'space-between', padding: 8, alignItems: 'center', flexDirection: 'row', backgroundColor: '#F8F8F8', borderRadius: 100, gap: 10}}>
                <FlatList 
                    data={attributes}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    horizontal
                />
                <TouchableOpacity activeOpacity={1} onPress={() => setScreen('Settings')} style={{width: windowWidth * (40 / 360), height: windowHeight * (40 / 800)}}>
                    <Image source={screen === 'Settings'? settingsActive : settings} style={{width: windowWidth * (40 / 360), height: windowHeight * (40 / 800), aspectRatio: 40 / 40}}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={{width: windowWidth * (112 / 360), height: windowHeight * (56 / 800), gap: windowHeight * (8 / 800), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 100}}>
                <Image source={chat} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                <Text style={{fontWeight: '600', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (24 / 800), color: '#504297'}}>Chat</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BottomTabs;