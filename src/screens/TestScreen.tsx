import React, { useState, useRef, useEffect } from "react";
import { Button, TouchableOpacity, Text, View, useWindowDimensions } from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedProps, runOnJS } from "react-native-reanimated";

const AnimatedLine = Animated.createAnimatedComponent(Line);

const TestScreen = () => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    // const [curve, setCurve] = useState<number>(1)    

    const lineStartX = useSharedValue(0);
    const lineStartY = useSharedValue(0);
    const lineEndX = useSharedValue(0);
    const lineEndY = useSharedValue(0);

    const mainContainerOffset = { top: 24 };

    const animatedProps = useAnimatedProps(() => ({
        x1: lineStartX.value,
        y1: lineStartY.value,
        x2: lineEndX.value,
        y2: lineEndY.value,
    }));

    
    const answers = [
        { key: "1" },
        { key: "2" },
        { key: "3" },
        { key: "4" },
        { key: "5" },
    ];

    const images = [
        { key: "1" },
        { key: "2" },
        { key: "3" },
        { key: "4" },
        { key: "5" },
        { key: "6" },
    ];

    const addCurvedLine = (data) => {
        setIsDrawing(false);
        setLines((prev) => [...prev, data]);
    };

    const Lines = () => {
        return (
            <Svg
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            >
                {lines.map((line, index) => {
                    const dx = line.x2 - line.x1;
                    const dy = line.y2 - line.y1;
    
                    // Рассчитываем контрольные точки для кривой Безье
                    const controlX1 = line.x1 + dx * 0.50; // Первая контрольная точка на 25% от начала
                    const controlY1 = line.y1;
                    const controlX2 = line.x2 - dx * 0.50; // Вторая контрольная точка на 25% от конца
                    const controlY2 = line.y2;
    
                    const pathData = `M ${line.x1},${line.y1} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${line.x2},${line.y2}`;
    
                    return <Path key={index} d={pathData} stroke="#504297" strokeWidth="2" fill="none" />;
                })}
    
                {isDrawing && <AnimatedLine onResponderMove={(_) => {}} animatedProps={animatedProps} stroke={"#504297"} strokeWidth="2" />}
            </Svg>
        );
    };
    
    const imageRefs = useRef(new Map()); // Для хранения ref каждого элемента
    const imageLayouts = useSharedValue([]);

    const answersRefs = useRef(new Map()); // Храним ref для каждого элемента
    const answersLayouts = useSharedValue([]);

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
        }, 200);
    }, [images]);

    useEffect(() => {
        setTimeout(() => {
            const layouts = [];
            answersRefs.current.forEach((view, key) => {
                if (view) {
                    view.measure((x, y, width, height, pageX, pageY) => {
                        layouts.push({ key, x: pageX, y: pageY, width, height });
                        if (layouts.length === answers.length) {
                            answersLayouts.value = layouts;
                        }
                        // console.log(layouts)
                    });
                }
            });
        }, 200);
    }, [answers]);

    const isPointInsideImage = (x, y) => {
        'worklet';
        const adjustedX = x + 30; // Учитываем смещение по X
        const adjustedY = y + mainContainerOffset.top; // Учитываем смещение по Y
        const totalImages = imageLayouts.value.length;
    
        let rightSideThreshold = 0; // Сколько последних элементов считать правыми
    
        if (totalImages === 5) {
            rightSideThreshold = 2;
        } else if (totalImages === 6) {
            rightSideThreshold = 3;
        } else if (totalImages <= 4) {
            rightSideThreshold = 0; // Нет правых элементов
        }
    
        for (let i = 0; i < totalImages; i++) {
            const image = imageLayouts.value[i];
    
            if (
                adjustedX >= image.x &&
                adjustedX <= image.x + image.width &&
                adjustedY >= image.y &&
                adjustedY <= image.y + image.height
            ) {
                const isRightSide = i >= totalImages - rightSideThreshold; // Проверяем, правый ли элемент
    
                return {
                    inside: true,
                    newX: isRightSide ? image.x - 30 : image.x + image.width - 30, 
                    newY: image.y + image.height / 2 - mainContainerOffset.top,
                    targetIndex: i
                };
            }
        }
        return { inside: false };
    };
    
    const isPointInsideAnsweRight = (x, y) => {
        'worklet';
        const adjustedX = x + 30; // Учитываем смещение по X
        const adjustedY = y + mainContainerOffset.top; // Учитываем смещение по Y
    
        for (let i = 0; i < answersLayouts.value.length; i++) {
            const answer = answersLayouts.value[i];
    
            if (
                adjustedX >= answer.x &&
                adjustedX <= answer.x + answer.width &&
                adjustedY >= answer.y &&
                adjustedY <= answer.y + answer.height
            ) {
                return {
                    inside: true,
                    newX: answer.x + answer.width - 30, // Правая граница объекта
                    newY: answer.y + answer.height / 2 - mainContainerOffset.top,
                    targetIndex: i
                };
            }
        }
        return { inside: false };
    };

    const isPointInsideAnswerLeft = (x, y) => {
        'worklet';
        const adjustedX = x + 30; // Учитываем смещение по X
        const adjustedY = y + mainContainerOffset.top; // Учитываем смещение по Y
    
        for (let i = 0; i < answersLayouts.value.length; i++) {
            const answer = answersLayouts.value[i];
    
            if (
                adjustedX >= answer.x &&
                adjustedX <= answer.x + answer.width &&
                adjustedY >= answer.y &&
                adjustedY <= answer.y + answer.height
            ) {
                return {
                    inside: true,
                    newX: answer.x - 30, // Левая граница объекта
                    newY: answer.y + answer.height / 2 - mainContainerOffset.top,
                    targetIndex: i
                };
            }
        }
        return { inside: false };
    };

    return (
        <View style={{top: mainContainerOffset.top, width: windowWidth - 60, height: windowHeight - 60, position: "absolute", alignItems: "center"}}>
            <Lines />

            <View style={{width: windowWidth * (448 / 800), height: windowHeight * (300 / 360), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute'}}>
                <View style={{width: windowWidth * (80 / 800), height: windowHeight * (312 / 360), alignItems: 'center', gap: images.length === 4 || images.length === 3 ? 12 : 16, justifyContent: 'center', flexDirection: 'column'}}>
                    {(images.length === 4 || images.length === 3 ? images : images.length === 5 || images.length === 6 ? images.slice(0, 3) : []).map((item, index) => {
                        
                        const gesture = Gesture.Pan()
                        .onBegin((event) => {
                            runOnJS(setIsDrawing)(true);
                            lineStartX.value = event.absoluteX - 30;
                            lineStartY.value = event.absoluteY - mainContainerOffset.top;
                            lineEndX.value = event.absoluteX - 30;
                            lineEndY.value = event.absoluteY - mainContainerOffset.top;
                        })
                        .onUpdate((event) => {
                            lineEndX.value = event.absoluteX - 30
                            lineEndY.value = event.absoluteY - mainContainerOffset.top
                        })
                        .onEnd((event) => {
                            let { inside, newX, newY, targetIndex } = isPointInsideAnswerLeft(lineEndX.value, lineEndY.value);
                        
                            if (inside) {
                                const startObject = imageLayouts.value.find(a => a.key === item.key);
                                if (startObject) {
                                    lineStartX.value = startObject.x + startObject.width - 30; // Правая граница начального объекта
                                    lineStartY.value = startObject.y + startObject.height / 2 - mainContainerOffset.top;
                                }
                        
                                runOnJS(addCurvedLine)({
                                    x1: lineStartX.value,
                                    y1: lineStartY.value,
                                    x2: newX,
                                    y2: newY,
                                });
                            } else {
                                lineStartX.value = 0;
                                lineStartY.value = 0;
                                lineEndX.value = 0;
                                lineEndY.value = 0;
                            }
                        });

                        return (
                            <GestureDetector key={item.key} gesture={gesture}>
                                <View 
                                    ref={(view) => imageRefs.current.set(item.key, view)}
                                    onLayout={() => {}}
                                    key={index} 
                                    style={{ 
                                        width: windowWidth * (80 / 800), 
                                        height: windowHeight * (80 / 360), 
                                        backgroundColor: 'white', 
                                        borderRadius: 10 
                                    }}
                                />
                            </GestureDetector>
                        )
                    })}
                </View>
                <View style={{width: windowWidth * (160 / 800), height: windowHeight * (300 / 360), alignItems: 'center', justifyContent: 'center', gap: images.length === 4 || images.length === 3 ? 12 : 16, flexDirection: 'column', overflow: 'visible'}}>
                    {answers.map((item, index) => {
        
                        const gesture = Gesture.Pan()
                            .onBegin((event) => {
                                runOnJS(setIsDrawing)(true);
                                lineStartX.value = event.absoluteX - 30;
                                lineStartY.value = event.absoluteY - mainContainerOffset.top;
                                lineEndX.value = event.absoluteX - 30;
                                lineEndY.value = event.absoluteY - mainContainerOffset.top;
                            })
                            .onUpdate((event) => {
                                lineEndX.value = event.absoluteX - 30
                                lineEndY.value = event.absoluteY - mainContainerOffset.top
                            })
                            .onEnd((event) => {
                                const { inside, newX, newY, targetIndex } = isPointInsideImage(lineEndX.value, lineEndY.value);
                                
                                if (inside) {
                                    const answer = answersLayouts.value.find(a => a.key === item.key);
                                    if (answer) {
                                        // Определяем, является ли конечный квадрат правым
                                        const totalImages = imageLayouts.value.length;
                                        let rightSideThreshold = 0;
                            
                                        if (totalImages === 5) {
                                            rightSideThreshold = 2;
                                        } else if (totalImages === 6) {
                                            rightSideThreshold = 3;
                                        }
                            
                                        const isTargetRightSide = targetIndex >= totalImages - rightSideThreshold;
                            
                                        // Устанавливаем начальную точку в зависимости от конечного квадрата
                                        lineStartX.value = isTargetRightSide ? answer.x + answer.width - 30 : answer.x - 30;
                                        lineStartY.value = answer.y + answer.height / 2 - mainContainerOffset.top;
                                    }
                            
                                    runOnJS(addCurvedLine)({
                                        x1: lineStartX.value,
                                        y1: lineStartY.value,
                                        x2: newX,
                                        y2: newY,
                                    });
                                } else {
                                    lineStartX.value = 0;
                                    lineStartY.value = 0;
                                    lineEndX.value = 0;
                                    lineEndY.value = 0;
                                }
                            });
                            
                        
                            return (
                                <GestureDetector key={item.key} gesture={gesture}>
                                    <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{width: windowWidth * (160 / 800), height: windowHeight * (40 / 360), backgroundColor: 'white', borderRadius: 10}}>
                                                        
                                    </View>
                                </GestureDetector>
                            )
                    })}
                </View>
                {images.length === 4 || images.length === 3 ? null : <View style={{width: windowWidth * (80 / 800), height: windowHeight * (272 / 360), alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column'}}>
                    {images.length === 4 || images.length === 3 ? null : (
                        <View 
                            style={{ 
                                width: windowWidth * (80 / 800), 
                                height: windowHeight * (272 / 360),
                                justifyContent: 'center',
                                alignItems: 'center', 
                                gap: 16, 
                                flexDirection: 'column' 
                            }}
                        >
                            {(images.length === 5 || images.length === 6 ? images.slice(3) : []).map((item, index) => {

                                const gesture = Gesture.Pan()
                                .onBegin((event) => {
                                    runOnJS(setIsDrawing)(true);
                                    lineStartX.value = event.absoluteX - 30;
                                    lineStartY.value = event.absoluteY - mainContainerOffset.top;
                                    lineEndX.value = event.absoluteX - 30;
                                    lineEndY.value = event.absoluteY - mainContainerOffset.top;
                                })
                                .onUpdate((event) => {
                                    lineEndX.value = event.absoluteX - 30
                                    lineEndY.value = event.absoluteY - mainContainerOffset.top
                                })
                                .onEnd((event) => {
                                    let { inside, newX, newY, targetIndex } = isPointInsideAnsweRight(lineEndX.value, lineEndY.value);
                                
                                    if (inside) {
                                        const answer = imageLayouts.value.find(a => a.key === item.key);
                                        if (answer) {
                                            lineStartX.value = answer.x - 30; // Левая граница ответа
                                            lineStartY.value = answer.y + answer.height / 2 - mainContainerOffset.top;
                                        }
                                
                                        runOnJS(addCurvedLine)({
                                            x1: lineStartX.value,
                                            y1: lineStartY.value,
                                            x2: newX,
                                            y2: newY,
                                        });
                                    } else {
                                        lineStartX.value = 0;
                                        lineStartY.value = 0;
                                        lineEndX.value = 0;
                                        lineEndY.value = 0;
                                    }
                                });

                                return (
                                    <GestureDetector key={item.key} gesture={gesture}>
                                        <View 
                                            ref={(view) => imageRefs.current.set(item.key, view)}
                                            onLayout={() => {}}
                                            key={index} 
                                            style={{ 
                                                width: windowWidth * (80 / 800), 
                                                height: windowHeight * (80 / 360), 
                                                backgroundColor: 'white', 
                                                borderRadius: 10 
                                            }}
                                        />
                                    </GestureDetector>
                                )
                            })}
                        </View>
                    )}
                </View>}
            </View>

            {/* <View style={{position: 'absolute', left: 30, top: 150}}>
                <Button title="Добавить" onPress={() => setCurve(prev => prev + 0.1)}/>
                <Text style={{color: 'black'}}>
                    текущее: {curve.toFixed(2)}
                </Text>
                <Button title="Убавить" onPress={() => setCurve(prev => prev - 0.1)}/>
            </View> */}

            {/* <Lines /> */}
        </View>
    );
};

export default TestScreen;