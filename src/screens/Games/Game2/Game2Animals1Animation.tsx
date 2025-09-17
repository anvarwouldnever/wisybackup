import React, { useEffect, useState } from "react";
import { View, useWindowDimensions, FlatList, Text, Image, TouchableOpacity, Platform } from "react-native";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import speaker from '../../../images/tabler_speakerphone.png'
import RenderItem from "./AnswerButton";

const Game2Animals1Animation = ({ answer, id, images, animal, setId, audio, lock, voiceForTask }) => {
    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [key, setKey] = useState(0);

    const [shuffledImages, setShuffledImages] = useState();
    
    const shuffleArray = (array) => {
            let shuffledArray = [...array];
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
            }
            return shuffledArray;
    };
    
    useEffect(() => {
            const shuffled = shuffleArray(images);
            setShuffledImages(shuffled);
    }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [images, animal]);

    return (
            <Animated.View key={key} entering={ZoomInEasyDown.duration(400)} style={{width: windowWidth * (664 / 800), height: Platform.isPad? windowWidth * (228 / 800) : windowHeight * (228 / 360), position: 'absolute', alignSelf: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
                {audio? <View style={{borderRadius: 0, flexDirection: 'row', gap: 5}}>
                    <View style={{minWidth: windowWidth * (78 / 800), maxWidth: windowWidth * (500 / 800), height: Platform.isPad? windowHeight * (60 / 800) : windowHeight * (40 / 360), padding: Platform.isPad? windowHeight * (12 / 800) : windowHeight * (12 / 360), borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: id?.result == 'correct'? '#ADD64D' : id?.result == 'wrong'? '#EC6567' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: id?.result == 'correct'? '#222222' : id?.result == 'wrong'? 'white' : '#222222', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), fontWeight: '500', textAlign: 'center'}}>{animal}</Text>
                    </View>
                    <TouchableOpacity onPress={lock? () => {return} : () => voiceForTask(audio)} style={{minWidth: windowWidth * (46 / 800), maxWidth: windowWidth * (40 / 800), backgroundColor: '#B3ABDB', alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
                        <Image source={speaker} style={{width: windowWidth * (24 / 800), height:  windowWidth * (24 / 800)}}/>
                    </TouchableOpacity>  
                </View>
                :
                <View style={{backgroundColor: 'white', borderRadius: 100,}}>
                    <View style={{maxWidth: windowWidth * (500 / 800), minWidth: windowWidth * (192 / 800), padding: windowHeight * (12 / 360), borderRadius: 100, backgroundColor: id?.result == 'correct'? '#ADD64D' : id?.result == 'wrong'? '#EC6567' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: id?.result == 'correct'? '#222222' : id?.result == 'wrong'? 'white' : '#222222', fontSize: Platform.isPad? windowWidth * (20 / 800) : windowHeight * (20 / 360), fontWeight: '500', textAlign: 'center'}}>{animal}</Text>
                    </View> 
                </View>}
                <View style={{width: windowWidth * (664 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360)}}>
                    <FlatList 
                        data={shuffledImages?.slice(0, 5)}
                        renderItem={({ item }) => (
                            <RenderItem 
                                item={item} 
                                id={id}
                                lock={lock}
                                answer={answer}
                                setId={setId}
                            />
                        )}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                        contentContainerStyle={{width: '100%', flexDirection: 'row', justifyContent: 'center', gap: windowWidth * (15 / 800), alignItems: 'center'}}
                    />
                </View>
            </Animated.View>
        )
}

export default Game2Animals1Animation;