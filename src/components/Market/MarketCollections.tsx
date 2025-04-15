import { View, Text, useWindowDimensions, FlatList, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef } from 'react'
import store from '../../store/store';
import Svg, { SvgUri } from 'react-native-svg';
import star from '../../images/tabler_star-filled.png'
import Animated, { FadeInRight, Easing } from 'react-native-reanimated';
import { observer } from 'mobx-react-lite';
import RenderItem from './RenderItem';
import LottieView from 'lottie-react-native';
import loadingAnim from '../../../assets/6Vcbuw6I0c (1).json'

const MarketCollections = ({ activeMarket, setCurrentAnimation, setModal, setAnimationStart }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const items = store?.market

        return (
            <View style={{position: 'absolute', top: windowHeight * (118 / 360), left: windowWidth * (320 / 800), width: windowWidth * (480 / 800)}}>
                {store.loadingCats?
                <LottieView
                    loop={true}
                    autoPlay
                    source={loadingAnim}
                    style={{width: windowWidth * (50 / 800), height: windowHeight * (50 / 360), position: 'absolute', alignSelf: 'center'}}
                />
                :
                <Animated.FlatList
                    entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))}
                    key={store.market} 
                    data={items[0].items}
                    renderItem={({ item, index }) => <RenderItem setCurrentAnimation={setCurrentAnimation} setModal={setModal} item={item} index={index} setAnimationStart={setAnimationStart}/>}
                    scrollEnabled
                    horizontal
                    contentContainerStyle={{ gap: 16 }}
                    showsHorizontalScrollIndicator={false}
                />}
            </View>
        )
}

export default observer(MarketCollections);

{/* <FlatList 
                    data={items}
                    renderItem={renderItem}
                    scrollEnabled
                    horizontal
                    contentContainerStyle={{position: 'absolute', top: windowHeight * (118 / 360), left: windowWidth * (320 / 800),}}
                /> */}


// const renderItem = ({ item }) => {
            
        //     const isSvg = item.image.endsWith('.svg')
    
        //     return (
        //         <View style={{width: windowWidth * (136 / 800), height: windowHeight * (176 / 360), padding: 12, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: 10, borderColor: '#FFFFFF1F', alignItems: 'center', alignSelf: 'center', position: 'relative' }}>
        //             <PanGestureHandler onEnded={runOnJS(Func)(item.animation, item.cost)} onGestureEvent={gestureHandler}>
        //                     <Animated.View
        //                         style={[
        //                             animatedStyle
        //                         ]}
        //                     >
        //                         {isSvg ? (
        //                             <SvgUri
        //                                 uri={item.image}
        //                                 width={windowWidth * (112 / 800)}
        //                                 height={windowHeight * (112 / 360)}
        //                             />
        //                         ) : (
        //                             <Image
        //                                 source={{ uri: item.image }}
        //                                 style={{
        //                                     width: windowWidth * (112 / 800),
        //                                     height: windowHeight * (112 / 360),
        //                                     resizeMode: 'contain',
        //                                 }}
        //                             />
        //                         )}
        //                 </Animated.View>
        //             </PanGestureHandler>
        //             <View style={{width: windowWidth * (112 / 800), height: windowHeight * (16 / 360), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        //                 <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.name}</Text>
        //                 <View style={{width: 'auto', gap: 4, height: '100%', flexDirection: 'row', alignItems: 'center'}}>
        //                     <Image source={star} style={{resizeMode: 'contain',  width: windowWidth * (12 / 800), height: windowHeight * (12 / 360)}}/>
        //                     <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.cost}</Text>
        //                 </View>
        //             </View>
        //         </View>
        //     )
        // }


        // <ScrollView horizontal contentContainerStyle={{position: 'absolute', top: windowHeight * (118 / 360), left: windowWidth * (320 / 800), gap: 16}}>
        //                 {items && items[0].items.length > 0 && items[0].items.map((item, index) => {

        //                     const translateX = useSharedValue(0);
        //                     const translateY = useSharedValue(0);

        //                     const animatedStyle = useAnimatedStyle(() => ({
        //                         transform: [
        //                             { translateX: translateX.value },
        //                             { translateY: translateY.value },
        //                         ],
        //                     }));

        //                     const gestureHandler = useAnimatedGestureHandler({
        //                         onStart: (_, context) => {
        //                             context.startX = translateX.value;
        //                             context.startY = translateY.value;
        //                         },
        //                         onActive: (event, context) => {
        //                             translateX.value = context.startX + event.translationX;
        //                             translateY.value = context.startY + event.translationY;
        //                         },
        //                         onEnd(event, context) {
        //                             // runOnJS(Func)(item.animation, item.cost)
        //                             const draggingX = event.absoluteX
        //                             const draggingY = event.absoluteY
                                    
        //                             if (
        //                                 draggingX < (wisyLayout?.pageY + (wisyLayout?.width / 2)) &&
        //                                 draggingX > (wisyLayout?.pageY - (wisyLayout?.width / 2)) &&
        //                                 draggingY > (wisyLayout?.pageX + (wisyLayout?.height / 2))
        //                             ) {
        //                                     runOnJS(setAnimationStart)(false)
        //                                     runOnJS(setCurrentAnimation)(index);
        //                                     runOnJS(setModal)(true);
        //                             }

        //                             translateX.value = 0;
        //                             translateY.value = 0;
        //                         }
        //                     });

        //                     const isSvg = item?.image?.endsWith('.svg');

        //                     return (
        //                         <View key={index} style={{width: windowWidth * (136 / 800), height: windowHeight * (176 / 360), padding: 12, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: 10, borderColor: '#FFFFFF1F', alignItems: 'center', alignSelf: 'center', position: 'relative' }}>
        //                             <PanGestureHandler onGestureEvent={gestureHandler}>
        //                                     <Animated.View
        //                                         style={[
        //                                             animatedStyle
        //                                         ]}
        //                                     >
        //                                         {isSvg ? (
        //                                             <SvgUri
        //                                                 uri={item.image}
        //                                                 width={windowWidth * (112 / 800)}
        //                                                 height={windowHeight * (112 / 360)}
        //                                             />
        //                                         ) : (
        //                                             <Image
        //                                                 source={{ uri: item.image }}
        //                                                 style={{
        //                                                     width: windowWidth * (112 / 800),
        //                                                     height: windowHeight * (112 / 360),
        //                                                     resizeMode: 'contain',
        //                                                 }}
        //                                             />
        //                                         )}
        //                                 </Animated.View>
        //                             </PanGestureHandler>
        //                             <View style={{width: windowWidth * (112 / 800), height: windowHeight * (16 / 360), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        //                                 <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.name}</Text>
        //                                 <View style={{width: 'auto', gap: 4, height: '100%', flexDirection: 'row', alignItems: 'center'}}>
        //                                     <Image source={star} style={{resizeMode: 'contain',  width: windowWidth * (12 / 800), height: windowHeight * (12 / 360)}}/>
        //                                     <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.cost}</Text>
        //                                 </View>
        //                             </View>
        //                         </View>
        //                     )
        //                 })}
        //             </ScrollView>
