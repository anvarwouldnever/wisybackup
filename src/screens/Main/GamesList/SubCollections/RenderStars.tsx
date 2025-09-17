import { View, Image, Platform, useWindowDimensions } from 'react-native'
import React from 'react'

const RenderStars = ({ earned, total }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: Platform.isPad ? 8 : 8 }}>
            {[...Array(total)].map((_, index) => {
                const starImage = index < earned ? require('../../../../images/filledStar.png') : require('../../../../images/emptyStar.png');
                return (
                    <Image
                        key={index}
                        source={starImage}
                        style={{
                            width: Platform.isPad ? windowWidth * (22 / 800) : windowWidth * (16 / 800),
                            height: Platform.isPad ? windowHeight * (22 / 360) : windowHeight * (16 / 360),
                            marginHorizontal: 2,
                            resizeMode: 'contain'
                        }}
                    />
                );
            })}
        </View>
    );
};

export default RenderStars