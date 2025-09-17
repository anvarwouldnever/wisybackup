import { View, Text, Platform, useWindowDimensions, PanResponder } from 'react-native'
import React from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Svg, { Polyline } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'

const MainContainerBlock = ({ viewShotRef, lines, currentLine, id, data, setCurrentLine, setLines }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentLine([`${locationX},${locationY}`]);
        },
        onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentLine((prev) => [...prev, `${locationX},${locationY}`]);
        },
        onPanResponderRelease: () => {
        setLines((prev) => [...prev, currentLine]);
        setCurrentLine([]);
        },
    });
                 

    return (
        <Animated.View entering={ZoomInEasyDown} style={{width: windowWidth * (408 / 800), height: windowHeight * (184 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: windowWidth * (184 / 800), height: Platform.isPad? windowWidth * (184 / 800) : windowHeight * (184 / 360), borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                <Text style={{fontSize: 112, color: "#504297", fontWeight: '600', textAlign: 'center'}}>A</Text>
            </View>
            <ViewShot ref={viewShotRef} style={{backgroundColor: 'white', borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}} options={{ format: 'png', quality: 1 }}>  
                <View
                    {...panResponder.panHandlers}
                    style={{backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: windowWidth * (184 / 800), height: Platform.isPad? windowWidth * (184 / 800) : windowHeight * (184 / 360), borderRadius: 10}}
                >
                    <Svg height='100%' width='100%'>
                    {lines.map((line, index) => (
                        <Polyline
                        key={index}
                        points={line.join(' ')}
                        stroke="#504297"
                        strokeWidth="3"
                        fill="none"
                        />
                    ))}
                    <Polyline
                        points={currentLine.join(' ')}
                        stroke="#504297"
                        strokeWidth="3"
                        fill="none"
                    />
                    </Svg>
                </View>
            </ViewShot>
        </Animated.View>
    )
}

export default MainContainerBlock;