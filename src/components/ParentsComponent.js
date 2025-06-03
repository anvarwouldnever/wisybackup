import React from "react";
import { View, Text, ScrollView, useWindowDimensions, ActivityIndicator } from "react-native";
import Knowledge from "./Knowledge";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import GetToKnowYourChild from "./ParentComponent/GetToKnowYourChild";
import store from "../store/store";
import { observer } from "mobx-react-lite";

const ParentsComponents = ({ screen, loading, error }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <View style={{width: windowWidth * (312 / 360), height: windowHeight * (502 / 800), justifyContent: 'space-between', gap: windowHeight * (13 / 800)}}>
            <Text style={{fontSize: windowHeight * (16 / 800), fontWeight: '600', height: windowHeight * (24 / 800)}}>{screen?.name}</Text>
            {screen != 'Settings' && <GetToKnowYourChild />}
            <ScrollView contentContainerStyle={{justifyContent: loading? 'center' : 'space-between', gap: windowWidth * (16 / 360), height: loading? windowHeight * (300 / 800) : 'auto'}} showsVerticalScrollIndicator={false}>
                {error != ''? <Text style={{fontSize: windowHeight * (18 / 800), width: windowWidth * (312 / 360), position: 'absolute', alignSelf: 'center', color: 'purple', textAlign: 'center'}}>{error}</Text> : loading? <ActivityIndicator size={'large'} color={'purple'} style={{position: 'absolute', alignSelf: 'center'}}/> : <Animated.View key={screen?.name} entering={FadeInDown.duration(400)} style={{width: windowWidth * (312 / 360), height: 'auto'}}>
                    <Knowledge screen={screen}/>
                </Animated.View>}
            </ScrollView>
        </View>
    )
}

export default observer(ParentsComponents);