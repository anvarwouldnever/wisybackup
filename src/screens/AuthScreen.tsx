import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import Logo from "../components/Logo";
import AuthLogin from "./Auth/AuthLogin";
import AuthSignup from "./Auth/AuthSignup";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from 'expo-screen-orientation';
import { SafeAreaView } from "react-native-safe-area-context";
import { useScale } from "../hooks/utils/useScale";
import useLockPortrait from "../hooks/utils/useLockPortrait";
import { getLabels } from "./Welcome/hooks/getLabels";
import { getSettings } from "./CreateChild/hooks/getSignUpSettings";

const AuthScreen = ({ route }) => {

    const [authOption, setAuthOption] = useState(route?.params?.authOption === undefined? 'signup' : route?.params?.authOption);
    const [isFrozen, setIsFrozen] = useState<boolean>(false);
    const navigation = useNavigation();

    const { s, vs } = useScale();

    const proceed = (email) => {
        navigation.navigate('EmailConfirmScreen', { email: email })
    }

    const playersScreen = async() => {
        Keyboard.dismiss()
        setIsFrozen(true)

        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        setTimeout(() => {
            navigation.navigate('ChoosePlayerScreen')
        }, 150);
    }

    const { settings } = getSettings()
    const { labels } = getLabels()

    useLockPortrait()

    if (isFrozen) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
        )
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            
            <SafeAreaView style={{flex: 1, alignItems: 'center', paddingHorizontal: vs(20)}}>
                
                <Logo />
                
                {authOption === 'signup'? 
                    <AuthSignup labels={labels} proceed={proceed} toggleOption={setAuthOption}/> 
                : 
                    <AuthLogin labels={labels} playersScreen={playersScreen} toggleOption={setAuthOption}/>
                }    

            </SafeAreaView>
            
        </TouchableWithoutFeedback>
    )
}

export default AuthScreen;