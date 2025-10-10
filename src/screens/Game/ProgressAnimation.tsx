import { View, Image } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useScale } from '../../hooks/useScale';

const ProgressAnimation = ({ level, task }) => {

    const { s, vs } = useScale()

    const games = task?.length
    const ProgressAnimationWidth = s(50); 
        
    const animatedProgress = useAnimatedStyle(() => {
        
        const progressWidth = (level / games) * ProgressAnimationWidth;
    
        return {
            width: withTiming(progressWidth, { duration: 300 }),
        };
    });

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
            
            <View style={{width: s(45), height: s(6), backgroundColor: 'white', borderTopLeftRadius: 100, borderBottomLeftRadius: 100, alignItems: 'center', flexDirection: 'row', padding: s(1)}}>
                <Animated.View style={[animatedProgress, {height: s(4), backgroundColor: '#504297', borderRadius: 100}]}/>
            </View>
           
            <Image source={require('../../images/Star.png')} style={{width: s(8), height: s(10), alignSelf: 'center', resizeMode: 'center'}} />
        
        </View>
    )
}

export default ProgressAnimation;