import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Platform, Image, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import flapCheta from '../lotties/I flap my wings like a bird-F.json'
import lot from '../lotties/sit on chair-F.json'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import narrowleft from '../images/narrowleft-purple.png'
import clock from '../images/CLOCK.png'
import TimerLayout from '../components/TimerBreakLayout';
import BackButton from '../components/BackBreakButton';
import store from '../store/store'
import { SvgUri } from 'react-native-svg'
import fetchAnimation from './GamesScreen/FetchLottie';
import UseMP3Player from '../hooks/useMP3Player';
import { newPlaySound, stopCurrentSoundBlya } from '../hooks/newPlaySound';
import api from '../api/api';

const TestScreen = ({ anyBreak, incrementTaskLevel }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions()

    useEffect(() => {
        return () => {
            store.setBreakPlayingMusic(false)
            store.setPlayingMusic(true)
        };
      }, []);

    const animationRef = useRef<LottieView>();

    const [animation, setAnimation] = useState(null);
    const [animationsOrder, setAnimationOrders] = useState(0);

    const [text, setText] = useState<string>(null);
    const [textOrder, setTextOrder] = useState(0)

    const [textPos, setTextPos] = useState<string>();

    const [seconds, setSeconds] = useState<number>();

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const remainingSeconds = sec % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const func = async(text: string) => {
        try {
            if (text) {
                await newPlaySound(text);
                setTimeout(() => {
                    setText(null)
                    setTextOrder(prev => prev + 1)
                }, 2500);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchJSON = async () => {
            try {
                const currentBreak = anyBreak?.dynamic_breaks[animationsOrder];
                if (!currentBreak) return incrementTaskLevel();
    
                const animationData = await fetchAnimation(currentBreak?.animation);
                setAnimation(animationData);
                setTextOrder(0);
    
                setTimeout(() => {
                    animationRef.current?.reset();
                    animationRef.current?.play();
                }, 1);

                setSeconds(currentBreak?.duration)
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchJSON();

    }, [animationsOrder]);

    useEffect(() => {
        if (seconds === 0) {
            setAnimationOrders(prev => prev + 1);
        }
    }, [seconds])

    useEffect(() => {
        const currentText = anyBreak?.dynamic_breaks[animationsOrder]?.speeches[textOrder]

        if (textOrder > anyBreak?.dynamic_breaks[animationsOrder]?.speeches.length) {
            return;
        }

        setTextPos(currentText?.position)
        setTimeout(() => {
            setText(currentText?.text)
            func(currentText?.speech)
        }, currentText?.time * 1000);

    }, [animationsOrder, textOrder])


    return (
        <ImageBackground style={{flex: 1, justifyContent: 'center'}} source={{ uri: anyBreak?.background }}>
            <UseMP3Player url={anyBreak?.music}/>
            <BackButton />
                {text && <Animated.View key={text} entering={ZoomInEasyDown} style={{
                position: 'absolute',
                padding: 12,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                borderBottomLeftRadius: ['left_top', 'left_center', 'left_bottom'].includes(textPos) ? 16 : 0,
                borderBottomRightRadius: ['right_top', 'right_center', 'right_bottom'].includes(textPos) ? 16 : 0,
                left: ['left_top', 'left_center', 'left_bottom'].includes(textPos) ? windowWidth * (130 / 800) :
                        ['right_top', 'right_center', 'right_bottom'].includes(textPos) ? windowWidth * (600 / 800) : windowWidth * (100 / 800),
                top: textPos == 'left_top' ? windowHeight * (60 / 360) :
                        textPos == 'left_center' ? windowHeight * (100 / 360) :
                        textPos == 'left_bottom' ? windowHeight * (140 / 360) : 'auto'
                }}
                >
                    <Text>{text}</Text>
                </Animated.View>}
                {animation && <LottieView
                    loop={true}
                    ref={animationRef}
                    source={animation}
                    style={{width: windowWidth * (315 / 800), height: windowHeight * (315 / 360), position: 'absolute', alignSelf: 'center'}}
                />}
                <TimerLayout animation={animation} formatTime={formatTime} seconds={seconds} setSeconds={setSeconds}/>
        </ImageBackground>
    )
}

export default TestScreen;


















{/* <View style={{width: windowWidth * (255 / 800), position: 'absolute', left: 0, bottom: 0, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
                <Image source={wisy} style={{width: windowWidth * (64 / 800), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), aspectRatio: 64 / 64}}/>
                {text && text != '' && <Game3TextAnimation text={text} thinking={thinking}/>}
            </View> */}

    //         const navigation = useNavigation()

    // const [seconds, setSeconds] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setSeconds(prev => prev + 1);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    // const formatTime = (sec: number) => {
    //     const minutes = Math.floor(sec / 60);
    //     const remainingSeconds = sec % 60;
    //     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    // };