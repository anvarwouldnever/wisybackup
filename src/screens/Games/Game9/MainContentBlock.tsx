import { View, Text, FlatList, PanResponder, Platform, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import  Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import Svg, { SvgUri, Polyline } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

const MainContentBlock = ({ setCurrentLine, setLines, images, currentLine, lines, data, id, viewShotRef }) => {

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

    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return isSvg ? (
            <SvgUri 
                uri={item.url} 
                width={windowWidth * (64 / 800)} 
                height={Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360)} 
                style={{borderRadius: 10}}
            />
        ) : (
            <Image 
                source={{ uri: item.url }} 
                style={{ 
                    width: windowWidth * (64 / 800), 
                    height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360),
                    borderRadius: 10
                }} 
                resizeMode="contain" 
            />
        );
    };

    return (
        <Animated.View entering={ZoomInEasyDown} style={{alignItems: 'center', width: windowWidth * (602 / 800), height: Platform.isPad? windowWidth * (239 / 800) : windowHeight * (239 / 360), flexDirection: 'column', justifyContent: 'space-between'}}>
            <View style={{width: windowWidth * (602 / 800), height: Platform.isPad? windowWidth * (84 / 800) : windowHeight * (84 / 360), alignItems: 'center', borderRadius: 10, overflow: 'hidden', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                <FlatList 
                    data={images}
                    renderItem={renderItem}
                    contentContainerStyle={{backgroundColor: 'white', alignItems: 'center', borderRadius: 10, gap: windowWidth * (10 / 800), padding: 10}}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    scrollEnabled={false }
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: windowWidth * (292 / 800), height: windowHeight * (115 / 360)}}>
                <View style={{width: windowWidth * (115 / 800), height: Platform.isPad? windowWidth * (115 / 800) : windowHeight * (115 / 360), backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                    {data.content.question_image.endsWith('.svg') ? (
                        <SvgUri 
                            uri={data?.content?.question_image} 
                            width={windowWidth * (80 / 800)} 
                            height={windowHeight * (80 / 360)} 
                        />
                    ) : (
                        <Image 
                            source={{ uri: data?.content?.question_image }} 
                            style={{
                                width: windowWidth * (80 / 800), 
                                height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360)
                            }}
                        />
                    )}
                </View>
                <Text style={{fontSize: 40, fontWeight: '600', color: '#504297'}}>=</Text>
                <ViewShot ref={viewShotRef} style={{backgroundColor: 'white', borderRadius: 10,}} options={{ format: 'png', quality: 1 }}>
                    <View
                        {...panResponder.panHandlers}
                        style={{width: windowWidth * (115 / 800), height: Platform.isPad? windowWidth * (115 / 800) : windowHeight * (115 / 360), backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}
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
            </View>
        
        </Animated.View>
    )
}

export default MainContentBlock