import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/AuthScreen';
import EmailConfirmScreen from './src/screens/EmailConfirmScreen';
import ChildParams from './src/screens/ChildParamsScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import EnableNotificationsScreen from './src/screens/EnableNotificationsScreen';
import ChoosePlayerScreen from './src/screens/ChoosePlayerScreen';
import GamesScreen from './src/screens/GamesScreen';
import ParentsCaptcha from './src/screens/ParentsCaptcha.tsx';
import ParentsScreen from './src/screens/ParentsScreen';
import ChatScreen from './src/screens/ChatScreen';
import ParentsSegments from './src/screens/ParentsSegments';
import TextToSpeech from './src/components/TextToSpeech';
import { AppState } from 'react-native';
import Game1Screen from './src/screens/Game1Screen';
import Game2Screen from './src/screens/Game2Screen';
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import store from './src/store/store';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Game3Screen from './src/screens/Game3Screen';
import Game4Screen from './src/screens/Game4Screen';
import Game5Screen from './src/screens/Game5Screen';
import Game6Screen from './src/screens/Game6Screen';
import Game7Screen from './src/screens/Game7Screen';
import Game8Screen from './src/screens/Game8Screen';
import Game9Screen from './src/screens/Game9Screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GameScreen from './src/screens/GameScreen';
import SvgPathExtractor from './src/screens/TestScreen';
import Game14Screen from './src/screens/Game14Screen';
import LanguageScreen from './src/screens/LanguageScreen';
import SplashScreen from './src/screens/SplashScreen';
import ForgotPassword from './src/components/ForgotPassword';
import ResetPassword from './src/screens/ResetPassword';
import ResettedPasswordScreen from './src/screens/ResettedPasswordScreen';

const Stack = createStackNavigator();

const App = () => {

  // AsyncStorage.clear();

  // igor.khegay@avtech.uz

  const url = Linking.useURL();

  const navigationRef = useRef(null);

  // console.log(store.language)

  useEffect(() => {
    const handleDeepLink = async (url) => {
      if (url) {
        const { queryParams, path, hostname } = Linking.parse(url);
        if (store.token === null && queryParams?.token && store.holdEmail !== null && hostname === 'reset-password') {
          navigationRef.current?.navigate('ResetPassword', {token: queryParams.token});
        } 
        if (store.token === null && queryParams?.user_token && hostname === 'email-confirmation') {
          await store.setToken(queryParams.user_token)
        }
      }
    };
    
    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));

    return () => {
      subscription.remove();
    };
  }, []);

  if (store.loading) {
    return <SplashScreen />
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style='dark'/>
        <Stack.Navigator screenOptions={{
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS
          }}>
          {store.token === null ? (
            <>
              <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="AuthScreen" component={LoginScreen} />
              <Stack.Screen name="EmailConfirmScreen" component={EmailConfirmScreen} />
              <Stack.Screen name="EnableNotificationsScreen" component={EnableNotificationsScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
              <Stack.Screen name="ResettedPasswordScreen" component={ResettedPasswordScreen} />
            </>
          ) : store.token !== null && store.children.length > 0 ? (
            <>
              <Stack.Screen name="ChoosePlayerScreen" component={ChoosePlayerScreen} />
              <Stack.Screen name="ChildParamsScreen" component={ChildParams} />
              <Stack.Screen name="GamesScreen" component={GamesScreen} />
              <Stack.Screen name="ParentsCaptchaScreen" component={ParentsCaptcha} />
              <Stack.Screen name="ParentsScreen" component={ParentsScreen} />
              <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
              <Stack.Screen name="ParentsSegments" component={ParentsSegments} />
              <Stack.Screen name="TextToSpeech" component={TextToSpeech} />
              <Stack.Screen name="GameScreen" component={GameScreen} />
              <Stack.Screen name="TestScreen" component={SvgPathExtractor} />
            </>
          ) : store.token !== null && store.children.length === 0 ? (
            <>
              <Stack.Screen name="ChildParamsScreen" component={ChildParams} />
              <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
              <Stack.Screen name="ChoosePlayerScreen" component={ChoosePlayerScreen} />
            </>
          ) : null}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default observer(App);

{/* <Stack.Screen name="GamesScreen" component={GamesScreen} />
          <Stack.Screen name="ParentsCaptchaScreen" component={ParentsCaptcha} />
          <Stack.Screen name="ParentsScreen" component={ParentsScreen} />
          <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="ParentsSegments" component={ParentsSegments} />
          <Stack.Screen name="TextToSpeech" component={TextToSpeech} />
          <Stack.Screen name="GameScreen" component={GameScreen} />
          <Stack.Screen name="Game1Screen" component={Game1Screen} />
          <Stack.Screen name="Game2Screen" component={Game2Screen} />
          <Stack.Screen name="Game3Screen" component={Game3Screen} />
          <Stack.Screen name="Game4Screen" component={Game4Screen} />
          <Stack.Screen name="Game5Screen" component={Game5Screen} />
          <Stack.Screen name="Game6Screen" component={Game6Screen} />
          <Stack.Screen name="Game7Screen" component={Game7Screen} />
          <Stack.Screen name="Game8Screen" component={Game8Screen} />
          <Stack.Screen name="Game9Screen" component={Game9Screen} />
          <Stack.Screen name="Game14Screen" component={Game14Screen} />
          <Stack.Screen name="TestScreen" component={SvgPathExtractor} /> */}


          // <Stack.Screen name="Game1Screen" component={Game1Screen} />
          //     <Stack.Screen name="Game2Screen" component={Game2Screen} />
          //     <Stack.Screen name="Game3Screen" component={Game3Screen} />
          //     <Stack.Screen name="Game4Screen" component={Game4Screen} />
          //     <Stack.Screen name="Game5Screen" component={Game5Screen} />
          //     <Stack.Screen name="Game6Screen" component={Game6Screen} />
          //     <Stack.Screen name="Game7Screen" component={Game7Screen} />
          //     <Stack.Screen name="Game8Screen" component={Game8Screen} />
          //     <Stack.Screen name="Game9Screen" component={Game9Screen} />
          //     <Stack.Screen name="Game14Screen" component={Game14Screen} />