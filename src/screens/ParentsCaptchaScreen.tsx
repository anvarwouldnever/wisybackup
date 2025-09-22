import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, View, Text, Image, Platform } from "react-native";
import ParentsCancel from "./Parents/ParentsCancel";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from 'expo-screen-orientation';
import translations from "../../localization";
import store from "../store/store";
import { observer } from "mobx-react-lite";
import Pad from "./ParentsCaptcha/Pad";
import { useScale } from "../hooks/useScale";
import Inputs from "./ParentsCaptcha/Inputs";
import NumbersText from "./ParentsCaptcha/NumbersText";

const ParentsCaptchaScreen = () => {

    const { s, vs } = useScale()

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
            changeScreenOrientation();
        }, [])
    );

    useEffect(() => {
        setAnswer([])
        setError(false)
    }, [])
    
    const [answer, setAnswer] = useState<number[]>([]);
    const [error, setError] = useState(false)


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', flexDirection: 'column', paddingTop: Platform.OS === 'android' ? 40 : 0 }}>
            
            <ParentsCancel />
            
            <Image source={require('../images/Rotate.png')} style={{ marginVertical: vs(15), width: s(244), height: vs(244), aspectRatio: 1}} />
            
            <View style={{justifyContent: 'space-evenly', alignItems: 'center', width: s(312), height: vs(166) }}>
                
                <Text style={{ fontWeight: '600', marginBottom: vs(15), fontSize: vs(24), lineHeight: vs(24), textAlign: 'center' }}>{translations[store.language]?.enterTheCode ?? "Enter the code"}</Text>
                
                <NumbersText answer={answer} setError={setError} />

                <Inputs error={error} answer={answer} />
                
            </View>
            
            <Pad onPress={(item: any) => {if (item === 'del') {setAnswer(prev => prev.slice(0, prev.length - 1))} else if (typeof item === 'number') {setAnswer(prev => prev.length < 4 ? [...prev, item] : prev)}}}/>

        </SafeAreaView>
    );
};

export default observer(ParentsCaptchaScreen);
