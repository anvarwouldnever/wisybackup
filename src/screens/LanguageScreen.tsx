import { View, Text, SafeAreaView } from 'react-native'
import React, { useState, useCallback } from 'react'
import Logo from '../components/Logo';
import { observer } from 'mobx-react-lite';
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from 'expo-screen-orientation';
import Button from './Language/Button';
import Languages from './Language/Languages';
import { useScale } from '../hooks/useScale';

const LanguageScreen = () => {

    const [chosenLang, setChosenLang] = useState(null);

    const { s, vs } = useScale()

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            }
            changeScreenOrientation();
        }, [])
    );

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            
            <Logo />
            
            <View style={{ width: s(312), height: vs(618), alignSelf: 'center', marginTop: 30, justifyContent: 'space-between'}}>
                
                <Text style={{fontWeight: '400', fontSize: vs(14), textAlign: 'center', color: "#555555", width: s(312), height: vs(24), alignSelf: 'center', justifyContent: 'center'}}>Select language to proceed</Text>
                
                <Languages setChosenLang={setChosenLang} chosenLang={chosenLang} />
                
                <Button chosenLang={chosenLang} />

            </View>

        </SafeAreaView>
    )
}

export default observer(LanguageScreen);