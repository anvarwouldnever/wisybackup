import { View, Image, Platform, useWindowDimensions } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import IsPointInsideAnswerLeft from './IsPointInsideAnswerLeft';

const LeftImagesBlock = ({ images, mainContainerOffset, answered, lock, addCurvedLine, imageLayouts, setIsDrawing, setLines, lineStartX, lineStartY, lineEndX, lineEndY, imageRefs, answersLayouts, answers, answer, setWrongObject, addToAnswered }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    
    const firstImages = (images.length === 4 || images.length === 3)
    ? images
    : (images.length === 5 || images.length === 6)
      ? images.slice(0, 3)
      : [];

    return (
        <View style={{width: windowWidth * (80 / 800), height: windowHeight * (312 / 360), alignItems: 'center', gap: images.length === 4 || images.length === 3 ? 12 : 16, justifyContent: 'center', flexDirection: 'column'}}>
            {firstImages?.map((item, index) => {

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
                    let { inside, newX, newY, targetIndex, color } = IsPointInsideAnswerLeft(lineEndX.value, lineEndY.value, item.key, item?.id, mainContainerOffset, answersLayouts, answers, answered, answer, setWrongObject, addToAnswered );
                
                    if (inside) {
                        
                        const startObject = imageLayouts.value.find(a => a.key === item.key);
                        if (startObject) {
                            lineStartX.value = startObject.x + startObject.width - 30;
                            lineStartY.value = startObject.y + startObject.height / 2 - mainContainerOffset.top;
                        }
                
                        runOnJS(addCurvedLine)({ x1: lineStartX.value, y1: lineStartY.value, x2: newX, y2: newY, color: color }, setIsDrawing, setLines);

                    } else {
                        lineStartX.value = 0;
                        lineStartY.value = 0;
                        lineEndX.value = 0;
                        lineEndY.value = 0;
                    }
                });

                return Platform.isPad? (
                    <GestureDetector key={item?.key} gesture={gesture}>
                        <View style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key) && images?.length != 4 && images?.length != 3 ? '#ADD64D' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                            <View ref={(view) => imageRefs.current.set(item.key, view)} onLayout={() => {}} style={{ borderRadius: 8, width: images?.length === 3? windowWidth * (96 / 800) : images?.length === 4? windowWidth * (69 / 800) :  windowWidth * (80 / 800), height: images?.length === 3? windowWidth * (96 / 800) : images?.length === 4? windowWidth * (69 / 800) : windowWidth * (80 / 800), backgroundColor: answered.includes(item.key) && images?.length != 4 && images?.length != 3? '#ADD64D4D' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={{ uri: item?.image }} style={{ width: images.length === 3? windowWidth * (80 / 800) : windowWidth * (64 / 800), height: images.length === 3? windowHeight * (81 / 360) : windowHeight * (64 / 360), resizeMode: 'contain' }}/>
                            </View>
                        </View>
                    </GestureDetector>
                ) 
                    : 
                (
                    <GestureDetector key={item.key} gesture={gesture}>
                        <View style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key) && images?.length != 4 && images?.length != 3 ? '#ADD64D' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                            <View ref={(view) => imageRefs.current.set(item.key, view)} onLayout={() => {}} style={{ borderRadius: 8, width: images?.length === 3? windowWidth * (96 / 800) : images?.length === 4? windowWidth * (69 / 800) :  windowWidth * (80 / 800), height: images?.length === 3? windowHeight * (96 / 360) : images?.length === 4? windowHeight * (69 / 360) : windowHeight * (80 / 360), backgroundColor: answered.includes(item.key) && images?.length != 4 && images?.length != 3? '#ADD64D4D' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={{ uri: item?.image }} style={{ width: images.length === 3? windowWidth * (80 / 800) : windowWidth * (64 / 800), height: images.length === 3? windowHeight * (81 / 360) : windowHeight * (64 / 360), resizeMode: 'contain' }}/>
                            </View>
                        </View>
                    </GestureDetector>
                ) 
            })}
        </View>
    )
}

export default LeftImagesBlock;