import { View, useWindowDimensions, FlatList, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import speaker from '../../../images/speaker2.png'
import RenderItem from './RenderItem';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import { useScale } from '../../../hooks/utils/useScale';

const Game4AnimalsAnimation = ({ answer, id, audio, images, setId, lock, voiceForTask }) => {

    const { s, vs } = useScale()

    const [key, setKey] = useState(0);

    const [shuffledImages, setShuffledImages] = useState([]);

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
        <Animated.View key={key} entering={ZoomInEasyDown} style={{width: 'auto', height: 'auto', alignItems: 'center', flexDirection: 'column', rowGap: s(13)}}>
            
            <TouchableOpacity onPress={lock? () => {} : () => voiceForTask(audio)} style={{width: s(35), height: s(35), borderWidth: 1, padding: s(8), borderRadius: 100, backgroundColor: '#B3ABDB', borderColor: '#DFD0EE', borderWidth: 4, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={speaker} style={{width: '100%', height: '100%'}}/> 
            </TouchableOpacity>
            
            <View style={{ alignItems: 'center' }}>
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
                    contentContainerStyle={{ justifyContent: 'center', columnGap: s(8), alignItems: 'center' }}
                    style={{ flexGrow: 0 }}
                />
            </View>

        </Animated.View>
    )
}

export default Game4AnimalsAnimation;