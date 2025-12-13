import { View, Text, Platform } from 'react-native'
import React, { useRef } from 'react'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useScale } from '../../hooks/utils/useScale';
import Item from './Avatars/Item';
import Dots from './Avatars/Dots';
import { getAvatars } from '../ChildParams/hooks/getAvatars';

const Avatars = ({ settings, setAvatarIndex, setAvatarId, avatarIndex }) => {

    const { s, vs, windowHeight: height, windowWidth: width } = useScale()

    const AvatarWidth = width * (180 / 360)
    const AvatarHeight = height * (180 / 800)
    const Spacing = width * (10 / 360);

    const title = settings?.choose_avatar_title;

    const { avatars, error, loading } = getAvatars()

    const scrollX = useSharedValue<number>(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });
      
    const viewabilityConfig = {
        itemVisiblePercentThreshold: 70,
    };
      
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        const item = viewableItems?.[0]?.item;
        const index = viewableItems?.[0]?.index;
    
        if (index !== undefined && item?.id) {
            setAvatarIndex(index);     // для dots
            setAvatarId(item.id);      // для сервера
        }
    }).current;

    const lastIndex = avatars?.length - 1;

    return (
        <View style={{width: width, height: 'auto', gap: vs(44), alignItems: 'center', justifyContent: 'center'}}>
            
            <Text style={{ fontSize: Platform.isPad ? vs(22) : vs(20), fontWeight: '600', textAlign: 'center' }}>
                {title}
            </Text>

            <Animated.FlatList
                data={avatars}
                keyExtractor={(item) => item?.id?.toString()}
                horizontal
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                decelerationRate="fast"
                onScroll={scrollHandler}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                snapToInterval={AvatarWidth + Spacing}
                renderItem={({item, index}) => {
                    return (
                        <Item avatarHeight={AvatarHeight} avatarWidth={AvatarWidth} spacing={Spacing} item={item} index={index} scrollX={scrollX} lastIndex={lastIndex}/>
                    )}
                }    
            />  

            <Dots avatars={avatars} currentAvatar={avatarIndex} />
            
        </View>
    )
}

export default Avatars