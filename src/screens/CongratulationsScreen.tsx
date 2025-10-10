import React, { useRef, useEffect, useState } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
import Animated, { BounceIn, withTiming, runOnJS, useSharedValue, useAnimatedStyle, FadeIn } from 'react-native-reanimated'
import StarsLottie from './Congratulations/StarsLottie';
import ConfettiLottie from './Congratulations/ConfettiLottie';
import StarStats from './Congratulations/StarStats';
import store from '../store/store';
import TextTimer from './Congratulations/TextTimer';
import ReloadButton from './Congratulations/ReloadButton';
import Description from './Congratulations/Description';
import EarnedStars from './Congratulations/EarnedStars';
import { useScale } from '../hooks/useScale';
import { gameStore } from './Games/store/gameStore';

const CongratulationsScreen = ({ setTaskLevel, setLevel, id, starId, onComplete, stars: starsText, isFromAttributes, earnedStars: earnedStarsText, setIntroTaskIndex, setTutorialShow, categoryId, taskLevel, setLevel2 }) => {

    const stars = Array.from({ length: parseInt(starsText, 10) }, (_, index) => ({
        id: index + 1,
    }));

    const earnedStars = Array.from({ length: parseInt(earnedStarsText, 10) }, (_, index) => ({
        id: index + 1,
    }));

    // const earnedStars = [1, 2, 3]

    const [layoutCaptured, setLayoutCaptured] = useState<{ x: number; y: number }>();

    const { s, vs } = useScale()

    const [numStars, setNumStars] = useState(0);
    const [starsContainerLayout, setStarsContainerLayout] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const starsContainerRef = useRef(null);

    useEffect(() => {

        if (starsContainerRef.current) {
            starsContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
                const centerX = pageX - s(10)
                const centerY = pageY - s(7)
        
                setStarsContainerLayout({ x: centerX, y: centerY });
            });
        }

        return () => {
            store.setPlayingChildStars(earnedStars.length);
        };
    }, []);    

    useEffect(() => {
        
        if (isFromAttributes) {
            // store.loadCategories()
        } else {
            onComplete(id, starId, stars.length);
        }

        const timeoutId = setTimeout(() => {
            if (!gameStore.loadingGames) {
                setTaskLevel();
                setLevel();
            }
        }, 6500);
    
        return () => {
            clearTimeout(timeoutId);
        };
    }, [])

    const replay = () => {
        setLevel2(0)
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
        if (!isFromAttributes) {
            const currentTaskGroup = gameStore.tasks[taskLevel];
            const indexInTasks = gameStore.tasks.findIndex(group => group.id === currentTaskGroup.id);

            const collectionId = gameStore.collectionId
                
            if (indexInTasks >= gameStore.tasks.length - 3) {
                gameStore.loadNextTasksChunk({ categoryId, collectionId });
            }
        }
    }, [])

    useEffect(() => {
        if (layoutCaptured) {
            earnedStars.forEach((star, index) => {
                const delay = (index * 200);
                const delayTimer = setTimeout(() => {
                    starsContainerOpacity.value = withTiming(0, { duration: 500 });
                    animatedValues.current[index].y.value = withTiming(layoutCaptured.y, { duration: 600 });
                    animatedValues.current[index].x.value = withTiming(layoutCaptured.x + s(15), { duration: 600 }, () => {
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

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            <ConfettiLottie />
            
            <Animated.View entering={BounceIn.delay(800).duration(700)} style={{ position: 'absolute', backgroundColor: 'white', width: s(120), height: s(110), alignSelf: 'center', borderRadius: 20, flexDirection: 'column', padding: s(10), justifyContent: 'flex-end'}}>
                
                <StarsLottie stars={stars}/>
                
                {earnedStars?.length > 0 && <EarnedStars earnedStars={earnedStars} starsContainerOpacity={starsContainerOpacity} starsContainerRef={starsContainerRef} />}
                
                <Description stars={stars} />
                
                <View style={{ flexDirection: 'row', height: s(19), justifyContent: 'space-between' }}>
                    
                    <ReloadButton replay={replay} />
                    
                    <TextTimer complete={complete} />

                </View>

            </Animated.View>

            {earnedStars.map((star, index) => {
                return (
                    <Animated.Image key={index} entering={FadeIn.delay(1700)} source={require('../images/tabler_star-filled.png')} style={[animatedStyles[index], { width: s(10), height: s(10), resizeMode: 'contain', alignSelf: 'center', position: 'absolute'}]}/>
                )
            })}
            
            <StarStats numStars={numStars} layoutCaptured={layoutCaptured} setLayoutCaptured={setLayoutCaptured}/>

        </View>
    );
};

export default CongratulationsScreen;