import { FlatList, View, useWindowDimensions, Image, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import store from '../../store/store';
import { SvgUri } from 'react-native-svg';
import Animated, { FadeInRight, Easing  } from 'react-native-reanimated';

const MarketCategories = ({ currentAnimation }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const categories = store?.market

    const renderCategory = ({ item }) => {

        const isSvg = item.icon.endsWith('.svg')

        return (
            <TouchableOpacity onPress={() => console.log(currentAnimation)} style={{paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#FFFFFF1A', backgroundColor: '#F8F8F833', borderRadius: 100, gap: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                {isSvg ? (
                    <SvgUri
                        uri={item.icon}
                        width={windowWidth * (24 / 800)}
                        height={windowHeight * (24 / 360)}
                    />
                ) : (
                     <Image
                        source={{ uri: item.icon }}
                        style={{
                            width: windowWidth * (24 / 800),
                            height: windowHeight * (24 / 360),
                            resizeMode: 'contain',
                        }}
                    />
                )}
                <Text style={{color: '#FFFFFF', fontSize: 12, fontWeight: '600'}}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <Animated.View entering={FadeInRight.duration(600).easing(Easing.out(Easing.cubic))} style={{width: 500, height: windowHeight * (40 / 360), position: 'absolute', top: windowHeight * (96 / 360), left: windowWidth * (320 / 800)}}>
            <FlatList 
                data={categories}
                renderItem={renderCategory}
                horizontal
            />     
        </Animated.View>
    )
}

export default MarketCategories;