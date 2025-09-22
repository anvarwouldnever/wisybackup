import { View, Platform, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import IsPointInsideAnswerRight from './IsPointInsideAnswerRight';

const RightImagesBlock = ({ images, mainContainerOffset, answered, lock, addCurvedLine, imageLayouts, setIsDrawing, setLines, lineStartX, lineStartY, lineEndX, lineEndY, imageRefs, answersLayouts, answers, answer, setWrongObject, addToAnswered }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const handleAddLine = (data) => {
        setIsDrawing(false);
        setLines((prev) => [...prev, data]);
    };

    return (
        <View style={{width: windowWidth * (80 / 800), height: windowHeight * (272 / 360), alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column'}}>
            {images?.length === 4 || images?.length === 3 ? null : (
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
                    {(images?.length === 5 || images?.length === 6 ? images.slice(3) : []).map((item, index) => {

                        const gesture = Gesture.Pan()
                        .onBegin((event) => {
                            if (lock || answered.includes(item.key)) return;
                            runOnJS(setIsDrawing)(true);
                            lineStartX.value = event.absoluteX - 30;
                            lineStartY.value = event.absoluteY - mainContainerOffset.top;
                            lineEndX.value = event.absoluteX - 30;
                            lineEndY.value = event.absoluteY - mainContainerOffset.top;
                        })
                        .onUpdate((event) => {
                            if (lock || answered.includes(item.key)) return;
                            lineEndX.value = event.absoluteX - 30
                            lineEndY.value = event.absoluteY - mainContainerOffset.top
                        })
                        .onEnd((event) => {
                            if (lock || answered.includes(item.key)) return;
                            let { inside, newX, newY, targetIndex, color } = IsPointInsideAnswerRight(lineEndX.value, lineEndY.value, item.key, item?.id, mainContainerOffset, answersLayouts, answers, answered, answer, setWrongObject, addToAnswered);
                        
                            if (inside) {

                                const answer = imageLayouts.value.find(a => a.key === item.key);
                                if (answer) {
                                    lineStartX.value = answer.x - 30; // Левая граница ответа
                                    lineStartY.value = answer.y + answer.height / 2 - mainContainerOffset.top;
                                }
                        
                                runOnJS(handleAddLine)({
                                    x1: lineStartX.value,
                                    y1: lineStartY.value,
                                    x2: newX,
                                    y2: newY,
                                    color
                                });

                            } else {
                                lineStartX.value = 0;
                                lineStartY.value = 0;
                                lineEndX.value = 0;
                                lineEndY.value = 0;
                            }
                        });

                        return Platform.isPad? 
                        (
                            <GestureDetector key={item.key} gesture={gesture}>
                                <View style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key)? '#ADD64D' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                    <View ref={(view) => imageRefs.current.set(item.key, view)} onLayout={() => {}} style={{ borderRadius: 8, width: windowWidth * (80 / 800), height: windowWidth * (80 / 800), backgroundColor: answered.includes(item.key)? '#ADD64D4D' : 'white', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: item?.image }} style={{ width: windowWidth * (64 / 800), height: windowWidth * (64 / 800), resizeMode: 'contain' }}/>
                                    </View>
                                </View>
                            </GestureDetector>
                        )
                        :
                        (
                            <GestureDetector key={item.key} gesture={gesture}>
                                <View style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key)? '#ADD64D' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                    <View ref={(view) => imageRefs.current.set(item.key, view)} onLayout={() => {}} style={{ borderRadius: 8, width: windowWidth * (80 / 800), height: windowHeight * (80 / 360), backgroundColor: answered.includes(item.key)? '#ADD64D4D' : 'white', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: item?.image }} style={{ width: windowWidth * (64 / 800), height: windowHeight * (64 / 360), resizeMode: 'contain' }}/>
                                    </View>
                                </View>
                            </GestureDetector>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

export default RightImagesBlock