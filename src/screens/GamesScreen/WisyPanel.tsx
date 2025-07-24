import React, { useEffect, useRef, useMemo, useState } from "react";
import { View, Platform, TouchableOpacity, Text, Image, StyleSheet, useWindowDimensions } from "react-native";
import reload from '../../images/tabler_reload.png';
import LottieView from "lottie-react-native";
import store from "../../store/store";
import lot from '../../lotties/panda anim 2.json'
import fetchAnimation from "./FetchLottie";
import api from "../../api/api";
import { playSound } from "../../hooks/usePlayBase64Audio";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import standingWisy from '../../lotties/standingWisy.json';
import speakingAndStanding from '../../lotties/speakingAndStanding.json';
import speakingWisyMarket from '../../lotties/wisySpeakingMarket.json';
import { observer } from "mobx-react-lite";
import bamboo from '../../lotties/panda bamboo eat5-F.json'

const WisyPanel = ({ currentAnimation, animationStart, marketCollections, setCurrentAnimation, modal, animation, setAnimation, setAnimationStart }) => {
        
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const animationRef = useRef<LottieView>(null);
    const doneWelcomeSpeech = useRef<any>(null);
    const welcomeSequenceDone = useRef(false);
    // const [durationOfAnimation, setDurationOfAnimation] = useState()

    const animationHasFinishedOnceRef = useRef<boolean>(false);

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
        if (store.isFirstOpening && marketCollections && !store.loadingCats ) {
            playWelcomeSequenceMarket()
            return
        }
    
        if (!marketCollections) {
            setAnimation(null);
        }
    
        if (!store.isFirstOpening && marketCollections && !store.loadingCats && !store.wisySpeaking) {
            func('open_market');
        }
    }, [marketCollections]);

    const firstOpening = async(name: string) => {
        try {
            playSound.stop()
            const sound = await api.getSpeech(name, store.language);
            store.setWisySpeaking(true);
            store.setWisyMenuText(sound[0]?.text);
            await playSound(sound[0]?.audio);
        } catch (error) {
            console.log(error);
        } 
    }

    const playWelcomeSequenceMarket = async() => {
        
        store.setWisySpeaking(true);

        await firstOpening('first_login_welcome_text_5');

        store.setWisySpeaking(false);
        welcomeSequenceDone.current = true;
    }

    const playWelcomeSequenceMarket2 = async() => {
        const messages = [
            'first_login_welcome_text_6',
            'first_login_welcome_text_7'
        ];

        await new Promise(res => setTimeout(res, 500));

        store.setWisySpeaking(true);

        for (const msg of messages) {
            await firstOpening(msg);
        }

        if (store.isFirstOpening) {
            store.setIsFirstOpening(false)
            store.removeNewChild(store?.playingChildId?.id)
        }

        store.setWisySpeaking(false);
        setAnimationStart(false)
        welcomeSequenceDone.current = true;
    }

    useEffect(() => {
        const playWelcomeSequenceCollections = async () => {
            if (marketCollections) return
            const messages = [
                'first_login_welcome_text_1',
                'first_login_welcome_text_2',
                'first_login_welcome_text_3',
                'first_login_welcome_text_4',
            ];
    
            await new Promise(res => setTimeout(res, 500));
    
            store.setWisySpeaking(true);
    
            for (const msg of messages) {
                await firstOpening(msg);
            }
    
            store.setWisySpeaking(false);
            welcomeSequenceDone.current = true;
        };
    
        if (store.isFirstOpening && !marketCollections) {
            playWelcomeSequenceCollections();
        }
    }, []);

    useEffect(() => {
        if (store.isFirstOpening) return;
    
        if (!store.loadingCats && !store.wisySpeaking && !doneWelcomeSpeech.current && !welcomeSequenceDone.current) {
            doneWelcomeSpeech.current = true;
            func('enter_collections_screen');
        }
    }, [store.loadingCats]);    

    useEffect(() => {
        if (animationStart && !store.loadingCats) {
            animationRef.current?.reset();
            animationHasFinishedOnceRef.current = false;
            const func = async () => {
                // const json = currentAnimation?.animation;

                // вычисляем длительность
                // if (json?.fr && json?.op) {
                //     const duration = (json.op / json.fr) * 1000;
                //     setDurationOfAnimation(duration);
                // }

                if (currentAnimation?.animation === 0) {
                    setAnimation(1);
                    setCurrentAnimation(null);
                } else {
                    const animation = await fetchAnimation(currentAnimation?.animation);
                    setAnimation(animation);
                    setCurrentAnimation(null);
                }

                if (store.isFirstOpening) return

                const sound = await api.getSpeech('market_item_purchase', store.language);
                if (sound.length > 0) {
                    playSound.stop();
                    const randomIndex = Math.floor(Math.random() * sound.length);
                    store.setWisyMenuText(sound[randomIndex]?.text);
                    await playSound(sound[randomIndex]?.audio);
                }
            };
            func();
        } else {
            return
            // if (marketCollections) animationRef.current?.reset();
        }
    }, [animationStart, modal]);    

    useEffect(() => {
        if (animation) {
            animationRef?.current.play()
        } else if (!store.wisySpeaking && marketCollections) {
            animationRef?.current.play()
        } else if (!store.wisySpeaking && !marketCollections) {
            animationRef?.current.play()
        } else if (store.wisySpeaking && !marketCollections) {
            animationRef?.current.play()
        }
    }, [animation]);

    const animationProps = useMemo(() => {
        if (animation) {
            return {
                source: animation === 1? bamboo : animation,
                loop: false,
                autoPlay: false,
                onAnimationFinish: () => {
                    console.log('🔥 onAnimationFinish сработал');
        
                    const isBamboo = animation === 1;
        
                    if (isBamboo && !animationHasFinishedOnceRef.current) {
                        // bamboo: первый вызов — игнорируем
                        animationHasFinishedOnceRef.current = true;
                        console.log('⚠️ bamboo: первый вызов onAnimationFinish — игнорируем');
                        return;
                    }
        
                    if (!isBamboo && animationHasFinishedOnceRef.current) {
                        // обычная анимация: повторный вызов — игнорируем
                        console.log('⚠️ обычная анимация: повторный вызов onAnimationFinish — игнорируем');
                        return;
                    }
        
                    animationHasFinishedOnceRef.current = true;
                    console.log('✅ onAnimationFinish — выполняем действия');
        
                    if (store.isFirstOpening) {
                        setAnimation(null);
                        playWelcomeSequenceMarket2();
                    } else {
                        setAnimation(null);
                        setAnimationStart(false);
                    }
                }           
            };
        } 
        if (marketCollections && store.wisySpeaking) {
            return {
                source: speakingWisyMarket,
                loop: true,
                autoPlay: true,
            };
        } 
        if (marketCollections && !store.wisySpeaking) {
            return {
                source: lot,
                loop: true,
                onAnimationLoaded: () => animationRef.current?.play(),
                autoPlay: false,
            };
        } 
        if (!marketCollections && store.wisySpeaking) {
            return {
                source: speakingAndStanding,
                loop: true,
                autoPlay: true,
            };
        }
        return {
            source: standingWisy,
            loop: true,
            onAnimationLoaded: () => animationRef.current?.play(),
            autoPlay: false,
        };
    }, [animation, marketCollections, store.wisySpeaking, modal]);
    
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