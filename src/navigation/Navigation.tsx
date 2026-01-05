import { StatusBar } from 'react-native';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import ChatScreen from '../screens/ChatScreen';
import ChildParams from '../screens/ChildParamsScreen';
import ChoosePlayerScreen from '../screens/ChoosePlayerScreen';
import EmailConfirmScreen from '../screens/EmailConfirmScreen';
import EnableNotificationsScreen from '../screens/EnableNotificationsScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import GameScreen from '../screens/GameScreen';
import LanguageScreen from '../screens/LanguageScreen';
import LoaderScreen from '../screens/LoaderScreen';
import MainScreen from '../screens/MainScreen';
import ParentsCaptchaScreen from '../screens/ParentsCaptchaScreen';
import ParentsScreen from '../screens/ParentsScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ResettedPasswordScreen from '../screens/ResettedPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/AuthScreen';
import TestScreen from '../screens/TestScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { navigationRef } from './utils/navigate';
import * as SecureStore from 'expo-secure-store';
import TurnPhoneScreen from '../screens/TurnPhoneScreen';
import ParentsSegmentsScreen from '../screens/ParentsSegmentsScreen';

const Navigation = () => {

    const Stack = createNativeStackNavigator();

    const token = SecureStore.getItem('token');

    // console.log(token)

    return (
        <NavigationContainer ref={navigationRef}>
            
            <StatusBar translucent={true} backgroundColor="transparent" barStyle='default' hidden={false}/>
            
            <Stack.Navigator id={null} initialRouteName={token === null ? "LanguageScreen" : "ChoosePlayerScreen"} screenOptions={{ headerShown: false, animation: 'slide_from_bottom', animationDuration: 300 }}>
                
                <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <Stack.Screen name="AuthScreen" component={LoginScreen} />
                <Stack.Screen name="EmailConfirmScreen" component={EmailConfirmScreen} />
                <Stack.Screen name="EnableNotificationsScreen" component={EnableNotificationsScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                <Stack.Screen name="ResettedPasswordScreen" component={ResettedPasswordScreen} />
                <Stack.Screen name="ChoosePlayerScreen" options={{ animation: 'fade', animationDuration: 300 }} component={ChoosePlayerScreen} />
                <Stack.Screen name="ChildParamsScreen" options={{ animation: 'fade', animationDuration: 300 }} component={ChildParams} />
                <Stack.Screen name="GamesScreen" options={{ animation: 'fade', animationDuration: 300 }} component={MainScreen} />
                <Stack.Screen name="ParentsCaptchaScreen" options={{ animation: 'fade', animationDuration: 300 }} component={ParentsCaptchaScreen} />
                <Stack.Screen name="ParentsScreen" component={ParentsScreen} />
                <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="ParentsSegments" component={ParentsSegmentsScreen} />
                <Stack.Screen name="GameScreen" component={GameScreen} />
                <Stack.Screen name="TestScreen" component={TestScreen} />
                <Stack.Screen name="TurnPhoneScreen" component={TurnPhoneScreen} />
        
            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default observer(Navigation)