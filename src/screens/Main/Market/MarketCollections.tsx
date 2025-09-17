import { View, useWindowDimensions } from 'react-native'
import React from 'react'
import store from '../../../store/store';
import Animated, { FadeInRight, Easing } from 'react-native-reanimated';
import { observer } from 'mobx-react-lite';
import RenderItem from './RenderItem';
import LottieView from 'lottie-react-native';

const MarketCollections = ({ setCurrentAnimation, setModal, setAnimationStart, animationStart }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const items = store?.market

        return (
            <View style={{position: 'absolute', top: windowHeight * (100 / 360), left: windowWidth * (320 / 800), width: windowWidth * (480 / 800), height: windowHeight * (197 / 360), justifyContent: 'center'}}>
                {store?.loadingCats
                    ? (
                        <LottieView
                            loop={true}
                            autoPlay
                            source={require('../../../../assets/6Vcbuw6I0c (1).json')}
                            style={{
                                width: windowWidth * (50 / 800),
                                height: windowHeight * (50 / 360),
                                position: 'absolute',
                                alignSelf: 'center'
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
                            contentContainerStyle={{ gap: 16 }}
                            showsHorizontalScrollIndicator={false}
                        />
                    )
                }
            </View>
        )
}

export default observer(MarketCollections);