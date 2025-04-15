import { View, Image, TouchableOpacity, FlatList, Platform, useWindowDimensions } from 'react-native';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import SvgUri from 'react-native-svg';
import React, { useState, useEffect, useRef } from 'react';
import galochka from '../../images/galochka.png'
import x from '../../images/wrongX.png'

const Game5AnimalsAnimation = ({ answer, id, images, animal, thinking, setId, lock }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [key, setKey] = useState(0);

    const [shuffledImages, setShuffledImages] = useState();
        
    const shuffleArray = (array) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; 
        }
        return shuffledArray;
    };

    useEffect(() => {
        const shuffled = shuffleArray(images);
        setShuffledImages(shuffled);
    }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [images]);

    const timeoutRef = useRef(null);
    
    const isAnimalSvg = animal && animal.endsWith('.svg');

    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return (
            <View style={{backgroundColor: 'white', width: windowHeight * (120 / 360), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={lock? () => {return} : () => {
                        answer({ answer: item.id })
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                        setId(null)
                }} style={{
                    borderRadius: 10, backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', 
                    width: windowHeight * (120 / 360), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), 
                    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white',
                    shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
                }}>
                    {isSvg ? (
                        <SvgUri uri={item.url} style={{ width: windowHeight * (108 / 360), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (108 / 360), aspectRatio: 1, borderRadius: 10 }} />
                    ) : (
                        <Image source={{ uri: item.url }} style={{ width: windowHeight * (108 / 360), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (108 / 360), aspectRatio: 1, borderRadius: 10 }} />
                    )}
                    {id?.id == item?.id && <View style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                        <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360)}}/>
                    </View>}
                </TouchableOpacity>
            </View>
        );
    };

    // console.log(animal)
    
    return (
        <Animated.View key={key} entering={ZoomInEasyDown} style={{ width: windowWidth * (528 / 800), height: Platform.isPad? windowWidth * (312 / 800) : windowHeight * (312 / 360), alignSelf: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
            {animal ? (
                isAnimalSvg ? (
                    <SvgUri uri={animal} style={{ width: windowWidth * (244 / 800), height: windowHeight * (152 / 360), borderWidth: 3, borderColor: 'white', borderRadius: 16, resizeMode: 'cover' }}/>
                ) : (
                    <Image source={{ uri: animal }} style={{ width: windowWidth * (244 / 800), height: Platform.isPad? windowWidth * (152 / 800) : windowHeight * (152 / 360), resizeMode: 'cover', borderWidth: 3, borderColor: 'white', borderRadius: 16 }} />
                )
            ) : null}
            <View style={{ height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (130 / 360), alignItems: 'center', justifyContent: 'center'}}>
                <FlatList 
                    data={shuffledImages?.slice(0, 4)}
                    renderItem={renderItem}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{ width: '100%', justifyContent: 'center', flexDirection: 'row', gap: windowWidth * (10 / 800), alignItems: 'center', padding: 10}}
                />
            </View>
        </Animated.View>
    );
};

export default Game5AnimalsAnimation;
