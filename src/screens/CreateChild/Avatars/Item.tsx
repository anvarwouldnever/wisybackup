import { Platform, Image } from 'react-native'
import React from 'react'
import Animated, { interpolate, Extrapolation, useAnimatedStyle, FadeIn } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import { useScale } from '../../../hooks/utils/useScale';

const Item = ({ item, index, scrollX, lastIndex, avatarWidth, spacing, avatarHeight }) => {

    const { windowWidth: width } = useScale()

    const margin = width * (110 / 430)
    
    const inputRange = [
        (index - 1) * (avatarWidth + spacing),
        index * (avatarWidth + spacing),
        (index + 1) * (avatarWidth + spacing)
    ]

    const animatedImage = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollX.value,
            inputRange,
            [Platform.OS === 'ios' ? 0.9 : 1, 1, Platform.OS === 'ios' ? 0.9 : 1],
            Extrapolation.CLAMP
        );
    
        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [Platform.OS === 'ios' ? 0.5 : 1, 1, Platform.OS === 'ios' ? 0.5 : 1],
            Extrapolation.CLAMP
        );
    
        return {
            transform: [{ scaleY: scale }],
            opacity: opacity,
        };
    }, [scrollX]);

    const isSvg = item?.image?.url.endsWith('svg')

    return (
        <Animated.View style={[animatedImage, {alignItems: 'center', marginLeft: index === 0? margin : spacing, marginRight: index === lastIndex? margin : spacing, width: avatarWidth - spacing, height: avatarHeight}]}>
            {isSvg?
            <SvgUri width={avatarWidth - spacing} height={avatarHeight} uri={item?.image?.url}/>
                :
            <Image style={{borderRadius: 100, borderColor: '#504297', borderWidth: 3, width: '100%', height: '100%'}} source={{ uri: item?.image?.url }}/>}
        </Animated.View>
    )
}

export default Item