import React, { useState, useCallback } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import Logo from "../components/Logo";
import AuthLogin from "./Auth/AuthLogin";
import AuthSignup from "./Auth/AuthSignup";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeAreaView } from "react-native-safe-area-context";
import { useScale } from "../hooks/utils/useScale";

const AuthScreen = ({ route }) => {

    const [authOption, setAuthOption] = useState(route?.params?.authOption === undefined? 'signup' : route.params.authOption)
    const navigation = useNavigation()

    const { s, vs } = useScale()

    const proceed = (email) => {
        navigation.navigate('EmailConfirmScreen', { email: email })
    }

    const playersScreen = (players) => {
        navigation.navigate('ChoosePlayerScreen')
    }

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
            changeScreenOrientation();
        }, [])
    );

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            
            <SafeAreaView style={{flex: 1, alignItems: 'center', paddingHorizontal: vs(20)}}>
                
                <Logo />
                
                {authOption === 'signup'? 
                    <AuthSignup proceed={proceed} toggleOption={setAuthOption}/> 
                : 
                    <AuthLogin playersScreen={playersScreen} toggleOption={setAuthOption}/>
                }    

            </SafeAreaView>
            
        </TouchableWithoutFeedback>
    )
}

export default AuthScreen;