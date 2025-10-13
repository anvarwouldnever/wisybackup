import { observer } from "mobx-react-lite";
import React, { useState, useCallback, useEffect } from "react";
import { View, Platform } from "react-native";
import BottomTabs from "./Parents/BottomTabs";
import Child from "./Parents/Child";
import DropDownModal from "./Parents/DropDownModal";
import LanguageComponent from "./Parents/LanguageComponent";
import store from "../store/store";
import LanguageReturn from "./Parents/LanguageReturn";
import ParentsCancel from "./Parents/ParentsCancel";
import ParentsComponent from "./Parents/ParentsComponent";
import ParentsSettings from "./Parents/ParentsSettings";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScale } from "../hooks/useScale";

const ParentsScreen = () => {

    const [screen, setScreen] = useState(store?.attributes?.[0] || null);
    const [dropDown, setDropDown] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { s, vs } = useScale()

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
        <SafeAreaView style={{flex: 1, alignItems: 'center', rowGap: vs(15), paddingHorizontal: vs(20), backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android'? 40 : 0}}>
            
            {screen !== 'Lang' && 
                <ParentsCancel />
            }

            {screen == 'Lang' ? 
                <LanguageReturn setScreen={setScreen} /> 
            : screen !== 'Settings'? 
                <Child setDropDown={setDropDown} dropDown={dropDown}/> 
            : screen === 'Settings' &&
                null
            }
            
            {screen !== 'Settings' && dropDown && 
                <DropDownModal setDropDown={setDropDown} dropDown={dropDown}/>
            }
            
            {screen == 'Settings' ? 
                <ParentsSettings setScreen={setScreen}/> 
            : screen == 'Lang'? 
                <LanguageComponent setScreen={setScreen}/> 
            : 
                <ParentsComponent loading={loading} screen={screen} error={error}/>
            }
            
            <View style={{width: '100%', height: 'auto', alignItems: 'center', position: 'absolute', bottom: vs(35), alignSelf: 'center'}}>
                {!loading && <BottomTabs screen={screen} setScreen={handleScreenChange} />}
            </View>

        </SafeAreaView>
    )
}

export default observer(ParentsScreen);