import React, { memo } from "react";
import { Image, useWindowDimensions } from "react-native";
import narrowleft from '../../images/tablerleft.png';

const ArrowLeft = () => {
    const { height: windowHeight } = useWindowDimensions();

    const imageSource = Image.resolveAssetSource(narrowleft);

    return (
        <Image
            source={imageSource}
            style={{
                width: windowHeight * (24 / 800),
                height: windowHeight * (24 / 800),
            }}
        />
    );
};

export default memo(ArrowLeft);
