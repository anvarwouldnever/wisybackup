import React, { useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import store from "../../store/store";
import lot from '../../lotties/panda anim 2.json'
import fetchAnimation from "./FetchLottie";
import { playSound } from "../../hooks/usePlaySound";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import standingWisy from '../../lotties/standingWisy.json';
import speakingAndStanding from '../../lotties/speakingAndStanding.json';
import speakingWisyMarket from '../../lotties/wisySpeakingMarket.json';
import { observer } from "mobx-react-lite";
import { gameStore } from "../Games/store/gameStore";
import { GetSpeeches } from "../../api/methods/speeches/speech";
import { useScale } from "../../hooks/utils/useScale";
import Back from "./Back";

const WisyPanel = ({ currentAnimation, animationStart, marketCollections, setCurrentAnimation, modal, animation, setAnimation, setAnimationStart }) => {
       
    const animationRef = useRef<LottieView>(null)
    const welcomeSequenceDone = useRef(false);

    const animationHasFinishedOnceRef = useRef<boolean>(false);

    const { s, vs, isTablet } = useScale();

    const func = async (name: string) => {
        try {
            playSound.stop()
            store.setWisySpeaking(true);
            const response = await GetSpeeches(name);
            if (response.data?.data?.length > 0) {
                const randomIndex = Math.floor(Math.random() * response?.data?.data?.length);
                store.setWisyMenuText(response.data?.data[randomIndex]?.text);
                await playSound(response.data?.data[randomIndex]?.audio);
            }
        } catch (error) {
            console.log(error);
        } finally {
            store.setWisySpeaking(false);
        }
    };

    useEffect(() => {
        if (store.isFirstOpening && marketCollections && !gameStore.loadingCats ) {
            playWelcomeSequenceMarket()
            return
        }
    
        if (!marketCollections) {
            setAnimation(null);
        }
    
        if (!store.isFirstOpening && marketCollections && !gameStore.loadingCats && !store.wisySpeaking) {
            func('open_market');
        }
    }, [marketCollections]);

    const firstOpening = async(name: string) => {
        try {
            playSound.stop()
            const sound = await GetSpeeches(name);
            store.setWisySpeaking(true);
            store.setWisyMenuText(sound.data?.data[0]?.text);
            await playSound(sound.data?.data[0]?.audio);
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
    
        if (!gameStore.loadingCats && !store.wisySpeaking && !store.doneWelcomeSpeech && !welcomeSequenceDone.current) {
            store.setDoneWelcomeSpeech(true)
            func('enter_collections_screen');
        }
    }, [gameStore.loadingCats]);    

    useEffect(() => {
        if (animationStart && !gameStore.loadingCats) {
            animationRef.current?.reset();
            animationHasFinishedOnceRef.current = false;
            const func = async () => {
                // const json = currentAnimation?.animation;

                // вычисляем длительность
                // if (json?.fr && json?.op) {
                //     const duration = (json.op / json.fr) * 1000;
                //     setDurationOfAnimation(duration);
                // }

                
                setAnimation({ uri: currentAnimation?.animation });
                setCurrentAnimation(null);
                

                if (store.isFirstOpening) return

                const sound = await GetSpeeches('market_item_purchase');
                if (sound.data?.data?.length > 0) {
                    playSound.stop();
                    const randomIndex = Math.floor(Math.random() * sound.data?.data?.length);
                    store.setWisyMenuText(sound.data?.data[randomIndex]?.text);
                    await playSound(sound.data?.data[randomIndex]?.audio);
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
            return
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
                source: animation,
                loop: false,
                autoPlay: false,
                onAnimationLoaded: () => {
                    animationRef?.current.play()
                },
                onAnimationFinish: () => {
                    console.log('🔥 onAnimationFinish сработал');
                
                    if (!animationHasFinishedOnceRef.current) {
                        animationHasFinishedOnceRef.current = true;
                        console.log('⚠️ первый вызов onAnimationFinish — игнорируем');
                        return;
                    }
                
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
            <View style={{backgroundColor: '#F8F8F8', height: '100%', width: s(125), borderTopRightRadius: 24, borderBottomRightRadius: 24, alignItems: 'center', paddingLeft: isTablet ? 0 : s(15), paddingTop: vs(50), justifyContent: 'space-between'}}>
                
                <Back />
                
                <View style={{ alignItems: 'center', height: 'auto' }}>
                    
                    {store.wisyMenuText && 

                        <Animated.View key={store.wisyMenuText} entering={ZoomInEasyDown} style={{width: 'auto', height: 'auto', zIndex: 1000}}>
                            
                            <View style={{borderRadius: s(6), backgroundColor: '#C4DF84', padding: isTablet ? s(6) : s(5), width: 'auto', minWidth: s(60), maxWidth: s(90), maxHeight: s(35), height: 'auto', alignItems: 'center', justifyContent: 'center'}}>
                                
                                <Text style={{ fontWeight: '500', fontSize: isTablet ? s(7) : s(6), lineHeight: isTablet ? s(9) : s(8) }}>
                                    {store?.wisyMenuText}
                                </Text>
                                
                            </View>

                            <View style={styles.triangle}/>
                            
                            <TouchableOpacity style={{borderRadius: 100, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -s(3), right: -s(3), backgroundColor: '#F8F8F8', width: s(14), height: s(14), borderWidth: 1, borderColor: '#0000001A'}}>
                                
                                <Image source={require('../../images/tabler_reload.png')} style={{width: s(8), height: s(8)}}/>
                            
                            </TouchableOpacity>
                            
                        </Animated.View>

                    }

                    <LottieView
                        key={animation}
                        ref={animationRef}
                        {...animationProps}
                        style={{
                            width: vs(500),
                            height: vs(430),
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