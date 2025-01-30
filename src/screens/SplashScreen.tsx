import { View, Text, Image } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import splash from '../images/ebloWisy.png'
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {

    return (
        <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={splash} resizeMode='contain' style={{width: 250, height: 213}} />
        </LinearGradient>
    )
}

export default SplashScreen;

{/* <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={splash} resizeMode='contain' style={{width: 250, height: 213}} />
        </LinearGradient> */}