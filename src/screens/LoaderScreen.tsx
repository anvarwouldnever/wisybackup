import React, { useState } from "react";
import { Text, View } from "react-native";
import Logo from "../components/Logo";
import Loader from "./Loader/Loader";
import { useScale } from "../hooks/utils/useScale";
import Button from "./Loader/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLabels } from "./Welcome/hooks/getLabels";

const LoaderScreen = () => {

    const { labels } = getLabels()

    const [text, setText] = useState(labels?.finding_activities)
    const [isFrozen, setIsFrozen] = useState<boolean>(false)

    const { s, vs, isTablet } = useScale()

    if (isFrozen) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white', alignItems: 'center', paddingHorizontal: vs(22)}}>
            
            <Logo />
            
            <Loader setText={setText} labels={labels} />

            <Text style={{width: '100%', height: 'auto', color: '#222222', fontWeight: '600', fontSize: isTablet ? vs(15) : vs(20), textAlign: 'center', lineHeight: vs(28), position: 'absolute', top: vs(500)}}>{text}</Text>
            
            {text === labels?.matched_activities && <Button setIsFrozen={setIsFrozen} />}

        </SafeAreaView>
    )
}

export default LoaderScreen;