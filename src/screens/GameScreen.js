import { View, TouchableOpacity, Text, Image, useWindowDimensions, Platform, ImageBackground } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import store from '../store/store'
import Game1Screen from './Game1Screen'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import * as ScreenOrientation from 'expo-screen-orientation';
import Animated, { useAnimatedStyle, withTiming, withSpring, withSequence, useSharedValue } from 'react-native-reanimated'
import narrowleft from '../images/narrowleft-purple.png'
import star from '../images/Star.png'
import bg from '../images/bgg.png'
import Game5Screen from './Game5Screen'
import Game3Screen from './Game3Screen'
import Game4Screen from './Game4Screen'
import Game6Screen from './Game6Screen'
import Game2Screen from './Game2Screen'
import TestScreen from './TestScreen'
import Game8Screen from './Game8Screen'
import Game9Screen from './Game9Screen'
import Game10Screen from './Game10Screen'
import Game11Screen from './Game11Screen'
import Game12Screen from './Game12Screen'
import Game13Screen from './Game13Screen'
import statStar from '../images/tabler_star-filled.png'
import CongratulationsScreen from './CongratulationsScreen'

const GameScreen = ({ route }) => {

    const { tasks, onComplete, onCompleteTask, isFromAttributes } = route.params;
    const navigation = useNavigation();
    const [level, setLevel] = useState(0);
    const [taskLevel, setTaskLevel] = useState(0);
    const [stars, setStars] = useState(null)
    const task = tasks[taskLevel].tasks

    const incrementTaskLevel = () => { 
        setTaskLevel(prev => {
            if (prev + 1 >= tasks.length) {
                return prev;
            }
            return prev + 1;
        });
    };

    const incrementLevel = () => { 
        setLevel(prev => {
            if (prev + 1 > tasks.length) {
                console.log("Нет больше задач.");
                return navigation.goBack();
            }
            return 0;
        });
    };

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const RenderVoiceGame = () => {
        // done
        return (    
            <Game1Screen setStars={setStars} data={task[level]} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} setLevel={setLevel} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderWithImageGame = () => {
        // done
        return (
            <Game5Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderSimpleGame = () => {
        // done
        return (
            <Game3Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderWithAudio = () => {
        // done
        return (
            <Game4Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderWithTitleGame = () => {
        // done
        return (
            <Game2Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderHandWrittenSimpleGame = () => {
        // done
        return (
            <Game8Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderHandWrittenRepeatGame = () => {
        // done
        return (
            <Game10Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderHandWrittenCountingGame = () => {
        // done
        return (
            <Game9Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderHandWrittenWordGame = () => {
        // done
        return (
            <Game11Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderTextSingleChoiceSimpleGame = () => {
        // done
        return (
            <Game13Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderTextSingleChoiceWithAudioGame = () => {
        // done
        return (
            <Game12Screen setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask}/>
        )
    }

    const RenderPuzzleGame = () => {
        const [data, setData] = useState(null);
    
        useEffect(() => {
            const svgData = task[level].content.svg
            
            if (svgData) {
                function parseSVG() {
                    const groupRegex = /<g[^>]+id="([^"]+)">([\s\S]*?)<\/g>/g;
                    const pathRegex = /<path[^>]+data-name="([^"]+)"[^>]+d="([^"]+)"[^>]+fill="([^"]+)"[^>]+stroke-width="([^"]+)"/g;
    
                    const partsPaths = [];
                    const imagePaths = [];
    
                    let groupMatch;
                    
                    while ((groupMatch = groupRegex.exec(svgData)) !== null) {
                        const groupId = groupMatch[1];
                        const groupContent = groupMatch[2];
    
                        let pathMatch;
                        
                        while ((pathMatch = pathRegex.exec(groupContent)) !== null) {
                            const path = {
                                id: pathMatch[1],
                                d: pathMatch[2],
                                fill: groupId === "image" ? '#dedbfb' : pathMatch[3],
                                strokeWidth: pathMatch[4]
                            };
    
                            if (groupId === "parts") {
                                partsPaths.push(path);
                            } else if (groupId === "image") {
                                imagePaths.push(path);
                            }
                        }
                    }
    
                    return { partsPaths, imagePaths };
                }
    
                const parsedData = parseSVG();
    
                setData(parsedData);
            }
        }, [])

        return data ? <Game6Screen data={data} setLevel={setLevel} /> : null;
    };

    const games = task.length
    const ProgressAnimationWidth = windowWidth * (100 / 800); 
    
    const animatedProgress = useAnimatedStyle(() => {
        const progressWidth = (level / games) * ProgressAnimationWidth; // Пропорциональная ширина
    
        return {
            width: withTiming(progressWidth, { duration: 300 }),
        };
    });
    

    const BackButton = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor: 'white', width: windowWidth * (85 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: windowWidth * (8 / 800), position: 'absolute', left: 30, top: 30}}>
                <Image source={narrowleft} style={{width: 24, height: 24, aspectRatio: 24 / 24}}/>
                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), lineHeight: windowHeight * (20 / 360), color: '#504297'}}>Exit</Text>
            </TouchableOpacity>
        )
    }

    const ProgressAnimation = () => {
        return (
            <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), position: 'absolute', right: 30, top: 30, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), backgroundColor: 'white', borderRadius: 100, alignItems: 'center', flexDirection: 'row', padding: 2}}>
                    <Animated.View style={[animatedProgress, {height: Platform.isPad? windowWidth * (8 / 800) : windowHeight * (8 / 360), backgroundColor: '#504297', borderRadius: 100}]}/>
                </View>
                <Image source={star} style={{width: windowWidth * (28 / 800), height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), aspectRatio: 28 / 28, position: 'absolute', alignSelf: 'center', right: -2, bottom: -3}}/>
            </View>      
        )
    }

    const StarStats = () => {
        return (
            <Animated.View onLayout={(event) => handleLayout(event)} style={[animatedStyle, {position: 'absolute', right: 30, top: 30, backgroundColor: 'white', width: windowWidth * (75 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), borderRadius: 100, flexDirection: 'row', justifyContent: 'space-evenly'}]}>
                <Image source={statStar} style={{width: windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (24 / 800) : windowHeight * (24 / 360), aspectRatio: 24 / 24, alignSelf: 'center'}}/>
                <Text style={{fontWeight: '600', fontSize: windowWidth * (20 / 800), color: 'black', textAlign: 'center', alignSelf: 'center'}}>{stars}</Text>
            </Animated.View>
        )
    }

    // console.log(task[level])

    return (
        <View style={{flex: 1}}>
            <ImageBackground source={bg} style={{flex: 1, alignItems: 'center', padding: 30, paddingVertical: Platform.isPad? windowWidth * (15 / 800) : Platform.OS === 'ios'? 25 : 25, width: windowWidth, height: windowHeight, justifyContent: 'space-between'}}>
            {
                task && task[level] && task[level].type ? (
                    task[level].type === 'voice_input' ?  
                    <RenderVoiceGame /> :
                    task[level].type === 'single_choice' && task[level].content.sub_type === 'with_image'?
                    <RenderWithImageGame /> :
                    task[level].type === 'single_choice' && task[level].content.sub_type === 'simple'?
                    <RenderSimpleGame /> :
                    task[level].type === 'single_choice' && task[level].content.sub_type === 'with_audio'?
                    <RenderWithAudio /> :
                    task[level].type === 'single_choice' && task[level].content.sub_type === 'with_title'?
                    <RenderWithTitleGame /> :
                    task[level].type === 'handwritten' && task[level].content.sub_type === 'simple'?
                    <RenderHandWrittenSimpleGame /> :
                    task[level].type === 'handwritten' && task[level].content.sub_type === 'repeat'?
                    <RenderHandWrittenRepeatGame /> :
                    task[level].type === 'handwritten' && task[level].content.sub_type === 'counting'?
                    <RenderHandWrittenCountingGame /> :
                    task[level].type === 'handwritten' && task[level].content.sub_type === 'word'?
                    <RenderHandWrittenWordGame /> :
                    task[level].type === 'puzzle'?
                    <RenderPuzzleGame /> :
                    task[level].type === 'text_single_choice' && task[level].content.options[0].audio === null && task[level].content.options[0].text != ""?
                    <RenderTextSingleChoiceSimpleGame /> : 
                    task[level].type === 'text_single_choice' && task[level].content.options[0].audio != null || task[level].content.options[0].text.includes(" ")?
                    <RenderTextSingleChoiceWithAudioGame /> : <CongratulationsScreen setLevel={incrementLevel} setTaskLevel={incrementTaskLevel} id={tasks[taskLevel + 1]?.id} starId={tasks[taskLevel]?.id} stars={stars} onComplete={onComplete} isFromAttributes={isFromAttributes}/>
                ) : <CongratulationsScreen setLevel={incrementLevel} setTaskLevel={incrementTaskLevel} stars={stars} id={tasks[taskLevel + 1]?.id} starId={tasks[taskLevel]?.id} onComplete={onComplete} isFromAttributes={isFromAttributes}/>
            }
                <BackButton />
                {task && task[level] && task[level].type && <ProgressAnimation />}
            </ImageBackground>
        </View>
    )
}

export default GameScreen;