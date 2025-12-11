import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import RenderItem from "./AnswerButton";
import { useScale } from "../../../hooks/utils/useScale";

const Game2Animals1Animation = ({ answer, id, images, animal, setId, audio, lock, voiceForTask, clicked }) => {

    const [key, setKey] = useState(0);

    const [shuffledImages, setShuffledImages] = useState([]);
    
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

    const { s, vs } = useScale()

    return (
            <Animated.View key={key} entering={ZoomInEasyDown.duration(400)} style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'column', rowGap: s(20)}}>
                
                {audio? 
                    <View style={{borderRadius: 0, flexDirection: 'row', columnGap: s(2)}}>
                        
                        <View style={{ minHeight: s(20), minWidth: s(60), maxWidth: s(200), borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingHorizontal: s(5), backgroundColor: id?.result == 'correct'? '#ADD64D' : id?.result == 'wrong'? '#EC6567' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: id?.result == 'correct'? '#222222' : id?.result == 'wrong'? 'white' : '#222222', fontSize: s(7), fontWeight: '500', textAlign: 'center'}}>{animal}</Text>
                        </View>

                        <TouchableOpacity onPress={lock? () => {return} : () => voiceForTask(audio)} style={{ paddingHorizontal: s(6), backgroundColor: '#B3ABDB', alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
                            <Image source={require('../../../images/tabler_speakerphone.png')} style={{width: s(12), height: s(12)}}/>
                        </TouchableOpacity>

                    </View>
                :
                    <View style={{ backgroundColor: 'white', borderRadius: 100 }}>
                        <View style={{ minHeight: s(25), minWidth: s(60), maxWidth: s(200), borderRadius: 100, backgroundColor: id?.result == 'correct'? '#ADD64D' : id?.result == 'wrong'? '#EC6567' : 'white', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: id?.result == 'correct'? '#222222' : id?.result == 'wrong'? 'white' : '#222222', fontSize: s(9), fontWeight: '500', textAlign: 'center'}}>{animal}</Text>
                        </View> 
                    </View>
                }

                
                <FlatList 
                    data={shuffledImages?.slice(0, 5)}
                    renderItem={({ item }) => (
                        <RenderItem
                            clicked={clicked}
                            item={item} 
                            id={id}
                            lock={lock}
                            answer={answer}
                            setId={setId}
                        />
                    )}
                    horizontal={true}
                    keyExtractor={(item, index) => item?.id.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', columnGap: s(8) }}
                    style={{ flexGrow: 0 }}
                />
                
                
            </Animated.View>
        )
}

export default Game2Animals1Animation;