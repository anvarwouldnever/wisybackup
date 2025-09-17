import { useWindowDimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import RenderItem from './RenderItem';

const Game3AnimalsAnimation = ({ answer, id, images,  lock }) => {

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
    
    const { width: windowWidth } = useWindowDimensions();

    return (
        <Animated.View entering={ZoomInEasyDown} style={{width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', alignSelf: 'center', position: 'absolute', padding: 5}}>
            <FlatList 
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
                contentContainerStyle={{width: '100%', justifyContent: 'center', alignItems: 'center', gap: windowWidth * (15 / 800), padding: 10}}
            />
        </Animated.View>
    )
}

export default Game3AnimalsAnimation;