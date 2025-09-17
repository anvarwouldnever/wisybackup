import { View, Text, Platform, TouchableOpacity, PanResponder, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Svg, { SvgUri, Polyline } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'
import speaker from '../../../images/speaker2.png'

const MainContainerBlock = ({ setCurrentLine, setLines, currentLine, data, word, lines, viewShotRef, audio, voiceForTask, lock, id }) => {

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
        <Animated.View entering={ZoomInEasyDown} style={{ minWidth: windowWidth * (320 / 800), height: Platform.isPad? windowWidth * (260 / 800) : windowHeight * (260 / 360), alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute'}}>
            <View style={{ width: windowWidth * (244 / 800), height: Platform.isPad? windowWidth * (140 / 800) : windowHeight * (140 / 360), backgroundColor: '#FFFFFF', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
            {data?.content?.image.endsWith(".svg") ? <SvgUri uri={data?.content?.image} width={windowWidth * (108 / 800)} height={Platform.isPad? windowWidth * (108 / 800) : windowHeight * (108 / 360)} /> : <Image source={{ uri: data?.content?.image }} style={{width: windowWidth * (108 / 800), height: Platform.isPad? windowWidth * (108 / 800) : windowHeight * (108 / 360)}}/>}
                {audio && <TouchableOpacity onPress={lock? () => {return} : () => voiceForTask(audio)} style={{width: windowWidth * (64 / 800), borderWidth: 1, height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), borderRadius: 100, backgroundColor: '#B3ABDB', borderColor: '#DFD0EE', borderWidth: 4, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={speaker} style={{width: windowWidth * (30 / 800), height: Platform.isPad? windowWidth * (30 / 800) : windowHeight * (30 / 360)}}/>
                </TouchableOpacity>}
            </View>
            
            <View style={{ flexDirection: 'row', gap: 16 }}>
                {word.map((letter, index) => {
                    const isUnknown = letter === '*';

                    return (
                        <View key={index} style={{ width: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), height: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                            {isUnknown ? (
                                <ViewShot ref={viewShotRef} style={{ borderColor: id?.id == data.id && id?.result == 'correct'? "#ADD64D" : id?.id == data.id && id?.result == 'wrong'? '#D81616' : '#504297', borderRadius: 10, borderWidth: 2}} options={{ format: 'png', quality: 1 }}>  
                                    <View
                                        {...panResponder.panHandlers}
                                        style={{ backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), height: Platform.isPad? windowWidth * (94 / 800) : windowHeight * (94 / 360), borderRadius: 8}}
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
                            ) : (
                                <Text style={{ fontSize: 64, fontWeight: '600', textAlign: 'center', color: '#504297' }}>{letter}</Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </Animated.View>
    )
}

export default MainContainerBlock