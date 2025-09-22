import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import store from './src/store/store';
import * as Linking from 'expo-linking';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import Navigation from './src/navigation/Navigation';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
    duration: 300,
    fade: true
})

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

    // console.log(store.children.length)

    useEffect(() => {
        if (!store.loading) {
            SplashScreen.hideAsync()
        }
    }, [store.loading])

    if (store.loading) {
        return null
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Navigation navigationRef={navigationRef} />
        </GestureHandlerRootView>
    )
}

export default observer(App);