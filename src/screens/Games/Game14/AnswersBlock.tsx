import { View, Text, Platform, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { playSound } from '../../../hooks/usePlayBase64Audio'
import IsPointInsideImage from './IsPointInsideImage'

import speaker from '../../../images/tabler_speakerphone.png'
import black from '../../../images/tabler_speakerphone2.png';
import blackRed from '../../../images/darkRedSpeaker.png'

const AnswersBlock = ({ images, mainContainerOffset, answered, lock, addCurvedLine, imageLayouts, setIsDrawing, setLines, lineStartX, lineStartY, lineEndX, lineEndY, answersRefs, answersLayouts, answers, answer, setWrongObject, addToAnswered, wrongObject }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <View style={{width: windowWidth * (160 / 800), height: windowHeight * (300 / 360), alignItems: 'center', justifyContent: 'center', gap: images.length === 4 || images.length === 3 ? 12 : 16, flexDirection: 'column', overflow: 'visible'}}>
            {answers.map((item, index) => {

                const type = item?.text ? 'text' : 'image'

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
                        const { inside, newX, newY, targetIndex, color } = IsPointInsideImage(lineEndX.value, lineEndY.value, item?.key, mainContainerOffset, imageLayouts, answered, answer, setWrongObject, addToAnswered, images);
                        
                        if (inside) {
                            
                            const answer = answersLayouts.value.find(a => a.key === item.key);
                            if (answer) {
                                const totalImages = imageLayouts.value.length;
                                let rightSideThreshold = 0;
                    
                                if (totalImages === 5) {
                                    rightSideThreshold = 2;
                                } else if (totalImages === 6) {
                                    rightSideThreshold = 3;
                                }
                    
                                const isTargetRightSide = targetIndex >= totalImages - rightSideThreshold;
                    
                                lineStartX.value = isTargetRightSide ? answer.x + answer.width - 30 : answer.x - 30;
                                lineStartY.value = answer.y + answer.height / 2 - mainContainerOffset.top;
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
                        <GestureDetector key={item.key} gesture={gesture}>
                            {type == 'text'? 
                                <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{width: 'auto', height: windowWidth * (40 / 800), backgroundColor: 'transparent', borderRadius: 100, flexDirection: 'row', gap: 5, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                    <View style={{minWidth: windowWidth * (110 / 800), maxWidth: 'auto', height: windowWidth * (40 / 800), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : 'white', borderTopLeftRadius: 100, borderBottomLeftRadius: 100, justifyContent: 'center', paddingHorizontal: windowWidth * (16 / 800) }}>
                                        <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (12 / 360), textAlign: 'center'}}>{item?.text}</Text>
                                    </View>
                                    <TouchableOpacity onPress={lock? () => {return} : () => playSound(item?.speech)} style={{width: windowWidth * (46 / 800), height: windowWidth * (40 / 800), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : '#B3ABDB', borderTopRightRadius: 100, borderBottomRightRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={answered.includes(item.key)? black : wrongObject == item.key? blackRed : speaker} style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), resizeMode: 'contain'}}/>
                                    </TouchableOpacity>
                                </View>
                            :
                            type == 'image' &&
                            <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#D81616' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                <View style={{width: images.length === 4? windowWidth * (69 / 800) : windowWidth * (96 / 800), height: images.length === 4? windowWidth * (69 / 800) : windowWidth * (96 / 800), backgroundColor: answered.includes(item.key)? '#ADD64D4D' : wrongObject == item.key? '#D816164D' : 'white', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={{ uri: item?.image }} style={{width: windowWidth * (80 / 800), height: windowWidth * (81 / 800)}}/>
                                </View> 
                            </View>   
                            }
                        </GestureDetector>
                    ) 
                        :
                    (
                        <GestureDetector key={item.key} gesture={gesture}>
                            {type == 'text'? 
                                <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{width: 'auto', height: windowHeight * (40 / 360), backgroundColor: 'transparent', borderRadius: 100, flexDirection: 'row', gap: 5, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                    <View style={{minWidth: windowWidth * (110 / 800), maxWidth: 'auto', height: windowWidth * (40 / 800), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : 'white', borderTopLeftRadius: 100, borderBottomLeftRadius: 100, justifyContent: 'center', paddingHorizontal: windowWidth * (16 / 800) }}>
                                        <Text style={{color: '#222222', fontWeight: '600', fontSize: windowWidth * (12 / 800), textAlign: 'center'}}>{item?.text}</Text>
                                    </View>
                                    <TouchableOpacity onPress={lock? () => {return} : () => playSound(item?.speech)} style={{width: windowWidth * (46 / 800), height: windowHeight * (40 / 360), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : '#B3ABDB', borderTopRightRadius: 100, borderBottomRightRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={answered.includes(item.key)? black : wrongObject == item.key? blackRed : speaker} style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), resizeMode: 'contain'}}/>
                                    </TouchableOpacity>
                                </View>
                            :
                            type == 'image' &&
                            <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#D81616' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                <View style={{width: images.length === 4? windowWidth * (69 / 800) : windowWidth * (96 / 800), height: images.length === 4? windowHeight * (69 / 360) : windowHeight * (96 / 360), backgroundColor: answered.includes(item.key)? '#ADD64D4D' : wrongObject == item.key? '#D816164D' : 'white', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={{ uri: item?.image }} style={{width: windowWidth * (80 / 800), height: windowHeight * (81 / 360)}}/>
                                </View> 
                            </View>   
                            }
                        </GestureDetector>
                    )
            })}
        </View>
    )
}

export default AnswersBlock;