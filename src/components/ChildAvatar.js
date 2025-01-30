import React, { useState, useEffect } from "react";
import { Image, Dimensions, View, Text, Platform } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, interpolate, SlideInRight, Extrapolation } from "react-native-reanimated";
import store from "../store/store";
import { SvgUri } from "react-native-svg";

const { width, height } = Dimensions.get('window');
const AvatarWidth = width * (180 / 360)
const AvatarHeight = height * (180 / 800)
const Spacing = width * (10 / 360);

const RenderItem = ({ item, index, scrollX, lastIndex }) => {
    
    const size = useSharedValue(0.8);
    const opacity = useSharedValue(0.5);

    const inputRange = [
        (index - 1) * (AvatarWidth + Spacing),
        index * (AvatarWidth + Spacing),
        (index + 1) * (AvatarWidth + Spacing)
    ]

    size.value = interpolate (
        scrollX,
        inputRange,
        [Platform.OS === 'ios'? 0.9 : 1, 1, Platform.OS === 'ios'? 0.9 : 1],
        Extrapolation.CLAMP
    )

    opacity.value = interpolate(
        scrollX,
        inputRange,
        [Platform.OS === 'ios'? 0.5 : 1, 1, Platform.OS === 'ios'? 0.5 : 1],
        Extrapolation.CLAMP
    );

    const animatedImage = useAnimatedStyle(() => {
        return {
            transform: [{ scaleY: size.value }],
            opacity: opacity.value
        }
    })

    const isSvg = item.image.url.endsWith('svg')

    return (
        <Animated.View style={[animatedImage, {alignItems: 'center', marginLeft: index === 0? width * (110 / 430) : Spacing, marginRight: index === lastIndex? width * (110 / 430) : Spacing, width: AvatarWidth - Spacing, height: AvatarHeight}]}>
            {isSvg?
            <SvgUri width="100%" height="100%" uri={item.image.url}/>
                :
            <Image style={{borderRadius: 1000, borderColor: '#504297', borderWidth: 3, width: '100%', height: '100%', aspectRatio: 1 / 1}} source={{ uri: item.image.url }}/>}
        </Animated.View>
    )
}

const ChildAvatar = ({ currentIndex, setCurrentIndex }) => {
 
    const [scrollX, setScrollX] = useState(0)

    const handleScroll = (event) => {
        const newScrollX = event.nativeEvent.contentOffset.x;
        setScrollX(newScrollX);
        setCurrentIndex(Math.floor(newScrollX / (AvatarWidth - Spacing)));
    };

    const avatars = store.addchildui.avatars
    const title = store.addchildui.choose_avatar_title
    const lastIndex = avatars.length - 1;

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 1, alignItems: 'center'}}>
            <Text style={{width: width * (314 / 360), height: 'auto', color: '#222222', fontWeight: '600', fontSize: height * (20 / 800), lineHeight: height * (28 / 800), textAlign: 'center'}}>
                {title}
            </Text>
            <Animated.FlatList
                entering={SlideInRight}
                data={avatars}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => {
                    return (
                        <RenderItem item={item} index={index} scrollX={scrollX} lastIndex={lastIndex}/>
                    )}
                }    
                horizontal={true}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                snapToInterval={AvatarWidth + Spacing}
                pagingEnabled={true}
                decelerationRate="fast"
                style={{marginTop: height * (40 / 932)}}
            />  
            <View style={{width: 'auto', gap: width * (12 / 360), height: height * (100 / 932), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                {avatars.map((_, index) => {
                    return (
                        <View key={index} style={{width: 12, height: 12, borderRadius: 100, opacity: 0.9, backgroundColor: currentIndex === index ? '#504297' : '#E5E5E5'}}/>
                    )
                })}
            </View> 
        </View>
    )
}

export default ChildAvatar;