import { View, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import { SvgUri } from 'react-native-svg';

const RenderAttributes = ({ attributes }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <View style={{ width: '100%', height: windowHeight * (35 / 360), bottom: 0, position: 'absolute', alignItems: 'center', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', borderRadius: 10}}>
            
            {attributes && attributes?.length > 0 && attributes?.slice(0, 4).map((attribute, index) => {
                const isSvg = typeof attribute?.image === 'string' && attribute?.image.endsWith('.svg');
                
                return isSvg ? (
                    <SvgUri key={index} uri={attribute.image} width={windowWidth * (24 / 800)} height={windowHeight * (24 / 360)} style={{ marginHorizontal: 5, backgroundColor: attribute.group.color, borderRadius: 5 }}/>
                ) : (
                    <Image key={index} source={{ uri: attribute?.image }} style={{ resizeMode: 'contain', width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), marginHorizontal: 5, backgroundColor: attribute?.group?.color}}/>
                );
            })}

        </View>
    );
};

export default RenderAttributes