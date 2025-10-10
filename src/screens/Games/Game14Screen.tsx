import React, { useState, useRef, useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, { useSharedValue, ZoomInEasyDown } from "react-native-reanimated";
import { toJS } from "mobx";
import useTimer from "../../hooks/useTimer";
import store from "../../store/store";
import * as Haptics from 'expo-haptics'
import SkipButton from "./components/SkipButton";
import TutorialOverlay from "./components/TutorialOverlay";
import WisyHint from "./components/WisyHint";
import OverlayHint from "./components/OverlayHint";
import Lines from "./Game14/Lines";
import { useIntroSequence } from "../../hooks/useIntroSequence";
import { useObjectMatchingAnswer } from "../../hooks/useObjectMatchingAnswerLogic";
import LeftImagesBlock from "./Game14/LeftImagesBlock";
import AnswersBlock from "./Game14/AnswersBlock";
import RightImagesBlock from "./Game14/RightImagesBlock";
import { useScale } from "../../hooks/useScale";

const Game14Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {
    
    const [lines, setLines] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [answered, setAnswered] = useState([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);  
    const [wrongObject, setWrongObject] = useState();  
    
    const lineStartX = useSharedValue(0);
    const lineStartY = useSharedValue(0);
    const lineEndX = useSharedValue(0);
    const lineEndY = useSharedValue(0);

    const { s, vs } = useScale()

    const offsets = { vertical: s(12), horizontal: s(15) };

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [lock, setLock] = useState(false);   
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const imageRefs = useRef(new Map());
    const imageLayouts = useSharedValue([]);

    const answersRefs = useRef(new Map());
    const answersLayouts = useSharedValue([]);

    const { answer, isActive } = useObjectMatchingAnswer({ data, subCollectionId, onCompleteTask, isFromAttributes, levelHandlers: { setLevel, setStars, setEarnedStars }, uiHandlers: { setText, setLock, setWisySpeaking, setThinking, setLines, setWrongObject }, attemptState: { attempt, setAttempt }});

    useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });

    const { start, reset } = useTimer();

    useEffect(() => {
        isActive.current = true;
        start();
                             
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    const images = toJS(data?.content?.pairs ?? []).map((item, index) => ({
        ...item,
        key: String(index + 1),
    }));
    
    useEffect(() => {
        if (answers?.length === 0) { // Только первый раз перемешиваем
            setAnswers(
                images
                    .map((item) => ({ ...item.target_pair, key: item.key }))
                    .sort(() => Math.random() - 0.5)
            );
        }
    }, [images]);

    useEffect(() => {
        setTimeout(() => {
            const layouts = [];
            imageRefs.current.forEach((view, key) => {
                if (view) {
                    view.measure((x, y, width, height, pageX, pageY) => {
                        layouts.push({ key, x: pageX, y: pageY, width, height });
                        if (layouts.length === images.length) {
                            imageLayouts.value = layouts;
                        }
                    });
                }
            });
        }, 500);
    }, [images]);

    useEffect(() => {
        if (answered.length === images.length) {
            answer({ answer: true })
        }
    }, [answered])

    useEffect(() => {
        setTimeout(() => {
            const layouts = [];
            answersRefs.current?.forEach((view, key) => {
                if (view) {
                    view.measure((x, y, width, height, pageX, pageY) => {
                        layouts.push({ key, x: pageX, y: pageY, width, height });
                        if (layouts.length === answers.length) {
                            answersLayouts.value = layouts;
                        }
                    });
                }
            });
        }, 1000);
    }, [answers]);
    
    const addToAnswered = (key) => {
        setAnswered((prev) => [...prev, key]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    };
    
    return (
        <View style={{  width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Lines lines={lines} isDrawing={isDrawing} lineEndX={lineEndX} lineEndY={lineEndY} lineStartX={lineStartX} lineStartY={lineStartY} />

            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && 

                <Animated.View entering={ZoomInEasyDown} style={{width: s(210), height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute'}}>
                    
                    <LeftImagesBlock images={images} offsets={offsets} answered={answered} lock={lock} imageLayouts={imageLayouts} setIsDrawing={setIsDrawing} setLines={setLines} lineStartX={lineStartX} lineStartY={lineStartY} lineEndX={lineEndX} lineEndY={lineEndY} imageRefs={imageRefs} answersLayouts={answersLayouts} answers={answers} answer={answer} setWrongObject={setWrongObject} addToAnswered={addToAnswered}/>

                    <AnswersBlock images={images} offsets={offsets} answered={answered} lock={lock} imageLayouts={imageLayouts} setIsDrawing={setIsDrawing} setLines={setLines} lineStartX={lineStartX} lineStartY={lineStartY} lineEndX={lineEndX} lineEndY={lineEndY} answersRefs={answersRefs} answersLayouts={answersLayouts} answers={answers} answer={answer} setWrongObject={setWrongObject} addToAnswered={addToAnswered} wrongObject={wrongObject} />

                    {images?.length === 4 || images?.length === 3 || images?.length === 2 || images?.length === 1 ? null : <RightImagesBlock images={images} offsets={offsets} answered={answered} lock={lock} imageLayouts={imageLayouts} setIsDrawing={setIsDrawing} setLines={setLines} lineStartX={lineStartX} lineStartY={lineStartY} lineEndX={lineEndX} lineEndY={lineEndY} imageRefs={imageRefs} answersLayouts={answersLayouts} answers={answers} answer={answer} setWrongObject={setWrongObject} addToAnswered={addToAnswered} /> }

                </Animated.View>

            }   
            
            <OverlayHint visible={store.isBlacked}>
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            </OverlayHint>

            {!store?.isBlacked && (
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            )}
            
            <SkipButton visible={tutorialShow && tutorials?.length > 0} showPaw={store?.isFirstOpening}
                onSkip={() => {
                    if (store.isFirstOpening) {
                        store.setIsFirstOpening(false)
                    }
                    setTutorialShow(false)
                }}
            />
        </View>
    );
};

export default Game14Screen;