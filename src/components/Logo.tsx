import React from "react";
import { Image, Platform } from 'react-native';
import { useScale } from "../hooks/utils/useScale";

const Logo = () => {

    const { s, vs, isTablet } = useScale();

    return <Image source={require('../images/Logo.png')} style={{ height: vs(54), width: vs(175), marginTop: Platform.OS === 'android'? 40 : 0, alignSelf: 'center' }}/>
}

export default Logo;

