import { Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {

    return (
        <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../images/ebloWisy.png')} resizeMode='contain' style={{width: 250, height: 213}} />
        </LinearGradient>
    )
}

export default SplashScreen;