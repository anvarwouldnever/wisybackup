import { View, Text, useWindowDimensions, FlatList, Image, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import store from '../../store/store';
import Svg, { SvgUri } from 'react-native-svg';
import star from '../../images/tabler_star-filled.png'
import Animated, { FadeInRight, Easing } from 'react-native-reanimated';
import { observer } from 'mobx-react-lite';
import RenderItem from './RenderItem';
import LottieView from 'lottie-react-native';
import loadingAnim from '../../../assets/6Vcbuw6I0c (1).json'

const MarketCollections = ({ setCurrentAnimation, setModal, setAnimationStart, animationStart }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const items = store?.market

        return (
            <View style={{position: 'absolute', top: windowHeight * (100 / 360), left: windowWidth * (320 / 800), width: windowWidth * (480 / 800), minHeight: windowHeight * (176 / 360), justifyContent: 'center', alignSelf: 'center'}}>
                {store.loadingCats
                    ? (
                        <LottieView
                            loop={true}
                            autoPlay
                            source={loadingAnim}
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
                            data={items[0]?.items || []}
                            renderItem={({ item, index }) => (
                                <RenderItem
                                    setCurrentAnimation={setCurrentAnimation}
                                    setModal={setModal}
                                    item={item}
                                    
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