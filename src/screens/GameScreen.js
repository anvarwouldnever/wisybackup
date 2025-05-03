import { View, TouchableOpacity, Text, Image, useWindowDimensions, Platform, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import store from '../store/store';
import Game1Screen from './Game1Screen';
import { useNavigation } from '@react-navigation/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import narrowleft from '../images/narrowleft-purple.png';
import star from '../images/Star.png';
import bg from '../images/bgg.png';
import Game5Screen from './Game5Screen';
import Game3Screen from './Game3Screen';
import Game4Screen from './Game4Screen';
import Game6Screen from './Game6Screen';
import Game2Screen from './Game2Screen';
import Game8Screen from './Game8Screen';
import Game9Screen from './Game9Screen';
import Game10Screen from './Game10Screen';
import Game11Screen from './Game11Screen';
import Game12Screen from './Game12Screen';
import Game13Screen from './Game13Screen';
import CongratulationsScreen from './CongratulationsScreen';
import TestScreen from './TestScreen';
import BreakScreen from './BreakScreen';
import Game16Screen from './Game16Screen';
import translations from '../../localization';
import Game14Screen from './Game14Screen';
import Game17Screen from './Game17Screen';
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds';
import { playSound } from '../hooks/usePlayBase64Audio';
import { observer } from 'mobx-react-lite';

const GameScreen = ({ route }) => {

    const { onComplete, onCompleteTask, breaks, isFromBreak, isFromAttributes, categoryId, collectionId } = route.params;
    const tasks = store?.tasks;
    const navigation = useNavigation();
    const [taskLevel, setTaskLevel] = useState(0);
    const [isFrozen, setIsFrozen] = useState(false);
    const [level, setLevel] = useState(isFromAttributes? 0 : tasks[taskLevel]?.current_task_id_index);
    const [stars, setStars] = useState(null);
    const [earnedStars, setEarnedStars] = useState(null);
    const [cameFromBreak, setCameFromBreak] = useState(isFromBreak);
    const [isBreak, setIsBreak] = useState(false);
    const [tutorialShow, setTutorialShow] = useState(isFromAttributes? false : true);
    const [introTaskIndex, setIntroTaskIndex] = useState(isFromAttributes? 0 : tasks[taskLevel]?.current_task_id_index);
    const task = tasks[taskLevel]?.tasks; 

    let introAudio = tasks[taskLevel]?.introAudio
    let introText = tasks[taskLevel]?.introText
    let tutorials = tasks[taskLevel]?.tutorials
    
    const ifCameFromBreak = breaks?.find(b => b.order === tasks[taskLevel]?.order);
    const currentBreakContent = breaks?.find(b => b.order === tasks[taskLevel]?.order);

    const incrementTaskLevel = () => {
        setTaskLevel(prev => {
          const nextLevel = prev + 1;
      
          if (nextLevel >= tasks?.length) {
            return navigation.goBack();;
          }
      
          const isScheduledBreak = breaks?.find(b => b?.order === tasks[taskLevel]?.order);
      
          if (isScheduledBreak && !cameFromBreak && !isBreak) {
            setIsBreak(true);
            return prev;
          }

          if (isBreak) {
            if (!tutorialShow) {
                setTutorialShow(true)
            }
            setIsBreak(false);
          }
      
          if (cameFromBreak) {
            setCameFromBreak(false);
          }

          return nextLevel;
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

    // console.log(task)

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

    const goBack = () => {
        playSound.stop();
        playSoundWithoutStopping.stop();
        navigation.goBack();
        setIsFrozen(true);
    };

    const BackButton = () => {
        return (
            <TouchableOpacity onPress={() => goBack()} style={{backgroundColor: 'white', width: windowWidth * (85 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: windowWidth * (8 / 800), position: 'absolute', left: 30, top: 30, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                <Image source={narrowleft} style={{width: 24, height: 24, aspectRatio: 24 / 24}}/>
                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), lineHeight: windowHeight * (20 / 360), color: '#504297'}}>{translations?.[store.language]?.exit}</Text>
            </TouchableOpacity>
        )
    }

    const ProgressAnimation = () => {
        return (
            <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), position: 'absolute', right: 30, top: 30, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), backgroundColor: 'white', borderRadius: 100, alignItems: 'center', flexDirection: 'row', padding: 2}}>
                    <Animated.View style={[animatedProgress, {height: Platform.isPad? windowWidth * (8 / 800) : windowHeight * (8 / 360), backgroundColor: '#504297', borderRadius: 100}]}/>
                </View>
                <Image source={star} style={{width: windowWidth * (28 / 800), height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), aspectRatio: 28 / 28, position: 'absolute', alignSelf: 'center', right: -2, bottom: -3}}/>
            </View>      
        )
    }

    return (
        <View style={{flex: 1}}>
            {!isFromAttributes && (cameFromBreak || isBreak)? 
            <BreakScreen taskLevel={taskLevel} isFromAttributes={isFromAttributes} categoryId={categoryId} collectionId={collectionId} anyBreak={cameFromBreak? ifCameFromBreak : currentBreakContent} incrementTaskLevel={incrementTaskLevel}/>
            :
            isFrozen? <View /> 
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
                    task[level].type === 'text_single_choice' && task[level]?.content?.sub_type === 'simple'?
                    <RenderTextSingleChoiceSimpleGame /> : 
                    task[level].type === 'text_single_choice' && task[level]?.content?.sub_type === 'with_audio'?
                    <RenderTextSingleChoiceWithAudioGame /> : 
                    <CongratulationsScreen taskLevel={taskLevel} categoryId={categoryId} collectionId={collectionId} setTutorialShow={setTutorialShow} setIntroTaskIndex={setIntroTaskIndex} setLevel={incrementLevel} setTaskLevel={incrementTaskLevel} id={tasks[taskLevel + 1]?.id} starId={tasks[taskLevel]?.id} stars={stars} earnedStars={earnedStars} onComplete={onComplete} isFromAttributes={isFromAttributes}/>
                ) : <CongratulationsScreen taskLevel={taskLevel} categoryId={categoryId} collectionId={collectionId} setTutorialShow={setTutorialShow} setIntroTaskIndex={setIntroTaskIndex} setLevel={incrementLevel} setTaskLevel={incrementTaskLevel} stars={stars} earnedStars={earnedStars} id={tasks[taskLevel + 1]?.id} starId={tasks[taskLevel]?.id} onComplete={onComplete} isFromAttributes={isFromAttributes}/>
            }
                <BackButton />
                {task && task[level] && task[level].type && <ProgressAnimation />}
            </ImageBackground>
            }
        </View>
    )
}

export default observer(GameScreen);