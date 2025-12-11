import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation/Navigation';
import * as SplashScreen from 'expo-splash-screen';
import { checkNetwork } from './src/network/checkNetwork';
import NoNetworkScreen from './src/components/NoNetwork';
import store from './src/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'
import * as Linking from 'expo-linking';
import { navigationRef } from './src/navigation/utils/navigate';
import TurnPhoneScreen from './src/screens/TurnPhoneScreen';

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
    duration: 300,
    fade: true
})

// igor.khegay@avtech.uz

const App = () => {

    // SecureStore.deleteItemAsync('token')
    // AsyncStorage.clear()

    const [hasNetwork, setHasNetwork] = useState<boolean | null>(null);

    const url = Linking.useLinkingURL();

    useEffect(() => {
        if (url) {
            
            const { hostname, path, queryParams } = Linking.parse(url);

            if (queryParams.token) {
                const token = queryParams.token;

                SecureStore.setItem("token", token);
                navigationRef.navigate("ChildParamsScreen")
            }
        }
    }, [url]);

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
                <>
                    <TurnPhoneScreen />
                    {/* <Navigation /> */}
                </>
            :
                <NoNetworkScreen onRetry={initialize} />
            }
        </GestureHandlerRootView>
    )
}

export default App;