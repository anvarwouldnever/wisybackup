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
    
        // useEffect(() => {
        //     if (id?.id && id?.result) {
        //         if (timeoutRef.current) {
        //             clearTimeout(timeoutRef.current);
        //         }
        //         timeoutRef.current = setTimeout(() => {
        //             setId(null);
        //         }, 2500);
        //     }
        //     return () => {
        //         if (timeoutRef.current) {
        //             clearTimeout(timeoutRef.current);
        //         }
        //     };
        // }, [id, setId]);

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

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
                    borderRadius: 10, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', 
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
        <Animated.View key={key} entering={ZoomInEasyDown} style={{width: windowWidth * (664 / 800), height: windowHeight * (120 / 360), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', alignSelf: 'center', position: 'absolute'}}>
            <FlatList 
                data={shuffledImages}
                renderItem={renderItem}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                contentContainerStyle={{width: '100%', justifyContent: 'space-evenly'}}
            />
        </Animated.View>
    )
}

export default Game3AnimalsAnimation;

// const answer = (name) => {
//     if (name === 'monkey') {
//         setIncorrectAnimal('')
//         setText('Good job!')
//         setCorrect(true)
//         setTimeout(() => {
//             setLevel(2)
//             setText('Let’s try other animals..')
//         }, 2000);
//     } else {
//         setIncorrectAnimal(name)
//         setText('All animals in the row are lions except one..')
//     }
// }