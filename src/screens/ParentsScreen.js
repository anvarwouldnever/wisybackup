import React, { useState, useCallback, useEffect } from "react";
import { Text, Image, View, SafeAreaView, useWindowDimensions, TouchableOpacity, Platform, FlatList, ActivityIndicator } from "react-native";
import ParentsCancel from "../components/ParentsCancel";
import ParentsComponents from "../components/ParentsComponent";
import BottomTabs from "../components/BottomTabs";
import ParentsSettings from "../components/ParentsSettings";
import store from "../store/store";
import Child from "../components/Child";
import DropDownModal from "../components/DropDownModal";
import { observer } from "mobx-react-lite";
import LanguageComponent from "../components/LanguageComponent";
import narrowLeft from '../images/narrowLeftBlack.png'
import Animated from "react-native-reanimated";
import translations from "../../localization";

const ParentsScreen = () => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [screen, setScreen] = useState(store?.attributes?.[0] || null);
    const [dropDown, setDropDown] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const func = async () => {
            if (store?.attributes === null) {
                try {
                    setLoading(true);
                    await store.loadAttributes()
                        .then(() => {
                            setScreen(store?.attributes?.[0]);
                            setLoading(false);
                        });
                } catch (error) {
                    setError(error)
                }
            }
        };
    
        func();
    }, []);    

    const handleScreenChange = useCallback((newScreen) => setScreen(newScreen), []);

    useEffect(() => {
        store.loadDataFromStorageChildren();
    }, [])

    const LanguageReturn = () => {
        return (
            <Animated.View style={{width: windowWidth * (312 / 360), height: windowHeight * (28 / 800), alignItems: 'center', flexDirection: 'row', gap: windowWidth * (8 / 360)}}>
                <TouchableOpacity onPress={() => setScreen('Settings')} style={{justifyContent: 'center', alignItems: 'center', width: 'auto', height: 'auto'}}>
                    <Image style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800)}} source={narrowLeft}/>
                </TouchableOpacity>
                <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (20 / 800)}}>{translations?.[store.language]?.language}</Text>
            </Animated.View>
        )
    }

    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', gap: 15, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android'? 40 : 0}}>
            {screen == 'Lang'? '' : <ParentsCancel />}
            {screen == 'Lang'? <LanguageReturn /> : screen !== 'Settings' && !dropDown? <Child setDropDown={setDropDown} dropDown={dropDown}/> : screen === 'Settings'? null : <View style={{width: windowWidth * (312 / 360), padding: windowWidth * (16 / 360), height: windowHeight * (80 / 800)}}/>}
            {screen !== 'Settings' && dropDown && <DropDownModal setDropDown={setDropDown} dropDown={dropDown}/>}
            {screen == 'Settings'?  <ParentsSettings setScreen={setScreen}/> : screen == 'Lang'? <LanguageComponent setScreen={setScreen}/> : <ParentsComponents loading={loading} screen={screen} error={error}/>}
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800)}} />
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), alignItems: 'center', position: 'absolute', bottom: Platform.OS === 'ios'? windowHeight * (40 / 932) : windowHeight * (15 / 932), alignSelf: 'center'}}>
                {!loading && <BottomTabs screen={screen} setScreen={handleScreenChange} />}
            </View>
        </SafeAreaView>
    )
}

export default observer(ParentsScreen);