import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppState } from "react-native";

const useLockPortrait = () => {
    useEffect(() => {
        ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
        );

        const sub = AppState.addEventListener("change", state => {
            if (state === "inactive" || state === "background") {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }

            if (state === "active") {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
        });

        return () => { 
            sub.remove() 
        };
    }, []);
};

export default useLockPortrait
