import React, { useRef, useEffect, useState } from 'react';
import { View, useWindowDimensions, Image, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, { BounceIn, withTiming, runOnJS, useSharedValue, useAnimatedStyle, withDelay, FadeIn, withSequence, withSpring } from 'react-native-reanimated';
import star from '../images/tabler_star-filled.png';
import * as Haptics from 'expo-haptics'
import StarsLottie from '../components/StarsLottie';
import ConfettiLottie from '../components/ConfettiLottie';
import StarStats from '../components/StarStats';
import store from '../store/store';
import Timer from '../components/Timer';
import reload from '../images/succscreenreload.png'
import translations from '../../localization';

const CongratulationsScreen = ({ setTaskLevel, setLevel, id, starId, onComplete, stars: starsText, isFromAttributes, earnedStars: earnedStarsText, setIntroTaskIndex, setTutorialShow }) => {
    
    console.log(earnedStarsText, starsText)

    const stars = Array.from({ length: parseInt(starsText, 10) }, (_, index) => ({
        id: index + 1,
    }));

    const earnedStars = Array.from({ length: parseInt(earnedStarsText, 10) }, (_, index) => ({
        id: index + 1,
    }));
    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [numStars, setNumStars] = useState(0);
    const [starsContainerLayout, setStarsContainerLayout] = useState({});

    const starsContainerRef = useRef(null);

    useEffect(() => {

        if (starsContainerRef.current) {
            starsContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
                const centerX = pageX + (width / 6);
                const centerY = pageY - (height / 4);
        
                setStarsContainerLayout({ x: centerX, y: centerY });
        
                // console.log({ centerX, centerY }); // Для отладки
            });
        }

        return () => {
            store.setPlayingChildStars(earnedStars.length);
        };
    }, []);    

    const [layoutCaptured, setLayoutCaptured] = useState();

    useEffect(() => {
        
        if (isFromAttributes) {
            // store.loadCategories()
        } else {
            onComplete(id, starId, stars.length);
        }

        const timeoutId = setTimeout(() => {
            setTaskLevel();
            setLevel();
        }, 6500);
    
        return () => {
            clearTimeout(timeoutId);
        };
    }, [])

    const replay = () => {
        setLevel();
        setIntroTaskIndex(null);
        setTutorialShow(false)
    }

    const complete = () => {
        setTaskLevel();
        setLevel();
    }

    const starsContainerOpacity = useSharedValue(1) 

    const animatedValues = useRef(earnedStars.map(() => ({
        x: useSharedValue(starsContainerLayout?.x),
        y: useSharedValue(starsContainerLayout?.y)
    })));

    useEffect(() => {
        if (starsContainerLayout) {
            animatedValues.current.forEach((value) => {
                value.x.value = starsContainerLayout.x;
                value.y.value = starsContainerLayout.y;
            });
        }
    }, [starsContainerLayout]);

    const Nums = () => {
        setNumStars(prev => prev + 1)
    }

    useEffect(() => {
        if (layoutCaptured) {
            earnedStars.forEach((star, index) => {
                const delay = (index * 200);
                const delayTimer = setTimeout(() => {
                    starsContainerOpacity.value = withTiming(0, { duration: 500 });
                    animatedValues.current[index].y.value = withTiming(layoutCaptured.y, { duration: 600 });
                    animatedValues.current[index].x.value = withTiming(layoutCaptured.x + 30, { duration: 600 }, () => {
                        runOnJS(Nums)()
                    });
                }, delay);
                return () => clearTimeout(delayTimer);
            });
        }
    }, [layoutCaptured]);

    const animatedStyles = animatedValues?.current?.map(({ x, y }) => {
        return useAnimatedStyle(() => ({
            left: x?.value,
            top: y?.value,
        }));
    });

    const starsContainerStyle = useAnimatedStyle(() => ({
        opacity: starsContainerOpacity.value,
    }));

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <ConfettiLottie />
            <Animated.View entering={BounceIn.delay(800).duration(700)}
                style={{
                    top: Platform.isPad? windowHeight * (80 / 360) : windowHeight * (40 / 360),
                    position: 'absolute',
                    backgroundColor: 'white',
                    width: windowWidth * (260 / 800),
                    height: Platform.isPad? windowWidth * (250 / 800) : windowHeight * (250 / 360),
                    alignSelf: 'center',
                    borderRadius: 20,
                    flexDirection: 'row',
                }}
            >
                <StarsLottie stars={stars}/>
                {earnedStars.length > 0 && <Animated.View ref={starsContainerRef} entering={BounceIn.delay(1700).duration(800).springify(400)} style={[starsContainerStyle, {width: windowWidth * (75 / 800), height: windowHeight * (40 / 360), backgroundColor: '#B3ABDB', position: 'absolute', borderRadius: 100, alignSelf: 'flex-end', gap: 1, top: Platform.isPad? '30%' : '35%', right: -40, flexDirection: 'column', justifyContent: 'center', paddingHorizontal: 10}]}>
                    <Text style={{fontWeight: '600', color: 'white', fontSize: windowWidth * (23 / 800), textAlign: 'center', alignSelf: 'flex-end'}}>+{`${earnedStars.length}`}</Text>
                </Animated.View>}
                <View style={{width: windowWidth * (212 / 800), height: Platform.isPad? windowWidth * (60 / 800) : windowHeight * (60 / 360), position: 'absolute', alignSelf: 'center', left: '10%', justifyContent: 'space-between', padding: 4}}>
                    <Text style={{fontSize: windowWidth * (20 / 800), fontWeight: '600', color: '#222222', alignSelf: 'center'}}>{stars.length == 0 && store?.language === 'lv'? 'Mēģini vēlreiz' : stars.length == 1 && store?.language === 'en'? 'Try Again' : stars.length == 1 && store?.language === 'lv'? 'Tu vari labāk' : stars.length == 1 && store?.language === 'en'? 'You Can Do Better' : stars.length == 2 && store.language === 'lv'? "Mēģini vēlreiz" : stars.length == 2 && store.language === 'en'? 'So Close' : stars.length == 3 && store.language === 'lv'? 'Perfekti' : stars.length == 3 && store.language === 'en'? 'Perfect' : 'Congratulations!'}</Text>
                    <Text style={{fontSize: windowWidth * (14 / 800), fontWeight: '400', color: '#222222', alignSelf: 'center', textAlign: 'center', marginTop: 10}}>{stars.length == 0 && store?.language === 'lv'? 'Tu ieguvi 0 zvaigznes. Turpini trenēties!' : stars.length == 0 && store?.language === 'en'? 'You earned 0 stars. Keep practicing' : stars.length == 1 && store.language === 'lv'? 'Tu ieguvi tikai 1 zvaigzni. Zinu, ka vari labāk!' : stars.length == 1 && store.language === 'en'? 'You only earned 1 star. I know you can do better!' : stars.length == 2 && store.language === 'lv'? 'Tu ieguvi 2 zvaigznes! Vēl mazliet piepūles!' : stars.length == 2 && store.language === 'en'? 'You earned 2 stars! Just a little more effort!' : stars.length == 3 && store.language === 'lv'? 'Tu ieguvi 3 zvaigznes, turpini tāpat!' : stars.length == 3 && store.language === 'en'? 'You earned 3 stars, keep it up!' : 'Congratulations!'}</Text>
                </View>
                <TouchableOpacity onPress={() => replay()} style={{width: windowWidth * (40 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: '#B3ABDB', position: 'absolute', bottom: Platform.isPad? windowWidth * (30 / 800) : windowHeight * (30 / 360), borderRadius: 100, alignSelf: 'center', left: '10%', justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={reload} style={{width: windowWidth * (16 / 800), height: Platform.isPad? windowWidth * (16 / 800) : windowHeight * (16 / 360)}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => complete()} style={{width: windowWidth * (163 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), position: 'absolute', backgroundColor: '#504297', bottom: Platform.isPad? windowWidth * (30 / 800) : windowHeight * (30 / 360), borderRadius: 100, alignSelf: 'center', left: '30%', paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: windowWidth * (12 / 800), fontWeight: '600', color: 'white', alignSelf: 'center'}}>{translations?.[store.language]?.continue}</Text>
                    <Timer />
                </TouchableOpacity>
            </Animated.View>
            {earnedStars.map((item, index) => {
                return (
                    <Animated.Image
                        key={index}
                        entering={FadeIn.delay(1700)}
                        source={star}
                        style={[animatedStyles[index],
                            {
                                width: Platform.isPad? windowHeight * (20 / 360) : windowWidth * (20 / 800),
                                height: Platform.isPad? windowHeight * (20 / 800) : windowHeight * (20 / 360),
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                position: 'absolute',
                            },
                        ]}
                />
                )})}
                <StarStats 
                    numStars={numStars}
                    layoutCaptured={layoutCaptured}
                    setLayoutCaptured={setLayoutCaptured}
                />
        </View>
    );
};

export default CongratulationsScreen;