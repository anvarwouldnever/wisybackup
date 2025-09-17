import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/AuthScreen';
import EmailConfirmScreen from './src/screens/EmailConfirmScreen';
import ChildParams from './src/screens/ChildParamsScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import EnableNotificationsScreen from './src/screens/EnableNotificationsScreen';
import ChoosePlayerScreen from './src/screens/ChoosePlayerScreen';
import MainScreen from './src/screens/MainScreen';
import ParentsCaptchaScreen from './src/screens/ParentsCaptchaScreen';
import ParentsScreen from './src/screens/ParentsScreen';
import ChatScreen from './src/screens/ChatScreen';
import ParentsSegments from './src/screens/ParentsSegments';
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import store from './src/store/store';
import * as Linking from 'expo-linking';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GameScreen from './src/screens/GameScreen';
import SvgPathExtractor from './src/screens/TestScreen';
import LanguageScreen from './src/screens/LanguageScreen';
import SplashScreen from './src/screens/SplashScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ResettedPasswordScreen from './src/screens/ResettedPasswordScreen';
import NetInfo from '@react-native-community/netinfo';

const Stack = createStackNavigator();

// igor.khegay@avtech.uz

const App = () => {

  const url = Linking.useURL();

  const navigationRef = useRef(null);

  // AsyncStorage.clear();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(() => {
      store.determineConnection()
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

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

  // console.log(store.token)

  if (store?.loading) {
      return <SplashScreen />
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar translucent={true} backgroundColor="transparent" style='dark' hidden={false}/>
        <Stack.Navigator screenOptions={{
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS
          }}>
          {store?.token === null ? (
            <>
              <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="AuthScreen" component={LoginScreen} />
              <Stack.Screen name="EmailConfirmScreen" component={EmailConfirmScreen} />
              <Stack.Screen name="EnableNotificationsScreen" component={EnableNotificationsScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="ResettedPasswordScreen" component={ResettedPasswordScreen} />
            </>
          ) : store?.token !== null && store.children?.length > 0 ? (
            <>
              <Stack.Screen name="ChoosePlayerScreen" component={ChoosePlayerScreen} />
              <Stack.Screen name="ChildParamsScreen" component={ChildParams} />
              <Stack.Screen name="GamesScreen" component={MainScreen} />
              <Stack.Screen name="ParentsCaptchaScreen" component={ParentsCaptchaScreen} />
              <Stack.Screen name="ParentsScreen" component={ParentsScreen} />
              <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
              <Stack.Screen name="ParentsSegments" component={ParentsSegments} />
              <Stack.Screen name="GameScreen" component={GameScreen} />
              <Stack.Screen name="TestScreen" component={SvgPathExtractor} />
            </>
          ) : store?.token !== null && store?.children?.length === 0 ? (
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