import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/useScale';

const Languages = ({ setChosenLang, chosenLang }) => {

    const { s, vs, isTablet } = useScale()

    const langs = [
        { name: "English", tag: "en" },
        { name: "Latvian", tag: "lv" }
    ];

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => setChosenLang(item?.tag)} style={{borderWidth: 1, opacity: chosenLang === null? 1 : chosenLang === item?.tag? 1 : 0.5, borderColor: chosenLang === null? '#E5E5E5' : chosenLang === item?.tag? '#22222' : '#E5E5E5', width: '100%', height: vs(56), alignItems: 'center', justifyContent: 'center', borderRadius: 100}}>
                <Text style={{ fontSize: isTablet? vs(16) : vs(14), color: '#222222', fontWeight: '600' }}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ width: '100%', height: 'auto', alignSelf: 'center', alignItems: 'center' }}>
            <FlatList 
                data={langs}
                renderItem={renderItem}
                scrollEnabled={false}
                contentContainerStyle={{alignSelf: 'center', gap: vs(15), width: '100%'}}
                style={{ width: '100%' }}
            />
        </View>
    )
}

export default Languages