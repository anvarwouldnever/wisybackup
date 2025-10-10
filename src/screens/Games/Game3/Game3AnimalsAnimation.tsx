import { useWindowDimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import RenderItem from './RenderItem';
import { useScale } from '../../../hooks/useScale';

const Game3AnimalsAnimation = ({ answer, id, images,  lock }) => {

    const [key, setKey] = useState(0);

    const [shuffledImages, setShuffledImages] = useState([]);

    const { s, vs } = useScale()
    
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

    return (
        <Animated.FlatList 
            entering={ZoomInEasyDown}
            data={shuffledImages?.slice(0, 5)}
            renderItem={({ item }) => (
                <RenderItem
                    item={item}
                    lock={lock}
                    answer={answer}
                    id={id}
                />
            )}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            contentContainerStyle={{width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', columnGap: s(5) }}
            style={{ width: 'auto', height: 'auto', flexDirection: 'row', alignSelf: 'center', position: 'absolute' }}
        />
    )
}

export default Game3AnimalsAnimation;