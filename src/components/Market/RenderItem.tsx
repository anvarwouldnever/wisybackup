import { View, useWindowDimensions, Image, Text, TouchableOpacity } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SvgUri } from "react-native-svg";
import Animated, { FadeInRight, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, Easing, runOnJS } from 'react-native-reanimated';
import star from '../../images/tabler_star-filled.png'

const RenderItem = ({ item, setCurrentAnimation, setModal, setAnimationStart, index }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
            
    const isSvg = item?.image?.endsWith('.svg')
    
            return (
                <TouchableOpacity onPress={() => {
                    setCurrentAnimation({animation: item.animation, cost: item.cost, id: item.id})
                    setAnimationStart(false)
                    setModal(true)
                }} style={{width: windowWidth * (136 / 800), height: windowHeight * (176 / 360), padding: 12, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: 10, borderColor: '#FFFFFF1F', alignItems: 'center', alignSelf: 'center', position: 'relative' }}>
                    {isSvg ? (
                        <SvgUri
                            uri={item.image}
                            width={windowWidth * (112 / 800)}
                            height={windowHeight * (112 / 360)}
                        />
                    ) : (
                        <Image
                            source={{ uri: item.image }}
                            style={{
                                width: windowWidth * (112 / 800),
                                height: windowHeight * (112 / 360),
                                resizeMode: 'contain',
                            }}
                        />
                    )}
                    <View style={{width: windowWidth * (112 / 800), height: windowHeight * (16 / 360), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', bottom: windowHeight * (10 / 360)}}>
                        <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.name}</Text>
                        <View style={{width: 'auto', gap: 4, height: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={star} style={{resizeMode: 'contain',  width: windowWidth * (12 / 800), height: windowHeight * (12 / 360)}}/>
                            <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.cost}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

export default RenderItem;