import { Image, Text } from "react-native";
import { useEffect, useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import * as Haptics from 'expo-haptics'
import store from "../../store/store";
import { useScale } from "../../hooks/utils/useScale";

const StarStats = ({ numStars, layoutCaptured, setLayoutCaptured }) => {

    const bounceValue = useSharedValue(1);
    const storeStars = store.playingChildId?.stars
    const [stars, setStars] = useState(storeStars)

    const { s, vs } = useScale()

    const handleLayout = (event) => {
        event.persist()
        setTimeout(() => {
            if (!layoutCaptured) {
                setLayoutCaptured(event.nativeEvent.layout);
            }
        }, 3000);
    };
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bounceValue.value }],
    }));
    
    const triggerBounce = () => {
        setStars(prev => prev + 1)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        bounceValue.value = withSequence(
            withTiming(1.2, { duration: 300 }),
            withTiming(1, { duration: 300 })
        );
    };

    useEffect(() => {
        if (numStars) {
            triggerBounce();
        }
    }, [numStars]);

    return (
        <Animated.View onLayout={(event) => handleLayout(event)} style={[animatedStyle, {position: 'absolute', right: 0, top: 0, backgroundColor: 'white', width: 'auto', height: s(20), borderRadius: 100, columnGap: s(3), paddingHorizontal: s(4), flexDirection: 'row', justifyContent: 'space-evenly'}]}>
            
            <Image source={require('../../images/star.png')} style={{width: s(10), height: s(10), alignSelf: 'center'}}/>
            
            <Text style={{fontWeight: '600', fontSize: s(10), color: 'black', textAlign: 'center', alignSelf: 'center'}}>{stars}</Text>

        </Animated.View>
    )
}

export default StarStats;