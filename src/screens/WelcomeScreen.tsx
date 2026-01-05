import React from "react";
import { View } from "react-native";
import Logo from "../components/Logo";
import { observer } from "mobx-react-lite";
import Buttons from "./Welcome/Buttons";
import { useScale } from "../hooks/utils/useScale";
import useLockPortrait from "../hooks/utils/useLockPortrait";
import { getOnboardings } from "./Welcome/hooks/getSlides";
import { SafeAreaView } from "react-native-safe-area-context";
import Slides from "./Onboarding/Slides";
import { getLabels } from "./Welcome/hooks/getLabels";

const WelcomeScreen = () => {

    useLockPortrait()

    const { vs } = useScale()

    const { onboardings, loading } = getOnboardings()

    const { labels } = getLabels()
    
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            
            <Logo />

            <View style={{flex: 1, width: '100%', alignItems: 'center', paddingVertical: vs(24), backgroundColor: 'white', height: 'auto', justifyContent: 'space-between'}}>

                <Slides loading={loading} onboardings={onboardings} />

                <Buttons labels={labels} />

            </View>
            
        </SafeAreaView>
    )
}

export default observer(WelcomeScreen);