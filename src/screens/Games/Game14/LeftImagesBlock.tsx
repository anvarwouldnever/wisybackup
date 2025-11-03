import { View, Image } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import IsPointInsideAnswerLeft from './IsPointInsideAnswerLeft';
import { useScale } from '../../../hooks/utils/useScale';

const LeftImagesBlock = ({ images, offsets, answered, lock, imageLayouts, setIsDrawing, setLines, lineStartX, lineStartY, lineEndX, lineEndY, imageRefs, answersLayouts, answers, answer, setWrongObject, addToAnswered }) => {

    const { s, vs } = useScale()
    
    const firstImages = images.slice(0, 3)

    const handleAddLine = (data) => {
        setIsDrawing(false);
        setLines((prev) => [...prev, data]);
    };

    return (
        <View style={{width: 'auto', height: 'auto', alignItems: 'center', gap: images?.length === 3 ? s(4) : s(6), justifyContent: 'center', flexDirection: 'column'}}>
            
            {firstImages?.map((item, index) => {

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
                    let { inside, newX, newY, targetIndex, color } = IsPointInsideAnswerLeft(lineEndX.value, lineEndY.value, item?.key, item?.id, offsets, answersLayouts, answers, answered, answer, setWrongObject, addToAnswered );

                    
                    
                    if (inside) {
                        
                        const startObject = imageLayouts.value.find(a => a.key === item.key);

                        if (startObject) {
                            lineStartX.value = startObject.x + startObject.width - offsets.horizontal;
                            lineStartY.value = startObject.y + startObject.height / 2 - offsets.vertical;
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
                        
                        <View style={{backgroundColor: 'white', borderRadius: 10, borderColor: answered.includes(item?.key) && images.length != 3 ? '#ADD64D' : 'white', borderWidth: 2, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                            
                            <View ref={(view) => imageRefs.current.set(item?.key, view)} onLayout={() => {}} style={{ borderRadius: 8, width: s(40), height: s(40), padding: s(2), backgroundColor: answered.includes(item.key) && images.length != 3 ? '#ADD64D4D' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                                
                                <Image source={{ uri: item?.image }} style={{ resizeMode: 'contain', width: '100%', height: '100%' }}/>
                           
                            </View>

                        </View>

                    </GestureDetector>
                ) 
            })}
            
        </View>
    )
}

export default LeftImagesBlock;