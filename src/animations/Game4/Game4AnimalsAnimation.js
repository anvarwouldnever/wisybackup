import { View, useWindowDimensions, FlatList, Image, TouchableOpacity, Platform, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import passedimg from '../../images/gamepassed.png';
import speaker from '../../images/speaker2.png'
import store from '../../store/store'
import { SvgUri } from "react-native-svg";
import { Audio } from 'expo-av';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import galochka from '../../images/galochka.png'
import x from '../../images/wrongX.png'
import { playSound } from '../../hooks/usePlayBase64Audio';

const Game4AnimalsAnimation = ({ answer, id, audio, images, setId, lock, voiceForTask }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [key, setKey] = useState(0);

    const [shuffledImages, setShuffledImages] = useState();

    const shuffleArray = (array) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        return shuffledArray;
    };

    useEffect(() => {
        const shuffled = shuffleArray(images); 
        setShuffledImages(shuffled);
    }, []);
    

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [images, audio]);

    const timeoutRef = useRef(null);

    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return (
            <View style={{backgroundColor: 'white', width: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (122 / 360), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (122 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={lock? () => {return} : () => {
                    answer({ answer: item.id })
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setId(null);
                }} style={{
                    borderRadius: 10, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', 
                    width: '100%', height: '100%', 
                    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white',
                    shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
                }}>
                    {isSvg ? (
                        <SvgUri uri={item.url} style={{ width: windowHeight * (120 / 360), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (120 / 360), aspectRatio: 1, borderRadius: 5 }} />
                    ) : (
                        <Image source={{ uri: item.url }} style={{ width: windowHeight * (108 / 360), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (108 / 360), aspectRatio: 1, borderRadius: 5, alignSelf: 'center', resizeMode: 'center'}} />
                    )}
                    {item.name === 'monkey' && <Image source={passedimg} style={{ width: windowWidth * (24 / 800), height: Platform.isPad ? windowWidth * (24 / 800) : windowHeight * (24 / 360), position: 'absolute', right: 4, top: 4 }} />}
                    {id?.id == item?.id && <View style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                        <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360)}}/>
                    </View>}
                </TouchableOpacity>
            </View>
        );
    };
    
    return (
        <Animated.View key={key} entering={ZoomInEasyDown} style={{width: windowWidth * (664 / 800), height: Platform.isPad? windowWidth * (232 / 800) : windowHeight * (232 / 360), position: 'absolute', alignSelf: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={lock? () => {} : () => voiceForTask(audio)} style={{width: Platform.isPad ? windowWidth * (80 / 800) : windowHeight * (80 / 360), borderWidth: 1, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), borderRadius: 100, backgroundColor: '#B3ABDB', borderColor: '#DFD0EE', borderWidth: 4, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={speaker} style={{width: windowWidth * (40 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360)}}/>
            </TouchableOpacity>
            <View style={{height: Platform.isPad? windowWidth * (135 / 800) : windowHeight * (138 / 360), alignItems: 'center', width: 'auto'}}>
                <FlatList 
                    data={shuffledImages?.slice(0, 4)}
                    renderItem={renderItem}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{width: '100%', justifyContent: 'center', height: 'auto', gap: windowWidth * (25 / 800), alignItems: 'center'}}
                />
            </View>
        </Animated.View>
    )
}

export default Game4AnimalsAnimation;