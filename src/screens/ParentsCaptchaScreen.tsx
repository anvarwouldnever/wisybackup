import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import ParentsCancel from "./Parents/ParentsCancel";
import translations from "../../localization";
import store from "../store/store";
import { observer } from "mobx-react-lite";
import Pad from "./ParentsCaptcha/Pad";
import { useScale } from "../hooks/useScale";
import Inputs from "./ParentsCaptcha/Inputs";
import NumbersText from "./ParentsCaptcha/NumbersText";
import { SafeAreaView } from "react-native-safe-area-context";
import useLockPortrait from "../hooks/useLockPortrait";

const ParentsCaptchaScreen = () => {

    const { s, vs } = useScale()

    useLockPortrait()

    useEffect(() => {
        setAnswer([])
        setError(false)
    }, [])
    
    const [answer, setAnswer] = useState<number[]>([]);
    const [error, setError] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', flexDirection: 'column', paddingHorizontal: vs(20), rowGap: vs(20) }}>
            
            <ParentsCancel />
            
            <Image source={require('../images/Rotate.png')} style={{ width: vs(244), height: vs(244)}} />
            
            <View style={{ alignItems: 'center', width: '100%', height: 'auto', rowGap: vs(18) }}>
                
                <Text style={{ fontWeight: '600', marginBottom: vs(14), fontSize: vs(24), textAlign: 'center'}}>{translations[store.language]?.enterTheCode ?? "Enter the code"}</Text>
                
                <NumbersText answer={answer} setError={setError} />

                <Inputs error={error} answer={answer} />
                
            </View>
            
            <Pad onPress={(item: any) => {if (item === 'del') {setAnswer(prev => prev.slice(0, prev.length - 1))} else if (typeof item === 'number') {setAnswer(prev => prev.length < 4 ? [...prev, item] : prev)}}}/>

        </SafeAreaView>
    );
};

export default observer(ParentsCaptchaScreen);
