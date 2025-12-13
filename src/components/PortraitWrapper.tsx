import { View, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function PortraitWrapper({ children }) {
    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            <View
                style={{
                    flex: 1,
                    transform: [{ rotate: "90deg" }],
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {children}
            </View>
        </View>
    );
}
