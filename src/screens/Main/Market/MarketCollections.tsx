import { View } from 'react-native'
import React from 'react'
import Animated, { FadeInRight, Easing } from 'react-native-reanimated';
import { observer } from 'mobx-react-lite';
import RenderItem from './RenderItem';
import LottieView from 'lottie-react-native';
import { useScale } from '../../../hooks/utils/useScale';
import { getMarketCategories } from './hooks/getMarketCategories';
import { getMarketItems } from './hooks/getMarketItems';

const MarketCollections = ({ setCurrentAnimation, setModal, setAnimationStart, animationStart }) => {

    const { s, vs } = useScale()
    
    const { categories } = getMarketCategories();

    const firstId = categories?.length ? categories[0]?.id : null;
    
    const { items, loading } = getMarketItems(firstId);

    return (
        <View style={{ position: 'absolute', top: vs(230), right: 0, width: '62%', height: 'auto', justifyContent: 'center', overflow: 'visible' }}>
            {loading ? 
                (
                    <LottieView
                        loop={true}
                        autoPlay
                        source={require('../../../../assets/loading.json')}
                        style={{
                            width: s(25), 
                            height: s(30),
                            position: 'absolute',
                            alignSelf: 'center',
                            top: vs(110),
                        }}
                    />
                ) : (
                    <Animated.FlatList
                        entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))}
                        data={items}
                        renderItem={({ item, index }) => (
                            <RenderItem
                                setCurrentAnimation={setCurrentAnimation}
                                setModal={setModal}
                                item={item}
                                index={index}
                                setAnimationStart={setAnimationStart}
                                animationStart={animationStart}
                            />
                        )}
                        scrollEnabled
                        horizontal
                        contentContainerStyle={{ columnGap: vs(20), paddingRight: s(20), paddingBottom: vs(30)}}
                        showsHorizontalScrollIndicator={false}
                    />
                )
            }
        </View>
    )
}

export default observer(MarketCollections);