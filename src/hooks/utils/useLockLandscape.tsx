import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppState } from "react-native";

const useLockLandscape = () => {
    useEffect(() => {
        ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );

        const sub = AppState.addEventListener("change", state => {
            if (state === "inactive" || state === "background") {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }

            if (state === "active") {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }
        });

        return () => {
            sub.remove() 
        };
    }, []);
};

export default useLockLandscape;
