import { View, Text, Platform, Image, useWindowDimensions, PanResponder } from 'react-native'
import React from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Svg, { SvgUri, Polyline } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'

const MainContainerBlock = ({ data, viewShotRef, lines, currentLine, id, setCurrentLine, setLines }) => {

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
        <Animated.View entering={ZoomInEasyDown} style={{width: windowWidth * (592 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    
            <View style={{borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                {data.content.first_image.endsWith(".svg") ? 
                <SvgUri uri={data?.content?.first_image} width={ windowWidth * (136 / 800)} height={Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)} style={{borderRadius: 10}}/>
                : 
                <Image source={{uri: data?.content?.first_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), borderRadius: 10}}/>}
            </View>
            
            <Text style={{fontSize: 80, fontWeight: '600', color: '#555555'}}>{data?.content?.operation === 'addition'? '+' : ''}</Text>
            
            <View style={{borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                {data.content.second_image.endsWith(".svg") ?
                <SvgUri uri={data?.content?.second_image} width={ windowWidth * (136 / 800)} height={Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)} style={{borderRadius: 10}}/> 
                : 
                <Image source={{uri: data?.content?.second_image }} style={{width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), borderRadius: 10}}/>}
            </View>

            <Text style={{fontSize: 80, fontWeight: '600', color: '#555555'}}>=</Text>

            <ViewShot ref={viewShotRef} style={{borderRadius: 10, backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}} options={{ format: 'png', quality: 1 }}>  
                <View
                    {...panResponder.panHandlers}
                    style={{backgroundColor: id?.id == data?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data?.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: windowWidth * (136 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), borderRadius: 10}}
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

export default MainContainerBlock