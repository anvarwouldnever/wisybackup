import { View, Text, useWindowDimensions, Platform, Image } from 'react-native'
import React from 'react'
import Animated, { FadeIn, Easing, ZoomInEasyDown } from 'react-native-reanimated';

import galochka from '../../../images/gamepassed.png'
import x from '../../../images/wrongAnswerX.png'

const PlaceholderBlock = ({ placeholderObjects, placeholderRefs, id, answered }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <Animated.View entering={ZoomInEasyDown} style={{ gap: windowWidth * (30 / 800), height: windowHeight * (184 / 360), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 24 }}>
            {placeholderObjects.map((item: any) => {

                return (
                    <View style={{
                                width: Platform.isPad ? windowWidth * (160 / 800) : windowWidth * (160 / 800),
                                height: Platform.isPad ? windowWidth * (160 / 800) : windowHeight * (168 / 360),
                                borderRadius: item?.image ? 10 : 16,
                                borderColor: id?.id == item?.id && id?.result == 'wrong' && !item?.image? '#D81616' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id) && !item?.image? '#ADD64D' : 'black',
                                borderWidth: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
                            }}
                            key={item.id}
                            ref={(el) => {
                                if (el) {
                                    placeholderRefs.current.set(item.id, el);
                                } else {
                                    placeholderRefs.current.delete(item.id);
                                }
                            }}
                        >
                        <View
                            style={{
                                width: windowWidth * (160 / 800),
                                height: Platform.isPad? windowWidth * (160 / 800) : windowHeight * (168 / 360),
                                borderRadius: item?.image ? 10 : 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: id?.id == item?.id && id?.result == 'wrong' && !item?.image? '#D816164D' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id) && !item?.image? '#ADD64D4D' : 'white',
                                
                            }}
                        >
                        {item?.image ? 
                            (
                                <>
                                    <Image 
                                        source={{ uri: item.image }} 
                                        style={{ 
                                            width: windowWidth * (176 / 800), 
                                            height: Platform.isPad? windowWidth * (184 / 800) : windowHeight * (184 / 360), 
                                            borderRadius: 16, 
                                            borderWidth: 2, 
                                            borderColor: id?.id == item?.id && id?.result == 'wrong'? '#D81616' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id)? '#ADD64D' : 'white',
                                        }} 
                                    />
                                    {item?.draggedUri && (
                                        <Animated.Image
                                            entering={FadeIn
                                                .duration(600)
                                                .delay(50)
                                                .springify()
                                                .easing(Easing.out(Easing.exp))
                                            }
                                            source={{ uri: item.draggedUri }}
                                            style={{
                                                width: windowWidth * (120 / 800),
                                                height: Platform.isPad? windowWidth * (120 / 800) : windowHeight * (120 / 360),
                                                position: 'absolute',
                                                alignSelf: 'center',
                                            }}
                                        />
                                    )}
                                    {answered.includes(item.id) && (
                                        <Image source={galochka} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 2, right: 2}}/>
                                    )}
                                    {id?.id == item?.id && id?.result == 'wrong' && (
                                        <Image source={x} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 2, right: 2}}/>
                                    )}
                                </>
                            ) 
                            : 
                            (
                                <View style={{flex: 1, gap: 10, padding: 16, alignItems: 'center'}}>
                                    <Text style={{position: 'absolute', bottom: Platform.isPad? windowWidth * (10 / 800) : windowHeight * (10 / 360), fontWeight: '600', fontSize: Platform.isPad? windowWidth * (14 / 800) : windowHeight * (14 / 360)}}>{item.text}</Text>
                                    {item?.draggedUri && (
                                        <Animated.Image
                                            entering={FadeIn
                                                .duration(600)
                                                .delay(50)
                                                .springify()
                                                .easing(Easing.out(Easing.exp))
                                            }
                                            source={{ uri: item.draggedUri }}
                                            style={{
                                                width: windowWidth * (120 / 800),
                                                height: Platform.isPad? windowWidth * (120 / 800) : windowHeight * (120 / 360),
                                                alignSelf: 'center',
                                                resizeMode: 'contain'
                                            }}
                                        />
                                    )}
                                </View>
                            )}
                            {answered.includes(item.id) && !item?.image && (
                                <Image source={galochka} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 5, right: 5}}/>
                            )}
                            {id?.id == item?.id && id?.result == 'wrong' && !item?.image && (
                                <Image source={x} style={{width: windowHeight * (24 / 360), height: windowHeight * (24 / 360), position: 'absolute', top: 5, right: 5}}/>
                            )}
                        </View>
                    </View>
                )
            })}
        </Animated.View>
    )
}

export default PlaceholderBlock