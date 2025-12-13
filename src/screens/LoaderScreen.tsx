import React, { useState } from "react";
import { Text, Platform, View } from "react-native";
import Logo from "../components/Logo";
import Loader from "./Loader/Loader";
import { useScale } from "../hooks/utils/useScale";
import Button from "./Loader/Button";
import translations from "../../localization";
import store from "../store/store";
import { SafeAreaView } from "react-native-safe-area-context";

const LoaderScreen = () => {

    const [text, setText] = useState('Finding activities that matches your child’s skills!')
    const [isFrozen, setIsFrozen] = useState<boolean>(false)

    const { s, vs } = useScale()

    if (isFrozen) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
            
            <Logo />
            
            <Loader setText={setText} />

            <Text style={{width: s(312), height: vs(56), color: '#222222', fontWeight: '600', fontSize: Platform.isPad? vs(15) : vs(20), textAlign: 'center', lineHeight: vs(28), position: 'absolute', top: vs(500)}}>{text}</Text>
            
            {text === translations?.[store.language]?.weHaveMatched && <Button setIsFrozen={setIsFrozen} />}

        </SafeAreaView>
    )
}

export default LoaderScreen;