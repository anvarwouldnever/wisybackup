import { FlatList } from 'react-native'
import React, { useCallback } from 'react'
import { useScale } from '../../../hooks/utils/useScale';
import * as Haptics from 'expo-haptics';
import { observer } from 'mobx-react-lite';
import Item from './Item';

const SlideList = ({ currentIndex, setCurrentIndex, onboardings, loading }) => {

    const { vs, windowWidth } = useScale();

    const GAP = vs(25);
    const SLIDE_WIDTH = windowWidth - vs(48);
    const SNAP = SLIDE_WIDTH + GAP;

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };
          
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems?.length > 0) {
            const newIndex = viewableItems[0].index;
    
            if (newIndex !== currentIndex) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                setCurrentIndex(newIndex);
            }
        }
    }, [currentIndex]);

    return (
        <FlatList
            data={onboardings} 
            extraData={loading} 
            renderItem={({ item }) => <Item slideWidth={SLIDE_WIDTH} item={item} />}
            keyExtractor={(item) => item?.id.toString()}
            horizontal
            decelerationRate="fast"
            style={{ width: '100%', alignSelf: 'center' }}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', columnGap: vs(25), paddingHorizontal: vs(25) }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            initialNumToRender={2}
            snapToInterval={SNAP}
            snapToAlignment="start"
            windowSize={3}
            removeClippedSubviews
        />
    )
}

export default observer(SlideList);