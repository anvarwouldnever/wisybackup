import { View, useWindowDimensions, FlatList, Image, TouchableOpacity, Platform, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import speaker from '../../../images/speaker2.png'
import RenderItem from './RenderItem';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';

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
    
    return (
        <Animated.View key={key} entering={ZoomInEasyDown} style={{width: windowWidth * (664 / 800), height: Platform.isPad? windowWidth * (232 / 800) : windowHeight * (232 / 360), position: 'absolute', alignSelf: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={lock? () => {} : () => voiceForTask(audio)} style={{width: Platform.isPad ? windowWidth * (80 / 800) : windowHeight * (80 / 360), borderWidth: 1, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), borderRadius: 100, backgroundColor: '#B3ABDB', borderColor: '#DFD0EE', borderWidth: 4, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={speaker} style={{width: windowWidth * (40 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360)}}/>
            </TouchableOpacity>
            <View style={{height: Platform.isPad? windowWidth * (135 / 800) : windowHeight * (138 / 360), alignItems: 'center', width: 'auto'}}>
                <FlatList 
                    data={shuffledImages?.slice(0, 5)}
                    renderItem={({ item }) => (
                        <RenderItem
                            item={item}
                            lock={lock}
                            answer={answer}
                            setId={setId}
                            id={id}
                        />
                    )}
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