import { View } from 'react-native'
import React from 'react'
import store from '../../../store/store';
import Animated, { FadeInRight, Easing } from 'react-native-reanimated';
import { observer } from 'mobx-react-lite';
import RenderItem from './RenderItem';
import LottieView from 'lottie-react-native';
import { useScale } from '../../../hooks/useScale';

const MarketCollections = ({ setCurrentAnimation, setModal, setAnimationStart, animationStart }) => {

    const { s, vs } = useScale()

    const items = store?.market

        return (
            <View style={{position: 'absolute', top: vs(230), right: 0, width: '62%', height: 'auto', justifyContent: 'center', overflow: 'visible'}}>
                {store?.loadingMarketItems
                    ? (
                        <LottieView
                            loop={true}
                            autoPlay
                            source={require('../../../../assets/6Vcbuw6I0c (1).json')}
                            style={{
                                width: s(25), 
                                height: s(30),
                                position: 'absolute',
                                alignSelf: 'center',
                                top: vs(110)
                            }}
                        />
                    ) : (
                        <Animated.FlatList
                            entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))}
                            key={items[0]?.id}
                            data={[...(items[0]?.items || [])].reverse()}
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
                            contentContainerStyle={{ columnGap: vs(20), paddingRight: s(20) }}
                            showsHorizontalScrollIndicator={false}
                        />
                    )
                }
            </View>
        )
}

export default observer(MarketCollections);