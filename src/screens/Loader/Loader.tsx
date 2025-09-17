import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { ReText } from 'react-native-redash'
import Svg, { Circle } from 'react-native-svg'
import { useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import lapa from '../../images/lapa.png'
import { useNavigation } from '@react-navigation/native'
import Animated from 'react-native-reanimated'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const { width, height } = Dimensions.get('window');

const Loader = ({ setText }) => {

    const progress = useSharedValue(0)
    
    useEffect(() => {
        progress.value = withTiming(1, {duration: 1500})
        setTimeout(() => {
            setText('We have matched activities that fit your child!')
        }, 1300);
    }, [])
    
    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: (height * (500 / 932)) * (1 - progress.value)
    }))
    
    const progressText = useDerivedValue(() => {
        return `${Math.floor(progress.value * 100)}%`
    })
    
    const angle = useSharedValue(-Math.PI / 2);
    
    useEffect(() => {
        angle.value = withTiming(2 * Math.PI - Math.PI / 2, { duration: 1500 });
    }, []);
    
    const animatedStyle = useAnimatedStyle(() => {
        const radius = (height * (78 / 932))
        const centerX = width / 2;
        const centerY = height / 2;

        return {
            transform: [
                { translateX: centerX + radius * Math.cos(angle.value) - centerX },
                { translateY: centerY + radius * Math.sin(angle.value) - centerY },
            ],
        };
    });

    return (
        <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center', top: height * (320 / 932), height: height * (170 / 932), width: width * (170 / 430)}}>
                
            <Svg style={{position: 'absolute', height: height * (170 / 800), width: width * (170 / 360)}}>
                <AnimatedCircle 
                    cy={height * (100 / 932)}
                    cx={width * (100 / 430)}
                    r={(height * (500 / 932)) / (2 * Math.PI)}
                    stroke={'#91B049'}
                    strokeWidth={10}
                    strokeDasharray={(height * (500 / 932))}
                    strokeDashoffset={(height * (500 / 932)) * 0.7}
                    fill={'white'}
                    animatedProps={animatedProps}
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    transform={`rotate(265 ${width * (100 / 430)} ${height * (100 / 932)})`}
                />
            </Svg>
            
            <ReText style={{position: 'absolute', color: '#222222', fontSize: height * (24 / 800), fontWeight: '600', width: width * (150 / 360), textAlign: 'center'}} text={progressText} />
            
            <View style={styles.container}>
                <Animated.Image source={lapa} style={[styles.circle, animatedStyle]} />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 18,
        height: 18,
        borderRadius: 25
    },
});

export default Loader