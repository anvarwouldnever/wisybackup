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
        
            // Shuffle function
            const shuffleArray = (array) => {
                let shuffledArray = [...array];
                for (let i = shuffledArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
                }
                return shuffledArray;
            };
        
            // Only shuffle once when component mounts
            useEffect(() => {
                const shuffled = shuffleArray(images);  // Assuming `images` is available
                setShuffledImages(shuffled);
            }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1); // Change key on animal or images update
    }, [images]);

    const timeoutRef = useRef(null);
    
        useEffect(() => {
                if (id?.id && id?.result) {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    timeoutRef.current = setTimeout(() => {
                        setId(null);
                    }, 2500);
                }
                return () => {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                };
            }, [id, setId]);

    const isAnimalSvg = animal && animal.endsWith('.svg');

    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return (
            <View style={{backgroundColor: 'white', width: windowWidth * (120 / 800), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), borderRadius: 10,}}>
                <TouchableOpacity onPress={lock? () => {return} : () => {
                        answer({ answer: item.id })
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                        }
                        setId(null)
                }} style={{
                    borderRadius: 10, backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', 
                    width: windowWidth * (120 / 800), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), 
                    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white',
                }}>
                    {isSvg ? (
                        <SvgUri uri={item.url} style={{ width: windowWidth * (108 / 800), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (108 / 360), aspectRatio: 1 }} />
                    ) : (
                        <Image source={{ uri: item.url }} style={{ width: windowWidth * (108 / 800), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (108 / 360), aspectRatio: 1 }} />
                    )}
                    {id?.id == item?.id && <View style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                        <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360)}}/>
                    </View>}
                </TouchableOpacity>
            </View>
        );
    };
    
    return (
        <Animated.View key={key} entering={ZoomInEasyDown} style={{ width: windowWidth * (528 / 800), height: Platform.isPad? windowWidth * (312 / 800) : windowHeight * (312 / 360), alignSelf: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between' }}>
            {animal ? (
                isAnimalSvg ? (
                    <SvgUri uri={animal} style={{ width: windowWidth * (244 / 800), height: windowHeight * (152 / 360) }} />
                ) : (
                    <Image source={{ uri: animal }} style={{ width: windowWidth * (244 / 800), height: Platform.isPad? windowWidth * (152 / 800) : windowHeight * (152 / 360), resizeMode: 'contain' }} />
                )
            ) : null}
            <View style={{ height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), alignItems: 'center' }}>
                <FlatList 
                    data={shuffledImages}
                    renderItem={renderItem}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{ width: '100%', justifyContent: 'space-evenly'}}
                />
            </View>
        </Animated.View>
    );
};

export default Game5AnimalsAnimation;
