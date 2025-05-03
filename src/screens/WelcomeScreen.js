import React, { useState, useCallback, useEffect} from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, useWindowDimensions, ActivityIndicator } from "react-native";
import Logo from "../components/Logo";
import SlideShow from "../components/SlideShow";
import { useNavigation } from "@react-navigation/native";
import * as Linking from 'expo-linking';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import store from "../store/store";
import translations from "../../localization";
import { observer } from "mobx-react-lite";

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();

    useEffect(() => {
        console.log('run getting slides')
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
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
            changeScreenOrientation();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <Logo />
            <View style={styles.slideShowContainer}>
                {loading? 
                    <ActivityIndicator size={'large'} color={'purple'}/> 
                : 
                    <SlideShow onPageChange={setCurrentIndex}/>
                }
            </View>
            <View style={styles.paginationContainer}>
                {store?.slides?.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.paginationDot, {backgroundColor: currentIndex === index ? '#504297' : '#E5E5E5'}]}
                    />
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AuthScreen', {authOption: 'signup'})}
                    style={styles.signUpButton}
                >
                    <Text style={styles.buttonText}>{translations?.[store.language]?.signup}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AuthScreen', {authOption: 'login'})}
                    style={styles.logInButton}
                >
                    <Text style={styles.logInButtonText}>{translations?.[store.language]?.login}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'space-between',
    },
    slideShowContainer: {
        height: height * (402 / 800),
        justifyContent: 'center'
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: 'auto',
        gap: width * (12 / 360),
        height: 12,
    },
    paginationDot: {
        width: 12,
        height: 12,
        borderRadius: 100,
        opacity: 0.9,
    },
    buttonsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: width * 0.8666,
        height: height * 0.155,
        alignSelf: 'center',
        marginBottom: 20
    },
    signUpButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#504297',
        width: width * 0.8666,
        height: height * 0.07,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'black',
    },
    logInButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.8666,
        height: height * 0.07,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: height * (14 / 800),
        color: '#FFFFFF',
    },
    logInButtonText: {
        fontWeight: '600',
        fontSize: height * (14 / 800),
        color: '#504297',
    },
});

export default observer(WelcomeScreen);