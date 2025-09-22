import React, { useState } from "react";
import { View, SafeAreaView, ActivityIndicator } from "react-native";
import Logo from "../components/Logo";
import SlideShow from "./Welcome/SlideShow";
import { observer } from "mobx-react-lite";
import Buttons from "./Welcome/Buttons";
import Dots from "./Welcome/Dots";
import { useScale } from "../hooks/useScale";
import useLockPortrait from "../hooks/useLockPortrait";
import { getOnboardings } from "./Welcome/hooks/getSlides";

const WelcomeScreen = () => {

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    const { s, vs } = useScale();
    const { onboardings, loading, error } = getOnboardings()

    useLockPortrait()

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, justifyContent: 'space-between' }}>
            
            <Logo />
            
            <View style={{ height: vs(402), justifyContent: 'center' }}>
                {loading? 
                    <ActivityIndicator size={'large'} color={'purple'}/> 
                : 
                    <SlideShow onboardings={onboardings} onPageChange={setCurrentIndex}/>
                }
            </View>

            <Dots onboardings={onboardings} currentIndex={currentIndex} />

            <Buttons />

        </SafeAreaView>
    )
}

export default observer(WelcomeScreen);