import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation/Navigation';
import * as SplashScreen from 'expo-splash-screen';
import { checkNetwork } from './src/network/checkNetwork';
import NoNetworkScreen from './src/components/NoNetwork';
import store from './src/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
    duration: 300,
    fade: true
})

// igor.khegay@avtech.uz

const App = () => {

    const [hasNetwork, setHasNetwork] = useState<boolean | null>(null);

    const initialize = async () => {
        try {
            const network = await checkNetwork();
            setHasNetwork(network);
            if (!network) {
                await SplashScreen.hideAsync();
            }
        } catch (e) {
            setHasNetwork(false);
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (!store.loading) {
            SplashScreen.hideAsync()
        }
    }, [store.loading])

    if (hasNetwork === null) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {hasNetwork ? 
                <Navigation />
            :
                <NoNetworkScreen onRetry={initialize} />
            }
        </GestureHandlerRootView>
    )
}

export default App;