import { View, Image } from 'react-native'
import React from 'react'
import { SvgUri } from 'react-native-svg';
import { useScale } from '../../../../hooks/useScale';

const RenderAttributes = ({ attributes }) => {

    const { s, vs } = useScale()

    if (!attributes || attributes?.length === 0) {
        return (
            <View style={{ width: vs(48), height: vs(48) }} />
        )
    }

    return (
        <View style={{ width: '100%', height: 'auto', alignItems: 'center', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', borderRadius: 10, columnGap: vs(15)}}>
            
            {attributes && attributes?.length > 0 && attributes?.slice(0, 4).map((attribute, index) => {
                const isSvg = typeof attribute?.image === 'string' && attribute?.image.endsWith('.svg');
                
                return isSvg ? (
                    <SvgUri key={index} uri={attribute?.image} width={vs(48)} height={vs(48)} style={{ backgroundColor: attribute?.group?.color, borderRadius: 5 }}/>
                ) : (
                    <Image key={index} source={{ uri: attribute?.image }} style={{ resizeMode: 'contain', width: vs(48), height: vs(48), backgroundColor: attribute?.group?.color}}/>
                );
            })}

        </View>
    );
};

export default RenderAttributes;