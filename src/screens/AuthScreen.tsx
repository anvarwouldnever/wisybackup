import React, { useState, useCallback } from "react";
import { Keyboard, SafeAreaView, TouchableWithoutFeedback } from "react-native";
import Logo from "../components/Logo";
import AuthLogin from "./Auth/AuthLogin";
import AuthSignup from "./Auth/AuthSignup";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from 'expo-screen-orientation';

const AuthScreen = ({ route }) => {

    const [authOption, setAuthOption] = useState(route?.params?.authOption === undefined? 'signup' : route.params.authOption)
    const navigation = useNavigation()
    const proceed = () => {
        navigation.navigate('EmailConfirmScreen')
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
            <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
                <Logo />
                {authOption === 'signup'? 
                    <AuthSignup proceed={proceed} toggleOption={setAuthOption}/> 
                : 
                    <AuthLogin playersScreen={playersScreen} proceed={proceed} toggleOption={setAuthOption}/>
                }       
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default AuthScreen;