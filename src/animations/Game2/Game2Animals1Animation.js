import React, { useEffect, useState, useRef } from "react";
import { View, useWindowDimensions, FlatList, Text, Image, TouchableOpacity, Platform } from "react-native";
import passedimg from '../../images/gamepassed.png';
import { SvgUri } from "react-native-svg";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import galochka from '../../images/galochka.png'
import x from '../../images/wrongX.png'
import speaker from '../../images/tabler_speakerphone.png'
import { playSound } from "../../hooks/usePlayBase64Audio";

const Animals1Animation = ({ answer, id, images, animal, setId, audio }) => {
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
            const shuffled = shuffleArray(images);  // Assuming `images` is available
            setShuffledImages(shuffled);
        }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1); // Change key on animal or images update
    }, [images, animal]);
    
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
    
    const renderItem = ({ item }) => {
        const isSvg = item.url.endsWith('.svg');
    
        return (
            <View style={{backgroundColor: 'white', width: windowWidth * (120 / 800), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), borderRadius: 10,}}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                        answer({ answer: item.id })
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                        }
                        setId(null)
                    }} style={{
                    borderRadius: 10, backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item?.id && id?.result == 'wrong'? '#D816164D' : 'white',  
                    width: windowWidth * (120 / 800), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), 
                    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D' : id?.id == item?.id && id?.result == 'wrong'? '#D81616' : 'white',
                }}>
                    {isSvg ? (
                        <SvgUri uri={item.url} width={Platform.isPad? windowWidth * (100 / 800) : windowWidth * (100 / 800)} height={Platform.isPad? windowWidth * (100 / 800) : windowHeight * (100 / 360)} style={{ width: windowWidth * (108 / 800), height: Platform.isPad ? windowWidth * (108 / 360) : windowHeight * (108 / 360), aspectRatio: 1 }} />
                    ) : (
                        <Image source={{ uri: item?.url }} style={{ width: Platform.isPad? windowWidth * (100 / 800) : windowWidth * (100 / 800), height: Platform.isPad ? windowWidth * (100 / 800) : windowHeight * (100 / 360), aspectRatio: 1 }} />
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
            <Animated.View key={key} entering={ZoomInEasyDown.duration(400)} style={{width: windowWidth * (664 / 800), height: Platform.isPad? windowWidth * (228 / 800) : windowHeight * (228 / 360), position: 'absolute', alignSelf: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
                {audio? <View style={{borderRadius: 0, flexDirection: 'row', gap: 5}}>
                    <View style={{minWidth: windowWidth * (78 / 800), maxWidth: windowWidth * (500 / 800), height: windowHeight * (40 / 360), padding: windowHeight * (12 / 360), borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: id?.result == 'correct'? '#ADD64D' : id?.result == 'wrong'? '#EC6567' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: id?.result == 'correct'? '#222222' : id?.result == 'wrong'? 'white' : '#222222', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), fontWeight: '500', textAlign: 'center'}}>{animal}</Text>
                    </View>
                    <TouchableOpacity onPress={() => playSound(audio)} style={{minWidth: windowWidth * (46 / 800), maxWidth: windowWidth * (40 / 800), backgroundColor: '#B3ABDB', alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
                        <Image source={speaker} style={{width: windowWidth * (24 / 800), height:  windowWidth * (24 / 800)}}/>
                    </TouchableOpacity>  
                </View>
                :
                <View style={{backgroundColor: 'white', borderRadius: 100,}}>
                    <View style={{width: windowWidth * (192 / 800), padding: windowHeight * (12 / 360), borderRadius: 100, backgroundColor: id?.result == 'correct'? '#ADD64D' : id?.result == 'wrong'? '#EC6567' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: id?.result == 'correct'? '#222222' : id?.result == 'wrong'? 'white' : '#222222', fontSize: Platform.isPad? windowWidth * (20 / 800) : windowHeight * (20 / 360), fontWeight: '500', textAlign: 'center'}}>{animal}</Text>
                    </View> 
                </View>}
                <View style={{width: windowWidth * (664 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)}}>
                    <FlatList 
                        data={shuffledImages}
                        renderItem={renderItem}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                        contentContainerStyle={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}
                    />
                </View>
            </Animated.View>
        )
}

export default Animals1Animation;