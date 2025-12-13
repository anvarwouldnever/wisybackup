import { useEffect, useRef } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppState } from "react-native";

export const usePersistentLandscape = () => {
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

        const subscription = AppState.addEventListener("change", nextState => {
            if (appState.current.match(/inactive|background/) && nextState === "active") {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }

            appState.current = nextState;
        });

        return () => {
            subscription.remove();
        };
    }, []);
};
