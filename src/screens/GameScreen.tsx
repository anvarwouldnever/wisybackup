import { View, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import store from '../store/store';
import Game1Screen from './Games/Game1Screen';
import { useNavigation } from '@react-navigation/native';
import Game5Screen from './Games/Game5Screen';
import Game3Screen from './Games/Game3Screen';
import Game4Screen from './Games/Game4Screen';
import Game6Screen from './Games/Game6Screen';
import Game2Screen from './Games/Game2Screen';
import Game8Screen from './Games/Game8Screen';
import Game9Screen from './Games/Game9Screen';
import Game10Screen from './Games/Game10Screen';
import Game11Screen from './Games/Game11Screen';
import Game12Screen from './Games/Game12Screen';
import Game13Screen from './Games/Game13Screen';
import CongratulationsScreen from './CongratulationsScreen';
import BreakScreen from './BreakScreen';
import Game16Screen from './Games/Game16Screen';
import Game14Screen from './Games/Game14Screen';
import Game17Screen from './Games/Game17Screen';
import { observer } from 'mobx-react-lite';
import BackButton from './Game/BackButton';
import ProgressAnimation from './Game/ProgressAnimation';
import { gameStore } from './Games/store/gameStore';
import { useScale } from '../hooks/utils/useScale';

const GameScreen = ({ route }) => {

    const { onComplete, onCompleteTask, breaks, isFromBreak, isFromAttributes, categoryId, firstOpeningAction, availableSubCollections } = route?.params;
    const tasks = gameStore?.tasks;
    const navigation = useNavigation();
    const [taskLevel, setTaskLevel] = useState(0);
    const [isFrozen, setIsFrozen] = useState(false);
    const [level, setLevel] = useState(isFromAttributes ? 0 : tasks[taskLevel]?.current_task_id_index);
    const [stars, setStars] = useState(null);
    const [earnedStars, setEarnedStars] = useState(null);
    const [cameFromBreak, setCameFromBreak] = useState(isFromBreak);
    const [isBreak, setIsBreak] = useState(false);
    const [tutorialShow, setTutorialShow] = useState(isFromAttributes ? false : true);
    const [introTaskIndex, setIntroTaskIndex] = useState(isFromAttributes ? 0 : tasks[taskLevel]?.current_task_id_index);

    const task = tasks[taskLevel]?.tasks;

    const introAudio = tasks[taskLevel]?.introAudio;
    const introText = tasks[taskLevel]?.introText;
    const tutorials = tasks[taskLevel]?.tutorials;

    // console.log(task[level]?.type, task[level]?.content?.sub_type)
    
    const ifCameFromBreak = breaks?.find(b => b?.order === tasks[taskLevel]?.order && b?.parentCollectionId === gameStore.collectionId);
    const currentBreakContent = breaks?.find(b => b?.order === tasks[taskLevel]?.order && b?.parentCollectionId === gameStore.collectionId);    

    const incrementTaskLevel = () => {

        if (store.isFirstOpening) {
            firstOpeningAction();
            navigation.goBack()
            setIsFrozen(true)
            return
        }

        setTaskLevel(prev => {
            const nextLevel = prev + 1;
      
            if (nextLevel >= tasks?.length) {
                return navigation.goBack();
            }
        
            const isScheduledBreak = breaks?.find(
                b => b?.order === tasks[taskLevel]?.order &&
                     b?.parentCollectionId === gameStore.collectionId
            );            
        
            if (isScheduledBreak && !cameFromBreak && !isBreak) {
                setIsBreak(true);
                return prev;
            };
        
            if (cameFromBreak) {
                const isNextTaskAvailable = availableSubCollections?.includes(tasks[nextLevel]?.id)
                if (isNextTaskAvailable) {
                    setCameFromBreak(false);
                } else {
                    return navigation.goBack();
                }
            }

            return nextLevel;
        });
    };
      
    const incrementLevel = () => {
        setLevel(prev => {
            if (prev + 1 > tasks?.length) {
                console.log("Нет больше задач.");
                return null;
            }
            return null;
        });
    };

    useEffect(() => {
        if (!isFromAttributes) {
            setLevel(tasks[taskLevel]?.current_task_id_index)
        }

        if (isBreak) {
            if (!tutorialShow) {
                setTutorialShow(true);
            }
    
            setIsBreak(false);
        }
    }, [taskLevel]);

    const { s, vs } = useScale()

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
        return (
            <Game4Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} tasks={tasks} isFromAttributes={isFromAttributes}/>
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
            <Game12Screen tutorials={tutorials} tutorialShow={tutorialShow} setTutorialShow={setTutorialShow} level={level} introTaskIndex={introTaskIndex} introText={introText} introAudio={introAudio} setEarnedStars={setEarnedStars} setStars={setStars} data={task[level]} setLevel={setLevel} subCollectionId={tasks[taskLevel]?.id} onCompleteTask={onCompleteTask} tasks={tasks} isFromAttributes={isFromAttributes}/>
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

    return (
        <View style={{flex: 1 }}>
            {!isFromAttributes && (cameFromBreak || isBreak)? 
                <BreakScreen taskLevel={taskLevel} isFromAttributes={isFromAttributes} categoryId={categoryId} anyBreak={cameFromBreak? ifCameFromBreak : currentBreakContent} incrementTaskLevel={incrementTaskLevel}/>
            :
                isFrozen ? <ImageBackground source={require('../images/bgg.png')} style={{flex: 1, alignItems: 'center', paddingHorizontal: s(15), paddingVertical: s(12)}} />
            :
                <ImageBackground source={require('../images/bgg.png')} style={{ flex: 1, paddingHorizontal: s(15), paddingVertical: s(12) }}>
                    
                    <View style={{ flex: 1 }}>
                        {
                            task && task[level] && task[level].type ? (
                                task[level].type === 'voice_input' ?  
                                <RenderVoiceGame /> :
                                task[level]?.type === 'single_choice' && task[level].content.sub_type === 'with_image'?
                                <RenderWithImageGame /> :
                                task[level]?.type === 'single_choice' && task[level].content.sub_type === 'simple'?
                                <RenderSimpleGame /> :
                                task[level]?.type === 'single_choice' && task[level].content.sub_type === 'with_audio'?
                                <RenderWithAudio /> :
                                task[level]?.type === 'single_choice' && task[level].content.sub_type === 'with_title'?
                                <RenderWithTitleGame /> :
                                task[level]?.type === 'handwritten' && task[level].content.sub_type === 'simple'?
                                <RenderHandWrittenSimpleGame /> :
                                task[level]?.type === 'handwritten' && task[level].content.sub_type === 'repeat'?
                                <RenderHandWrittenRepeatGame /> :
                                task[level]?.type === 'handwritten' && task[level].content.sub_type === 'counting'?
                                <RenderHandWrittenCountingGame /> :
                                task[level]?.type === 'handwritten' && task[level].content.sub_type === 'word'?
                                <RenderHandWrittenWordGame /> :
                                task[level]?.type === 'object_matching' && (task[level]?.content?.sub_type === 'image_to_text' || task[level]?.content?.sub_type === 'image_to_image')?
                                <RenderObjectMatchingTextGame /> :
                                task[level]?.type === 'puzzle'?
                                <RenderPuzzleGame /> :
                                task[level]?.type === 'drag_and_drop' && (task[level]?.content?.sub_type === 'image_to_text' || task[level]?.content?.sub_type === 'image_to_image')?
                                <RenderDragAndDropGame /> :
                                task[level]?.type === 'text_single_choice' && task[level]?.content?.sub_type === 'with_image'?
                                <RenderTextSingleChoiceWithTitleImageGame /> :
                                task[level]?.type === 'text_single_choice' && task[level]?.content?.sub_type === 'simple'?
                                <RenderTextSingleChoiceSimpleGame /> : 
                                task[level]?.type === 'text_single_choice' && task[level]?.content?.sub_type === 'with_audio' &&
                                <RenderTextSingleChoiceWithAudioGame />
                            ) : <CongratulationsScreen setLevel2={setLevel} taskLevel={taskLevel} categoryId={categoryId} setTutorialShow={setTutorialShow} setIntroTaskIndex={setIntroTaskIndex} setLevel={incrementLevel} setTaskLevel={incrementTaskLevel} stars={stars} earnedStars={earnedStars} id={tasks[taskLevel + 1]?.id} starId={tasks[taskLevel]?.id} onComplete={onComplete} isFromAttributes={isFromAttributes}/>
                        }

                        <View style={{ position: 'absolute', top: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            
                            <BackButton setIsFrozen={setIsFrozen}/>

                            {task && task[level] && task[level].type && 
                                <ProgressAnimation task={task} level={level}/>
                            }

                        </View>

                    </View>

                </ImageBackground>
            }
        </View>
    )
}

export default observer(GameScreen);