import { StyleSheet, Text, View, Image, TouchableOpacity, useWindowDimensions } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import translations from '../../../localization';
import store from '../../store/store';
import winkingWisy from '../../images/Winking.png';
import { observer } from 'mobx-react-lite';

const GetToKnowYourChild = () => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    return (
        <View style={{backgroundColor: '#C4DF84', flexDirection: 'row', gap: windowWidth * (16 / 360), padding: windowHeight * (16 / 800), alignSelf: 'center', borderRadius: 12, width: windowWidth * (312 / 360), height: windowHeight * (152 / 800)}}>
            <Image source={winkingWisy} style={{width: windowHeight * (40 / 800), height: windowHeight * (40 / 800), aspectRatio: 40 / 40}}/>
            <View style={{width: windowWidth * (224 / 360), height: windowHeight * (120 / 800), justifyContent: 'space-between'}}>
                <View style={{width: windowWidth * (224 / 360), height: windowHeight * (64 / 800), alignSelf: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: '600', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (20 / 800), height: windowHeight * (20 / 800)}}>{translations?.[store.language].getToKnowYourChild}</Text>
                    <Text style={{fontWeight: '600', color: '#555555', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800), height: windowHeight * (40 / 800)}}>{translations?.[store.language].tenInsights}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("ChatScreen")} style={{width: windowWidth * (96 / 360), height: windowHeight * (40 / 800), justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 100}}>
                    <Text style={{color: '#504297', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>{translations?.[store.language]?.openChat}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default observer(GetToKnowYourChild);