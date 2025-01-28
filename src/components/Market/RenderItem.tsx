import { View, useWindowDimensions, Image, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SvgUri } from "react-native-svg";
import Animated, { FadeInRight, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, Easing, runOnJS } from 'react-native-reanimated';
import star from '../../images/tabler_star-filled.png'

const RenderItem = ({ item, setCurrentAnimation, wisyLayout, setModal, setAnimationStart, index }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

                                const translateX = useSharedValue(0);
                                const translateY = useSharedValue(0);
    
                                const gestureHandler = useAnimatedGestureHandler({
                                    onStart: (_, context) => {
                                        context.startX = translateX.value;
                                        context.startY = translateY.value;
                                    },
                                    onActive: (event, context) => {
                                        translateX.value = context.startX + event.translationX;
                                        translateY.value = context.startY + event.translationY;
                                    },
                                    onEnd(event, context) {
                                        const draggingX = event.absoluteX
                                        const draggingY = event.absoluteY
                                        
                                        if (
                                            draggingX < (wisyLayout?.pageY + (wisyLayout?.width / 2)) &&
                                            draggingX > (wisyLayout?.pageY - (wisyLayout?.width / 2)) &&
                                            draggingY > (wisyLayout?.pageX + (wisyLayout?.height / 2))
                                        ) {
                                            runOnJS(setAnimationStart)(false)
                                            runOnJS(setCurrentAnimation)(index);
                                            runOnJS(setModal)(true);
                                        }
    
                                        translateX.value = 0;
                                        translateY.value = 0;
                                    },
                                });
    
    
                                const animatedStyle = useAnimatedStyle(() => ({
                                        transform: [
                                            { translateX: translateX.value },
                                            { translateY: translateY.value },
                                        ],
                                }));
            
            const isSvg = item?.image?.endsWith('.svg')
    
            return (
                <View style={{width: windowWidth * (136 / 800), height: windowHeight * (176 / 360), padding: 12, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: 10, borderColor: '#FFFFFF1F', alignItems: 'center', alignSelf: 'center', position: 'relative' }}>
                    <PanGestureHandler onGestureEvent={gestureHandler}>
                            <Animated.View
                                style={[
                                    animatedStyle
                                ]}
                            >
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
                        </Animated.View>
                    </PanGestureHandler>
                    <View style={{width: windowWidth * (112 / 800), height: windowHeight * (16 / 360), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.name}</Text>
                        <View style={{width: 'auto', gap: 4, height: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={star} style={{resizeMode: 'contain',  width: windowWidth * (12 / 800), height: windowHeight * (12 / 360)}}/>
                            <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.cost}</Text>
                        </View>
                    </View>
                </View>
            )
        }

export default RenderItem;