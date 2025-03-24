import { View, TouchableOpacity, Text, Image, useWindowDimensions, Platform, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import store from '../store/store'
import Game1Screen from './Game1Screen'
import { useNavigation } from '@react-navigation/native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import narrowleft from '../images/narrowleft-purple.png'
import star from '../images/Star.png'
import bg from '../images/bgg.png'
import Game5Screen from './Game5Screen'
import Game3Screen from './Game3Screen'
import Game4Screen from './Game4Screen'
import Game6Screen from './Game6Screen'
import Game2Screen from './Game2Screen'
import Game8Screen from './Game8Screen'
import Game9Screen from './Game9Screen'
import Game10Screen from './Game10Screen'
import Game11Screen from './Game11Screen'
import Game12Screen from './Game12Screen'
import Game13Screen from './Game13Screen'
import statStar from '../images/tabler_star-filled.png'
import CongratulationsScreen from './CongratulationsScreen'
import TestScreen from './TestScreen'
import BreakScreen from './BreakScreen'
import Game16Screen from './Game16Screen'
import translations from '../../localization'
import { playSound2 } from '../hooks/usePlaySound2'
import Game14Screen from './Game14Screen'
import { toJS } from "mobx";
import Game17Screen from './Game17Screen'

const GameScreen = ({ route }) => {

    const { tasks, onComplete, onCompleteTask, breaks, isFromBreak, isFromAttributes } = route.params;
    const navigation = useNavigation();
    const [taskLevel, setTaskLevel] = useState(0);
    const [level, setLevel] = useState(isFromAttributes? 0 : tasks[taskLevel]?.current_task_id_index);
    const [stars, setStars] = useState(null);
    const [earnedStars, setEarnedStars] = useState(null);
    const [cameFromBreak, setCameFromBreak] = useState(isFromBreak);
    const [isBreak, setIsBreak] = useState(false);
    const [tutorialShow, setTutorialShow] = useState(true);
    const [introTaskIndex, setIntroTaskIndex] = useState(isFromAttributes? 0 : tasks[taskLevel]?.current_task_id_index);
    const task = tasks[taskLevel]?.tasks;

    let introAudio = tasks[taskLevel]?.introAudio
    let introText = tasks[taskLevel]?.introText
    let tutorials = tasks[taskLevel]?.tutorials

    // console.log(task[level]?.content?.sub_type)

    useEffect(() => {
        if (!isFromAttributes) {
            setLevel(tasks[taskLevel]?.current_task_id_index) 
        }
    }, [taskLevel])

    const ifCameFromBreak = breaks?.find(b => b.order === tasks[taskLevel]?.order);
    const currentBreakContent = breaks?.find(b => b.order === tasks[taskLevel - 1]?.order);
    // console.log(tasks[taskLevel]?.order, breaks)

    const incrementTaskLevel = () => {
        setTaskLevel(prev => {
            if (prev + 1 >= tasks?.length) {
                return navigation.goBack();
            } else if(breaks?.find(b => b.order === tasks[taskLevel]?.order) && !cameFromBreak && !isBreak) {
                setIsBreak(true);
                return prev + 1;
            }
            setIsBreak(false);
            setCameFromBreak(false);
            return prev + 1;
        });
    };

    const incrementLevel = () => { 
        setLevel(prev => {
            if (prev + 1 > tasks?.length) {
                console.log("Нет больше задач.");
                return 0;
            }
            return 0;
        });
    };

    const shuffleArray = (task) => {
        if (!task) return null;
    
        const taskCopy = JSON.parse(JSON.stringify(toJS(task))); // Глубокая копия
    
        if (!Array.isArray(taskCopy?.content?.pairs)) {
            return taskCopy;
        }
    
        taskCopy.content.pairs = taskCopy.content.pairs.sort(() => Math.random() - 0.5);
    
        return taskCopy;
    };

    // tasks.forEach(parentTask => {
    //     parentTask.tasks.forEach(childTask => {
    //         console.log(childTask?.type);
    //         console.log(childTask?.content?.sub_type);
    //     });
    // });

    // if (task[level]?.type === 'text_single_choice') {
    //     console.log(task[level])
    // }

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const RenderVoiceGame = () => {
        return (    
            <Game1Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} setLevel={setLevel} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderWithImageGame = () => {
        return (
            <Game5Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderSimpleGame = () => {
        return (
            <Game3Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderWithAudio = () => {
        // <Game4Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        return (
            <Game4Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderWithTitleGame = () => {
        return (
            <Game2Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderHandWrittenSimpleGame = () => {
        return (
            <Game8Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderHandWrittenRepeatGame = () => {
        return (
            <Game10Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderHandWrittenCountingGame = () => {
        return (
            <Game9Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderHandWrittenWordGame = () => {
        return (
            <Game11Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderTextSingleChoiceSimpleGame = () => {
        return (
            <Game13Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderTextSingleChoiceWithAudioGame = () => {
        return (
            <Game12Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderObjectMatchingTextGame = () => {
        return (
            <Game14Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderTextSingleChoiceWithTitleImageGame = () => {
        return (
            <Game16Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderDragAndDropGame = () => {
        return (
            <Game17Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} isFromAttributes={isFromAttributes}/>
        )
    }

    const RenderPuzzleGame = () => {
        const [data, setData] = useState(null);
    
        useEffect(() => {
            const svgData = task[level]?.content.svg;
            
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

    const games = task?.length
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
                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), lineHeight: windowHeight * (20 / 360), color: '#504297'}}>{translations?.[store.language]?.exit}</Text>
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

    return (
        <View style={{flex: 1}}>
            {!isFromAttributes && (cameFromBreak || isBreak)? 
            <BreakScreen anyBreak={cameFromBreak? ifCameFromBreak : currentBreakContent} incrementTaskLevel={incrementTaskLevel}/> 
            :
            <ImageBackground source={bg} style={{flex: 1, alignItems: 'center', padding: 30, paddingVertical: Platform.isPad? windowWidth * (15 / 800) : Platform.OS === 'ios'? 25 : 25, justifyContent: 'space-between'}}>
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
                    task[level].type === 'object_matching' && (task[level]?.content?.sub_type === 'image_to_text' || task[level]?.content?.sub_type === 'image_to_image')?
                    <RenderObjectMatchingTextGame /> :
                    task[level].type === 'puzzle'?
                    <RenderPuzzleGame /> :
                    task[level].type === 'drag_and_drop' && (task[level]?.content?.sub_type === 'image_to_text' || task[level]?.content?.sub_type === 'image_to_image')?
                    <RenderDragAndDropGame /> :
                    task[level].type === 'text_single_choice' && task[level]?.content?.sub_type === 'with_image'?
                    <RenderTextSingleChoiceWithTitleImageGame /> :
                    task[level].type === 'text_single_choice' && task[level]?.content?.sub_type === 'with_title' && task[level]?.content?.options[0]?.audio === null && task[level].content.options[0].text != ""?
                    <RenderTextSingleChoiceSimpleGame /> : 
                    task[level].type === 'text_single_choice' && task[level]?.content?.sub_type === 'with_title' &&  task[level]?.content?.options[0]?.audio != null || task[level]?.content?.options[0]?.text.includes(" ")?
                    <RenderTextSingleChoiceWithAudioGame /> : 
                    <CongratulationsScreen setTutorialShow={setTutorialShow} setIntroTaskIndex={setIntroTaskIndex} setLevel={incrementLevel} setTaskLevel={incrementTaskLevel} id={tasks[taskLevel + 1]?.id} starId={tasks[taskLevel]?.id} stars={stars} earnedStars={earnedStars} onComplete={onComplete} isFromAttributes={isFromAttributes}/>
                ) : <CongratulationsScreen setTutorialShow={setTutorialShow} setIntroTaskIndex={setIntroTaskIndex} setLevel={incrementLevel} setTaskLevel={incrementTaskLevel} stars={stars} earnedStars={earnedStars} id={tasks[taskLevel + 1]?.id} starId={tasks[taskLevel]?.id} onComplete={onComplete} isFromAttributes={isFromAttributes}/>
            }
                <BackButton />
                {task && task[level] && task[level].type && <ProgressAnimation />}
            </ImageBackground>
            }
        </View>
    )
}

export default GameScreen;


// const ordrs = breaks?.map(b => b.order)
    // const [orders, setOrders] = useState(ordrs)

    // // console.log(breaks, order, orders)

    // const matchIndex = breaks?.findIndex(b => b.order === order + taskLevel);
    // // console.log(orders.includes(order + taskLevel))

    // const skipBreak = () => {
    //     if (taskLevel + 1 >= tasks?.length) return navigation.goBack();
    //     const targetOrder = order + taskLevel;
    //     const orderIndex = orders.indexOf(targetOrder);
    
    //     if (orderIndex !== -1) {
    //         const updatedOrders = [...orders];
    //         updatedOrders.splice(orderIndex, 1);
            
    //         setOrders(updatedOrders);
    //     }
    // };