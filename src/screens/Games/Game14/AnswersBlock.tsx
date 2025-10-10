import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { playSound } from '../../../hooks/usePlayBase64Audio'
import IsPointInsideImage from './IsPointInsideImage'
import { useScale } from '../../../hooks/useScale'

const AnswersBlock = ({ images, offsets, answered, lock, imageLayouts, setIsDrawing, setLines, lineStartX, lineStartY, lineEndX, lineEndY, answersRefs, answersLayouts, answers, answer, setWrongObject, addToAnswered, wrongObject }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const handleAddLine = (data) => {
        setIsDrawing(false);
        setLines((prev) => [...prev, data]);
    };

    const { s, vs } = useScale()

    return (
        <View style={{width: 'auto', height: 'auto', alignItems: 'center', justifyContent: 'center', gap: images?.length === 4 || images?.length === 3 ? s(4) : s(6), flexDirection: 'column', overflow: 'visible'}}>
            
            {answers?.map((item, index) => {

                const type = item?.text ? 'text' : 'image'

                const gesture = Gesture.Pan()
                    .onBegin((event) => {
                        if (lock || answered.includes(item.key)) return;
                        runOnJS(setIsDrawing)(true);
                        lineStartX.value = event.absoluteX - offsets.horizontal;
                        lineStartY.value = event.absoluteY - offsets.vertical;
                        lineEndX.value = event.absoluteX - offsets.horizontal;
                        lineEndY.value = event.absoluteY - offsets.vertical;
                    })
                    .onUpdate((event) => {
                        if (lock || answered.includes(item.key)) return;
                        lineEndX.value = event.absoluteX - offsets.horizontal
                        lineEndY.value = event.absoluteY - offsets.vertical
                    })
                    .onEnd((event) => {
                        if (lock || answered.includes(item.key)) return;
                        const { inside, newX, newY, targetIndex, color } = IsPointInsideImage(lineEndX.value, lineEndY.value, item?.key, offsets, imageLayouts, answered, answer, setWrongObject, addToAnswered, images);
                        
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
                    
                                lineStartX.value = isTargetRightSide ? answer.x + answer.width - offsets.horizontal : answer.x - offsets.horizontal;
                                lineStartY.value = answer.y + answer.height / 2 - offsets.vertical;
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
                
                    return (
                        <GestureDetector key={item?.key} gesture={gesture}>
                            {type == 'text' ? 
                                <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{width: 'auto', height: 'auto', justifyContent: 'center', backgroundColor: 'transparent', borderRadius: 100, flexDirection: 'row', gap: 5, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                    <View style={{ minWidth: s(60), maxWidth: s(80), height: s(18), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : 'white', borderTopLeftRadius: 100, borderBottomLeftRadius: 100, justifyContent: 'center', paddingHorizontal: s(8) }}>
                                        <Text style={{color: '#222222', fontWeight: '600', fontSize: s(5), textAlign: 'center', lineHeight: s(7)}}>{item?.text}</Text>
                                    </View>
                                    <TouchableOpacity onPress={lock? () => {return} : () => playSound(item?.speech)} style={{width: s(21), height: s(18), backgroundColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#EA6E6E' : '#B3ABDB', borderTopRightRadius: 100, borderBottomRightRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={answered.includes(item.key)? require('../../../images/tabler_speakerphone2.png') : wrongObject == item.key? require('../../../images/darkRedSpeaker.png') : require('../../../images/tabler_speakerphone.png')} style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), resizeMode: 'contain'}}/>
                                    </TouchableOpacity>
                                </View>
                            :
                            type == 'image' &&
                                <View ref={(view) => answersRefs.current.set(item.key, view)} onLayout={() => {}} style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item.key)? '#ADD64D' : wrongObject == item.key? '#D81616' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                                    <View style={{width: 'auto', height: 'auto', backgroundColor: answered.includes(item.key)? '#ADD64D4D' : wrongObject == item.key? '#D816164D' : 'white', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Image source={{ uri: item?.image }} style={{ width: s(32), height: s(30), resizeMode: 'contain', margin: s(5) }}/>
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