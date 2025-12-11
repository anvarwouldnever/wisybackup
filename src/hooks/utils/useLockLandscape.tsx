import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

const useLockLandscape = () => {
    useFocusEffect(
        useCallback(() => {
            const lock = async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            };

            lock();
        }, [])
    );
};

export default useLockLandscape
