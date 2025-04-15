import React, { useState, useEffect, useRef } from 'react';
import { Text, useWindowDimensions, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import TimerLayout from '../components/TimerBreakLayout';
import BackButton from '../components/BackBreakButton';
import store from '../store/store';
import fetchAnimation from './GamesScreen/FetchLottie';
import UseMP3Player from '../hooks/useMP3Player';
import { newPlaySound, stopCurrentSound } from '../hooks/newPlaySound';
import loadingAnim from '../../assets/6Vcbuw6I0c (1).json'
import { observer } from 'mobx-react-lite';

const BreakScreeen = ({ anyBreak, incrementTaskLevel }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [seconds, setSeconds] = useState<number>();

    const animationRef = useRef<LottieView>();
    const isFirstRender = useRef(true);

    const [animation, setAnimation] = useState(null);
    const [animationsOrder, setAnimationOrders] = useState(0);

    const [text, setText] = useState<string>(null);
    const [textOrder, setTextOrder] = useState(null);

    const [textPos, setTextPos] = useState<string>();

    const timeoutIds = useRef<number[]>([]);

    useEffect(() => {
        setSeconds(
          anyBreak?.dynamic_breaks?.reduce(
            (sum: any, item: any) => sum + (item?.duration || 0),
            0
          )
        );
    
        return () => {
          store.setBreakPlayingMusic(false);
          stopCurrentSound();
          timeoutIds.current.forEach((id) => clearTimeout(id));
        };
    }, []);

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const remainingSeconds = sec % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const func = async(text: string) => {
        try {
            if (text) {
                await newPlaySound(text);
                const timeoutId = setTimeout(() => {
                    setText(null);
                    setTextOrder((prev) => prev + 1);
                  }, 2500);
                timeoutIds.current.push(timeoutId);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (seconds == 0) return incrementTaskLevel()
    }, [seconds])

    useEffect(() => {
        const fetchJSON = async () => {
            let animationData = null;
            let currentBreak = null;
        
            try {
                currentBreak = anyBreak?.dynamic_breaks[animationsOrder];
                if (!currentBreak) return;
    
                animationData = await fetchAnimation(currentBreak?.animation);
            } catch (error) {
                console.log(error);
            } finally {
                if (animationData && currentBreak) {
                    setAnimation(animationData);
                    setTextOrder(0);
        
                    const timeoutId1 = setTimeout(() => {
                        animationRef.current?.reset();
                        animationRef.current?.play();
                      }, 1);
                      timeoutIds.current.push(timeoutId1); // Сохраняем ID таймаута
            
                      const timeoutId2 = setTimeout(() => {
                        setAnimationOrders((prev) => prev + 1);
                      }, currentBreak?.duration * 1000);
                      timeoutIds.current.push(timeoutId2);
                }
            }
        };
    
        fetchJSON();
    }, [animationsOrder]);
    

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const currentText = anyBreak?.dynamic_breaks[animationsOrder]?.speeches[textOrder];
        
        if (textOrder > anyBreak?.dynamic_breaks[animationsOrder]?.speeches.length) {
            return;
        }
    
        setTextPos(currentText?.position);

        const timeoutId = setTimeout(() => {
            setText(currentText?.text);
            func(currentText?.speech);
          }, currentText?.time * 1000);
      
          timeoutIds.current.push(timeoutId);
        
    }, [animationsOrder, textOrder]);

    return (
        <ImageBackground style={{flex: 1, justifyContent: 'center'}} source={{ uri: anyBreak?.background }}>
            {animation && <UseMP3Player url={anyBreak?.music}/>}
            <BackButton />
                {text && <Animated.View key={text} entering={ZoomInEasyDown} style={{
                                position: 'absolute',
                                padding: 12,
                                backgroundColor: '#FFFFFF',
                                width: 'auto',
                                maxWidth: windowWidth * (170 / 800),
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
                {animation? 
                    <LottieView
                        loop={true}
                        ref={animationRef}
                        source={animation}
                        style={{width: windowWidth * (315 / 800), height: windowHeight * (315 / 360), position: 'absolute', alignSelf: 'center'}}
                    />
                :
                    <LottieView
                        loop={true}
                        autoPlay
                        source={loadingAnim}
                        style={{width: windowWidth * (50 / 800), height: windowHeight * (50 / 360), position: 'absolute', alignSelf: 'center'}}
                    />
                }
                <TimerLayout animation={animation} formatTime={formatTime} seconds={seconds} setSeconds={setSeconds}/>
        </ImageBackground>
    )
}

export default observer(BreakScreeen);