import { observer } from "mobx-react-lite";
import React, { useState, useCallback, useEffect } from "react";
import { View, SafeAreaView, useWindowDimensions, Platform } from "react-native";
import BottomTabs from "./Parents/BottomTabs";
import Child from "./Parents/Child";
import DropDownModal from "./Parents/DropDownModal";
import LanguageComponent from "./Parents/LanguageComponent";
import store from "../store/store";
import LanguageReturn from "./Parents/LanguageReturn";
import ParentsCancel from "./Parents/ParentsCancel";
import ParentsComponent from "./Parents/ParentsComponent";
import ParentsSettings from "./Parents/ParentsSettings";

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

    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', gap: 15, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android'? 40 : 0}}>
            
            {screen == 'Lang'? '' : <ParentsCancel />}

            {screen == 'Lang'? <LanguageReturn setScreen={setScreen} /> : screen !== 'Settings' && !dropDown? <Child setDropDown={setDropDown} dropDown={dropDown}/> : screen === 'Settings'? null : <View style={{width: windowWidth * (312 / 360), padding: windowWidth * (16 / 360), height: windowHeight * (80 / 800)}}/>}
            
            {screen !== 'Settings' && dropDown && <DropDownModal setDropDown={setDropDown} dropDown={dropDown}/>}
            
            {screen == 'Settings'?  <ParentsSettings setScreen={setScreen}/> : screen == 'Lang'? <LanguageComponent setScreen={setScreen}/> : <ParentsComponent loading={loading} screen={screen} error={error}/>}
            
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800)}} />
            
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), alignItems: 'center', position: 'absolute', bottom: Platform.OS === 'ios'? windowHeight * (40 / 932) : windowHeight * (15 / 932), alignSelf: 'center'}}>
                {!loading && <BottomTabs screen={screen} setScreen={handleScreenChange} />}
            </View>

        </SafeAreaView>
    )
}

export default observer(ParentsScreen);