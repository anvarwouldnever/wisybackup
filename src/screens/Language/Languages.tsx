import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/useScale';

const Languages = ({ setChosenLang, chosenLang }) => {

    const { s, vs } = useScale()

    const langs = [
        { name: "English", tag: "en" },
        { name: "Latvian", tag: "lv" }
    ];

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => setChosenLang(item)} style={{borderWidth: 1, opacity: chosenLang === null? 1 : chosenLang.name === item.name? 1 : 0.5, borderColor: chosenLang === null? '#E5E5E5' : chosenLang.name === item.name? '#22222' : '#E5E5E5', width: s(312), height: vs(56), alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 100}}>
                <Text style={{fontSize: vs(14), color: '#222222', fontWeight: '600'}}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{width: s(312), height: vs(490), alignSelf: 'center', alignItems: 'center'}}>
            <FlatList 
                data={langs}
                renderItem={renderItem}
                scrollEnabled={false}
                contentContainerStyle={{alignSelf: 'center', gap: vs(12)}}
            />
        </View>
    )
}

export default Languages