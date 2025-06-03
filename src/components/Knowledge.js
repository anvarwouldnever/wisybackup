import React, { useEffect, useState } from "react";
import { View, FlatList, useWindowDimensions, TouchableOpacity, Text, Image } from "react-native";
import language from '../images/Language.png';
import naturalscience from '../images/Natural-sciences 1.png';
import numbers from '../images/Numbers.png';
import narrowright from '../images/narrowright.png';
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";

const Knowledge = ({ screen }) => {
    const color = screen?.color ?? 'white'
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    const renderItem = React.useCallback(({ item }) => {
        const isSvg = item.image.endsWith(".svg");

        return (
            <TouchableOpacity onPress={() => navigation.navigate('ParentsSegments', { screen: item })} style={{
                width: windowWidth * (312 / 360),
                height: windowHeight * (76 / 800),
                borderRadius: 10,
                padding: windowWidth * (16 / 360),
                backgroundColor: '#F8F8F8',
                flexDirection: 'row',
                gap: windowWidth * (16 / 360),
                alignItems: 'center'
            }}>
                <View style={{ backgroundColor: `${color}`, borderRadius: 10 }}>
                    {isSvg ? (
                        <SvgUri
                            uri={item.image}
                            width={windowHeight * (48 / 800)}
                            height={windowHeight * (48 / 800)}
                            stroke={`${color}`}
                        />
                    ) : (
                        <Image
                            source={item.image}
                            style={{
                                width: windowHeight * (48 / 800),
                                height: windowHeight * (48 / 800),
                                aspectRatio: 1,
                                borderRadius: 10
                            }}
                        />
                    )}
                </View>
                <View style={{ width: windowWidth * (184 / 360), height: windowHeight * (44 / 800), flexDirection: 'column', justifyContent: 'center' }}>
                    <Text style={{ color: '#222222', fontWeight: '600', lineHeight: windowHeight * (20 / 800), fontSize: windowHeight * (14 / 800) }}>
                        {item.name}
                    </Text>
                </View>
                <View style={{ width: windowWidth * (24 / 360), justifyContent: 'center', alignItems: 'center', height: windowHeight * (24 / 800) }}>
                    <Image source={narrowright} style={{ width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), aspectRatio: 24 / 24 }} />
                </View>
            </TouchableOpacity>
        );
    }, [windowWidth, windowHeight, color, navigation]); // Мемоизируем renderItem для оптимизации

    return (
        <FlatList
            data={screen?.attributes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 16 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
        />
    );
};

export default Knowledge;
