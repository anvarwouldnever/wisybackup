import { useWindowDimensions, FlatList, TouchableOpacity, Platform, Image, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import passedimg from '../../images/gamepassed.png';
import { SvgUri } from 'react-native-svg';
import galochka from '../../images/galochka.png'
import x from '../../images/wrongX.png'

const Game3AnimalsAnimation = ({ answer, id, images, setId, lock }) => {

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
    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return (
            <View style={{backgroundColor: 'white', width: windowWidth * (120 / 800), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={lock? () => {return} : () => {
                    answer({ answer: item.id })
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setId(null);
                }} style={{
                    borderRadius: 10, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', 
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

    return (
        <Animated.View key={key} entering={ZoomInEasyDown} style={{width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', alignSelf: 'center', position: 'absolute', padding: 5}}>
            <FlatList 
                data={shuffledImages?.slice(0, 5)}
                renderItem={renderItem}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                contentContainerStyle={{width: '100%', justifyContent: 'center', alignItems: 'center', gap: windowWidth * (15 / 800), padding: 10}}
            />
        </Animated.View>
    )
}

export default Game3AnimalsAnimation;