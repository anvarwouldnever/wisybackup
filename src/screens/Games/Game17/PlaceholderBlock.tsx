import { View, Text, Image } from 'react-native'
import React from 'react'
import Animated, { FadeIn, Easing, ZoomInEasyDown } from 'react-native-reanimated';
import { useScale } from '../../../hooks/useScale';

const PlaceholderBlock = ({ placeholderObjects, placeholderRefs, id, answered }) => {

    const { s, vs } = useScale()

    return (
        <Animated.View entering={ZoomInEasyDown} style={{ columnGap: s(8), height: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {placeholderObjects?.map((item: any) => {

                return (
                    <View key={item?.id} style={{ width: s(75), height: s(75), borderRadius: s(6), borderWidth: 2, borderColor: id?.id == item?.id && id?.result == 'wrong'? '#D81616' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id)? '#ADD64D' : 'white', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}
                        ref={(el) => {
                            if (el) {
                                placeholderRefs.current.set(item.id, el);
                            } else {
                                placeholderRefs.current.delete(item.id);
                            }
                        }}
                    >
                        {item?.image ? 
                            (
                                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>

                                    <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', alignSelf: 'center'}} />
                                    
                                    {item?.draggedUri && (
                                        <Animated.Image entering={FadeIn.duration(600).delay(50).springify().easing(Easing.out(Easing.exp))} source={{ uri: item?.draggedUri }} style={{ width: '100%', height: s(50), position: 'absolute', alignSelf: 'center', resizeMode: 'contain'}}/>
                                    )}

                                    {answered.includes(item?.id) && (
                                        <Image source={require('../../../images/gamepassed.png')} style={{width: s(10), height: s(10), position: 'absolute', top: s(2), right: s(2)}}/>
                                    )}

                                    {id?.id == item?.id && id?.result == 'wrong' && (
                                        <Image source={require('../../../images/wrongAnswerX.png')} style={{ width: s(10), height: s(10), position: 'absolute', top: s(2), right: s(2) }}/>
                                    )}

                                </View>
                            ) 
                        : 
                            (
                                <View style={{ height: '100%', width: '100%', justifyContent: 'space-between', paddingVertical: s(5), alignItems: 'center', backgroundColor: id?.id == item?.id && id?.result == 'wrong' && !item?.image? '#D816164D' : (id?.id == item?.id && id?.result == 'correct') || answered.includes(item.id) && !item?.image? '#ADD64D4D' : 'white'}}>
                                    
                                    {item?.draggedUri ? 
                                        <Animated.Image entering={FadeIn.duration(600).delay(50).springify().easing(Easing.out(Easing.exp))} source={{ uri: item?.draggedUri }} style={{ width: '100%', height: s(50), resizeMode: 'contain'}}/>
                                    : 
                                        <View style={{  width: '100%', height: s(50) }} />
                                    }

                                    <Text numberOfLines={1} style={{ fontWeight: '600', fontSize: s(6), textAlign: 'center'}}>{item?.text}</Text>

                                </View>
                            )
                        }

                        {answered.includes(item.id) && !item?.image && 
                            <Image source={require('../../../images/gamepassed.png')} style={{ width: s(10), height: s(10), position: 'absolute', top: s(2), right: s(2) }}/>
                        }

                        {id?.id == item?.id && id?.result == 'wrong' && !item?.image && 
                            <Image source={require('../../../images/wrongAnswerX.png')} style={{ width: s(10), height: s(10), position: 'absolute', top: s(2), right: s(2) }}/>
                        }

                    </View>
                )
            })}
        </Animated.View>
    )
}

export default PlaceholderBlock;