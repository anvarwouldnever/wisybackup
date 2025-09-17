import React, { useState, useCallback, useEffect} from "react";
import { View, SafeAreaView, ActivityIndicator } from "react-native";
import Logo from "../components/Logo";
import SlideShow from "./Welcome/SlideShow";
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import store from "../store/store";
import { observer } from "mobx-react-lite";
import Buttons from "./Welcome/Buttons";
import Dots from "./Welcome/Dots";
import { useScale } from "../hooks/useScale";

const WelcomeScreen = () => {

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const { s, vs } = useScale();

    useEffect(() => {
        
        const getSLides = async() => {
            try {
                setLoading(true)
                await store.loadSlides()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        getSLides()

    }, []);

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
            changeScreenOrientation();
        }, [])
    );

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, justifyContent: 'space-between' }}>
            
            <Logo />
            
            <View style={{ height: vs(402), justifyContent: 'center' }}>
                {loading? 
                    <ActivityIndicator size={'large'} color={'purple'}/> 
                : 
                    <SlideShow onPageChange={setCurrentIndex}/>
                }
            </View>

            <Dots currentIndex={currentIndex} />

            <Buttons />

        </SafeAreaView>
    )
}

export default observer(WelcomeScreen);