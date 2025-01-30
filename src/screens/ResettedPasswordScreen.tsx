import { View, Text, SafeAreaView, Image, useWindowDimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Logo from '../components/Logo'
import not from '../images/noti-img 2.png'
import { useNavigation } from '@react-navigation/native'

const ResettedPasswordScreen = () => {

    const navigation = useNavigation();

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            <View style={{ alignSelf: 'flex-start' }}>
                <Logo />
            </View>
            <View style={{position: 'absolute', alignSelf: 'center', alignItems: 'center', gap: 24}}>
                <Image resizeMode='contain' source={not} style={{width: windowWidth * (244 / 360), height: windowHeight * (244 / 800)}}/>
                <View style={{width: windowWidth * (312 / 360), height: windowHeight * (64 / 800), gap: windowHeight * (12 / 800)}}>
                    <Text style={{fontWeight: '600', color: '#222222', fontSize: windowHeight * (20 / 800), textAlign: 'center'}}>Your password was reset</Text>
                    <Text style={{fontWeight: '400', color: '#555555', fontSize: windowHeight * (14 / 800), textAlign: 'center'}}>Now you can log in to your account</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("AuthScreen")} style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#504297', position: 'absolute', bottom: windowHeight * (80 / 800), alignSelf: 'center', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontWeight: '600', fontSize: windowHeight * (14 / 800)}}>Log in</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default ResettedPasswordScreen;