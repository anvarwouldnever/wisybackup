import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { View, Platform, TouchableOpacity, Text, Image, StyleSheet, useWindowDimensions } from "react-native";
import mywisy from '../../images/MyWisy-waving.png';
import reload from '../../images/tabler_reload.png';
import LottieView from "lottie-react-native";
import store from "../../store/store";
import useLottieParser from "../../hooks/useLottieParser";
import lot from '../../lotties/panda anim 2.json'
import fetchAnimation from "./FetchLottie";
import api from "../../api/api";
import { playSound } from "../../hooks/usePlayBase64Audio";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import standingWisy from '../../lotties/standingWisy.json'
import speakingAndStanding from '../../lotties/speakingAndStanding.json'
import speakingWisyMarket from '../../lotties/wisySpeakingMarket.json'
import { observer } from "mobx-react-lite";
import { useNetInfo } from "@react-native-community/netinfo";
import { useFocusEffect, useNavigationState } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const WisyPanel = ({ currentAnimation, animationStart, marketCollections, setCurrentAnimation }) => {
        
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const animationRef = useRef<LottieView>(null);
    const [animation, setAnimation] = useState<any>(null);
    const doneWelcomeSpeech = useRef<any>(null)

    const func = async (name: string) => {
        try {
            playSound.stop()
            store.setWisySpeaking(true);
            const sound = await api.getSpeech(name, store.language);
            if (sound.length > 0) {
                const randomIndex = Math.floor(Math.random() * sound.length);
                store.setWisyMenuText(sound[randomIndex]?.text);
                await playSound(sound[randomIndex]?.audio);
            }
        } catch (error) {
            console.log(error);
        } finally {
            store.setWisySpeaking(false);
        }
    };

    useEffect(() => {
        if (marketCollections && !store.loadingCats && !store.wisySpeaking) {
            func('open_market')
        }
    }, [marketCollections]);

    useEffect(() => {
        if (!store.loadingCats && !store.wisySpeaking && !doneWelcomeSpeech.current) {
            doneWelcomeSpeech.current = true
            func('enter_collections_screen')
        }
    }, [store.loadingCats]);

    useEffect(() => {
        if (store.wisySpeaking) {
            setTimeout(() => {
                animationRef.current?.play()
            }, 1);
        } else {
            setTimeout(() => {
                animationRef.current?.reset()
            }, 1);
        }
    }, [store.wisySpeaking]);

    useEffect(() => {
        if (animationStart && !store.loadingCats) {
            animationRef.current?.reset()
            const func = async() => {
                const animation = await fetchAnimation(currentAnimation?.animation)
                setAnimation(animation);
                setCurrentAnimation(null);
                const sound = await api.getSpeech('market_item_purchase', store.language);
                if (sound.length > 0) {
                    playSound.stop()
                    const randomIndex = Math.floor(Math.random() * sound.length);
                    store.setWisyMenuText(sound[randomIndex]?.text);
                    await playSound(sound[randomIndex]?.audio);
                }
            }
            func()
        } else {
            if (marketCollections) animationRef.current?.reset()
        }
    }, [animationStart]); 

    const animationProps = useMemo(() => {
        if (animation) {
            return {
                source: animation,
                loop: false,
                onAnimationLoaded: () => animationRef.current?.play(),
            };
        } 
        if (marketCollections && store.wisySpeaking) {
            return {
                source: speakingWisyMarket,
                loop: true,
                onAnimationLoaded: () => animationRef.current?.play(),
            };
        } 
        if (marketCollections && !store.wisySpeaking) {
            return {
                source: lot,
                loop: true,
                onAnimationLoaded: () => animationRef.current?.play(),
            };
        } 
        if (!marketCollections && store.wisySpeaking) {
            return {
                source: speakingAndStanding,
                loop: false,
            };
        }
        return {
            source: standingWisy,
            loop: true,
            onAnimationLoaded: () => animationRef.current?.play(),
        };
    }, [animation, marketCollections, store.wisySpeaking]);
    
    return (
            <View style={{backgroundColor: '#F8F8F8', height: windowHeight, width: windowWidth * (280 / 800), borderTopRightRadius: 24, borderBottomRightRadius: 24, alignItems: 'center'}}>
                <View style={{alignItems: 'center', position: 'absolute', bottom: Platform.isPad? windowWidth * (20 / 800) : windowHeight * (10 / 360), left: Platform.isPad? 'auto' : windowWidth * (60 / 800), justifyContent: 'space-between', height: 'auto', gap: Platform.isPad? 20 : 0}}>
                    {store.wisyMenuText && <Animated.View key={store.wisyMenuText} entering={ZoomInEasyDown} style={{width: windowWidth * (192 / 800), height: 'auto'}}>
                        <View style={{borderRadius: 16, backgroundColor: '#C4DF84', padding: 13, width: windowWidth * (192 / 800), height: 'auto'}}>
                            <Text style={{fontWeight: '500', fontSize: windowWidth * (14 / 800)}}>
                                {store.wisyMenuText}
                            </Text>
                        </View>
                        <View style={styles.triangle}/>
                        <TouchableOpacity style={{borderRadius: 100, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -10, right: -10, backgroundColor: '#F8F8F8', width: windowWidth * (32 / 800), height: Platform.isPad? windowWidth * (32 / 800) : windowHeight * (32 / 360), borderWidth: 1, borderColor: '#0000001A'}}>
                            <Image source={reload} style={{width: windowWidth * (16 / 800), height: Platform.isPad? windowWidth * (16 / 800) : windowHeight * (16 / 360), aspectRatio: 16 / 16}}/>
                        </TouchableOpacity>
                    </Animated.View>}
                    <LottieView
                        key={animation}
                        ref={animationRef}
                        {...animationProps}
                        autoPlay={false}
                        enableMergePathsAndroidForKitKatAndAbove={false}
                        hardwareAccelerationAndroid={false}
                        style={{
                            minWidth: windowWidth * (190 / 800),
                            minHeight: Platform.isPad ? windowWidth * (190 / 800) : windowHeight * (190 / 360),
                            transform: [{ scale: 1.3 }]
                        }}
                    />
                </View>
            </View>
        )
    }

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#C4DF84',
        alignSelf: 'center',
    },
});

export default observer(WisyPanel);