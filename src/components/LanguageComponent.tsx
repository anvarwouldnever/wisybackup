import { View, Text, useWindowDimensions, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Logo from '../components/Logo';
import { observer } from 'mobx-react-lite';
import translations from '../../localization';
import store from '../store/store';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const LanguageComponent = ({ setScreen }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [chosenLang, setChosenLang] = useState(null);
    const [loading, setLoading] = useState(false); // Состояние для загрузки

    const func = async(tag) => {
        setLoading(true);
        await store.setLanguage(tag);
        setTimeout(() => {
            setLoading(false);
            setScreen('Settings');
        }, 5000);
    };

    const langs = [
        { name: "English", tag: "en" },
        { name: "Latvian", tag: "lv" }
    ];

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity 
                activeOpacity={0.5} 
                onPress={() => setChosenLang(item)} 
                style={{
                    borderWidth: 1, 
                    opacity: chosenLang === null? 1 : chosenLang.name === item.name? 1 : 0.5, 
                    borderColor: chosenLang === null? '#E5E5E5' : chosenLang.name === item.name? '#22222' : '#E5E5E5', 
                    width: windowWidth * (312 / 360), 
                    height: windowHeight * (56 / 800), 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    alignSelf: 'center', 
                    borderRadius: 100
                }}
                disabled={loading} // Блокируем кнопку во время загрузки
            >
                <Text style={{fontSize: windowWidth * (14 / 360), color: '#222222', fontWeight: '600'}}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View entering={SlideInRight} style={{ width: windowWidth * (312 / 360), height: windowHeight * (580 / 800), alignSelf: 'center', marginTop: 20, justifyContent: 'space-between'}}>
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (490 / 800), alignSelf: 'center', alignItems: 'center'}}>
                <FlatList 
                    data={langs}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    contentContainerStyle={{alignSelf: 'center', gap: windowHeight * (12 / 800)}}
                />
            </View>
            {/* Добавляем ActivityIndicator, который виден, когда loading = true */}
            {loading ? (
                <View style={{ position: 'absolute', top: '50%', alignSelf: 'center'}}>
                    <ActivityIndicator size="large" color="#504297" />
                </View>
            ) : (
                <TouchableOpacity 
                    onPress={chosenLang === null? () => {return} : () => func(chosenLang?.tag)} 
                    style={{
                        width: windowWidth * (312 / 360), 
                        height: windowHeight * (56 / 800), 
                        alignSelf: 'center', 
                        borderRadius: 100, 
                        opacity: chosenLang === null? 0.5 : 1, 
                        backgroundColor: '#504297', 
                        justifyContent: 'center', 
                        alignItems: 'center'
                    }}
                    disabled={loading} // Блокируем кнопку во время загрузки
                >
                    <Text style={{fontSize: windowWidth * (14 / 360), color: 'white', fontWeight: '600'}}>{translations?.[chosenLang?.tag]?.save ?? 'Save'}</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

export default LanguageComponent;
