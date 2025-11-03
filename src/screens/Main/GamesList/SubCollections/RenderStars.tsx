import { View, Image } from 'react-native'
import React from 'react'
import { useScale } from '../../../../hooks/utils/useScale';

const RenderStars = ({ earned, total }) => {

    const { s, vs } = useScale()

    if (!total) {
        return (
            <View style={{ width: vs(38),height: vs(38)}} />
        )
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: vs(5) }}>
            {[...Array(total)].map((_, index) => {
                const starImage = index < earned ? require('../../../../images/filledStar.png') : require('../../../../images/emptyStar.png');
                return (
                    <Image
                        key={index}
                        source={starImage}
                        style={{ width: vs(38),height: vs(38), resizeMode: 'contain'}}
                    />
                );
            })}
        </View>
    );
};

export default RenderStars