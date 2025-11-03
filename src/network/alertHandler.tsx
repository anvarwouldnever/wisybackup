import { Alert } from "react-native";
import { navigationReset } from "../navigation/utils/navigate";

let isAlertVisible = false;

export const alertHandler = (screen?: string) => {

    if (isAlertVisible) return;

    isAlertVisible = true

    Alert.alert("Connection lost", "Check your internet connection and try again",
        [
            {
                text: "ОК",
                onPress: () => navigationReset(screen ?? "GamesScreen"),
            },
        ]
    );
};