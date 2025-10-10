import { View, Image, TouchableOpacity, FlatList } from 'react-native';
import Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import SvgUri from 'react-native-svg';
import React, { useState, useEffect, useRef } from 'react';
import galochka from '../../../images/galochka.png'
import x from '../../../images/wrongX.png'
import { useScale } from '../../../hooks/useScale';

const Game5AnimalsAnimation = ({ answer, id, images, animal, setId, lock }) => {

    const { s, vs } = useScale()

    const [key, setKey] = useState(0);

    const [shuffledImages, setShuffledImages] = useState([]);
        
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

    const onPress = (id) => {
        if (lock) return
        answer({ answer: id});
        if (timeoutRef.current) clearTimeout(timeoutRef.current);    
        timeoutRef.current = setTimeout(() => {
            setId(null);
         }, 100)
    }

    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return (
            <View style={{backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                
                <TouchableOpacity onPress={() => onPress(item?.id)} style={{ borderRadius: 10, width: s(55), height: s(55), padding: s(1), backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                    
                    {isSvg ? (
                        <SvgUri uri={item?.url} width={'100%'} height={'100%'} style={{ aspectRatio: 1, borderRadius: 10 }} />
                    ) : (
                        <Image source={{ uri: item?.url }} style={{ width: '100%', height: '100%', aspectRatio: 1, borderRadius: 10 }} />
                    )}

                    {id?.id === item?.id && 
                        <View style={{width: 'auto', height: 'auto', position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                            <Image source={id?.result == 'correct'? galochka : x} style={{width: s(10), height: s(10), resizeMode: 'contain'}}/>
                        </View>
                    }

                </TouchableOpacity>

            </View>
        );
    };
    
    return (
        <Animated.View key={key} entering={ZoomInEasyDown} style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', rowGap: s(15) }}>
            
            <View style={{ width: s(110), height: s(65), borderRadius: 16, overflow: 'hidden', borderWidth: 3, borderColor: 'white' }}>
                {animal ? 
                    (
                        isAnimalSvg ? 
                            <SvgUri uri={animal} width={'100%'} height={'100%'}/>
                        : 
                            <Image source={{ uri: animal }} style={{ width: '100%', height: '100%', resizeMode: 'cover'  }} />
                    ) : null
                }
            </View>
            
            <FlatList 
                data={shuffledImages?.slice(0, 4)}
                renderItem={renderItem}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row', columnGap: s(8), alignItems: 'center', padding: s(2)}}
                style={{ flexGrow: 0 }}
            />

        </Animated.View>
    );
};

export default Game5AnimalsAnimation;
