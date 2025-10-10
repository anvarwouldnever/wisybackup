import React, { useState, useEffect, useRef } from 'react';
import { Text, ImageBackground, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import TimerLayout from './Break/TimerBreakLayout';
import BackButton from './Break/BackBreakButton';
import store from '../store/store';
import { newPlaySound, stopCurrentSound } from '../hooks/newPlaySound';
import { observer } from 'mobx-react-lite';
import { Audio } from 'expo-av';
import { gameStore } from './Games/store/gameStore';
import fetchAnimation from './Break/FetchLottie';
import { useScale } from '../hooks/useScale';

const BreakScreeen = ({ anyBreak, incrementTaskLevel, isFromAttributes, categoryId, taskLevel }) => {

    const [seconds, setSeconds] = useState<number>();

    const { s, vs, isTablet } = useScale()

    const animationRef = useRef<LottieView>();
    const isFirstRender = useRef(true);
    const loadedOnce = useRef(false);

    const [animation, setAnimation] = useState(null);
    const [animationsOrder, setAnimationOrders] = useState(0);

    const [text, setText] = useState<string>(null);
    const [textOrder, setTextOrder] = useState(null);

    const [textPos, setTextPos] = useState<string>();

    const timeoutIds = useRef<number[]>([]);
    const sound = useRef<Audio.Sound | null>(null);

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

    const func = async (text: string) => {
        try {
            if (text) {
                if (sound.current) {
                    await sound.current.pauseAsync();
                }
    
                await newPlaySound(text);
    
                const timeoutId = setTimeout(() => {
                    setText(null);
                    setTextOrder((prev) => prev + 1);
    
                    if (sound.current && store?.breakMusicPlaying) {
                        sound.current.playAsync();
                    }
                }, 2500);
    
                timeoutIds.current.push(timeoutId);
            } else {
                store.setBreakPlayingMusic(true)
            }
        } catch (error) {
            console.log(error);
            if (sound.current && store.breakMusicPlaying) {
                sound.current.playAsync();
            }
        }
    };

    useEffect(() => {
        if (seconds === 0) return incrementTaskLevel()
        if (seconds <= 10 && !loadedOnce.current) {
            loadedOnce.current = true
            if (!isFromAttributes) {
                const currentTaskGroup = gameStore.tasks[taskLevel];
                const indexInTasks = gameStore.tasks.findIndex(group => group?.id === currentTaskGroup?.id);
                const collectionId = gameStore.collectionId
                    
                if (indexInTasks >= gameStore.tasks?.length - 3) {
                    gameStore.loadNextTasksChunk({ categoryId, collectionId });
                }
            }
        } else {
            return
        }
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
    
    useEffect(() => {
    
        const loadAndPlayMusic = async () => {
            try {
                if (sound.current) {
                    await sound.current.unloadAsync();
                }

                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: anyBreak?.music },
                    { shouldPlay: false, isLooping: true }
                );

                sound.current = newSound;
            } catch (error) {
                console.error('Ошибка загрузки музыки', error);
            }
        };
    
        loadAndPlayMusic();
    
        return () => {
            store.setBreakPlayingMusic(false);
            if (sound.current) {
                sound.current.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        const updatePlayback = async () => {
        if (sound.current) {
                if (store.breakMusicPlaying) {
                    await sound.current.playAsync();
                } else {
                    await sound.current.pauseAsync();
                }
            }
        };
      
        updatePlayback();
    }, [store?.breakMusicPlaying]);

    const textPositions = [
        'left_top',
        'left_center',
        'left_bottom',
        'right_top',
        'right_center',
        'right_bottom',
        'center_top',
        'center_bottom',
    ];
      
    const getPositionStyle = (textPos: string) => {
        const style: any = {
            position: 'absolute',
            padding: 12,
            backgroundColor: '#FFFFFF',
            minHeight: s(15),
            width: 'auto',
            paddingHorizontal: s(5),
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: s(70),
            borderRadius: 16,
            borderBottomLeftRadius: ['left_top', 'left_center', 'left_bottom'].includes(textPos) ? 16 : 0,
            borderBottomRightRadius: ['right_top', 'right_center', 'right_bottom'].includes(textPos) ? 16 : 0,
        };
    
        // Левый блоки
        if (textPos.startsWith('left')) {
            style.left = s(70);
        }
        // Правые блоки
        if (textPos.startsWith('right')) {
            style.right = s(70);
        }
        // Центровые по горизонтали
        if (textPos.startsWith('center')) {
            style.left = '43%';
        }
    
        // Верхние
        if (textPos.endsWith('top')) {
            style.top = vs(140);
        }
        // Центральные по вертикали
        if (textPos.endsWith('center')) {
            style.top = vs(350);
        }
        // Нижние
        if (textPos.endsWith('bottom')) {
            style.bottom = vs(120);
        }
        // Для варианта center_bottom
        if (textPos === 'center_bottom') {
            style.bottom = vs(80);
        }

        if (textPos === 'center_top') {
            style.left = '43%';
            style.top = vs(80);
        }
    
        return style;
    }

    return (
        <ImageBackground style={{flex: 1, justifyContent: 'center'}} source={{ uri: anyBreak?.background }}>
            
            <BackButton />
                
            {text &&
                <Animated.View
                    key={textPos}
                    entering={ZoomInEasyDown}
                    style={getPositionStyle(textPos)}
                >
                    <Text style={{ fontSize: s(6), textAlign: 'center' }}>{text}</Text>
                </Animated.View>
            }

            {animation ? 
                <LottieView
                    autoPlay
                    loop
                    ref={animationRef}
                    source={animation}
                    style={{ width: vs(700), height: vs(700), position: 'absolute', alignSelf: 'center' }}
                />
            :
                <ActivityIndicator style={{ position: 'absolute', alignSelf: 'center' }} size="large" color="white" />
            }

            <TimerLayout animation={animation} formatTime={formatTime} seconds={seconds} setSeconds={setSeconds}/>

        </ImageBackground>
    )
}

export default observer(BreakScreeen);