import React, { useEffect, useRef } from "react";
import { View, Platform, TouchableOpacity, Text, Image, StyleSheet, useWindowDimensions, UIManager, findNodeHandle } from "react-native";
import mywisy from '../../images/MyWisy-waving.png'
import reload from '../../images/tabler_reload.png'
import LottieView from "lottie-react-native";
import store from "../../store/store";

const WisyPanel = ({ setWisyLayout, currentAnimation, animationStart, setAnimationStart, marketCollections, modal }) => {
        
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    const items = store.market

    useEffect(() => {
        console.log(animationStart)
        if (modal) {
            return animationRef?.current?.reset();
        } 
        if (marketCollections === null) {
            return animationRef?.current?.reset();
        }
        if (animationStart) {
            animationRef.current?.reset();
            setTimeout(() => {
                animationRef?.current?.play();
            }, 150);
        } else if (!animationStart) {
            animationRef?.current?.reset();
        }
    }, [animationStart, marketCollections, modal]);

    const getAbsoluteLayout = () => {
        if (containerRef.current) {
            setTimeout(() => {
                containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    setWisyLayout({pageX: pageX, pageY: pageY, width: width, height: height });
                });
            }, 1000);
        }
    };
    
    return (
            <View style={{backgroundColor: '#F8F8F8', height: windowHeight, width: windowWidth * (280 / 800), borderTopRightRadius: 24, borderBottomRightRadius: 24, alignItems: 'center'}}>
                <View style={{alignItems: 'center', position: 'absolute', bottom: Platform.isPad? windowWidth * (20 / 800) : windowHeight * (10 / 360), left: Platform.isPad? 'auto' : windowWidth * (60 / 800), justifyContent: 'space-between', height: 'auto', gap: Platform.isPad? 20 : 0}}>
                    <View style={{width: windowWidth * (192 / 800), height: 'auto'}}>
                        <View style={{borderRadius: 16, backgroundColor: '#C4DF84', padding: 13, width: windowWidth * (192 / 800), height: 'auto'}}>
                            <Text style={{fontWeight: '500', fontSize: windowWidth * (14 / 800)}}>
                                Lorem ipsum dolor sit amet consectetur. Nulla dignsim malesuada . . .
                            </Text>
                        </View>
                        <View style={styles.triangle}/>
                        <TouchableOpacity style={{borderRadius: 100, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -10, right: -10, backgroundColor: '#F8F8F8', width: windowWidth * (32 / 800), height: Platform.isPad? windowWidth * (32 / 800) : windowHeight * (32 / 360), borderWidth: 1, borderColor: '#0000001A'}}>
                            <Image source={reload} style={{width: windowWidth * (16 / 800), height: Platform.isPad? windowWidth * (16 / 800) : windowHeight * (16 / 360), aspectRatio: 16 / 16}}/>
                        </TouchableOpacity>
                    </View>
                    {animationStart?
                    <LottieView
                        // onAnimationFinish={() => {
                        //     console.log('ran')
                        //     setAnimationStart(false)
                        // }}
                        ref={animationRef}
                        source={items[0]?.items[currentAnimation].animation}
                        loop={false}
                        autoPlay={false}
                        style={{width: windowWidth * (190 / 800), height: Platform.isPad? windowWidth * (190 / 800) : windowHeight * (190 / 360)}}
                    />
                    :
                    <View ref={containerRef} onLayout={getAbsoluteLayout} style={{width: windowWidth * (190 / 800), justifyContent: 'center', alignItems: 'center', height: Platform.isPad? windowWidth * (190 / 800) : windowHeight * (190 / 360)}}>
                        <Image source={mywisy} style={{width: Platform.isPad? windowWidth * (220 / 800) : 220, height: Platform.isPad? windowWidth * (220 / 800) : 220, aspectRatio: 220 / 220}}/>
                    </View>}
                </View>
            </View>
        )
    }

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#C4DF84',
        alignSelf: 'center',
    },
});

export default WisyPanel;