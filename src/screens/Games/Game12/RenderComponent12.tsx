import { View, TouchableOpacity, Text, Image } from "react-native";
import { useRef, useEffect, useState } from "react";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import { useScale } from "../../../hooks/utils/useScale";

const RenderGame12Component = ({ data, lock, setId, id, answer, voiceForTask }) => {

    const timeoutRef = useRef(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const { s, vs } = useScale();

    useEffect(() => {
        if (data?.content?.options) setShuffledOptions([...data.content.options].sort(() => Math.random() - 0.5));
    }, []);

    const onPress = (id) => {
        if (lock) return;
        answer({ answer: id });
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setId(null);
    };

    return (
        <Animated.View entering={ZoomInEasyDown} style={{ width: 'auto', height: 'auto', flexDirection: 'column', rowGap: s(10) }}>
            
            <Text style={{color: '#222', fontWeight: '600', fontSize: s(10), minWidth: s(150), textAlign: 'center'}}>{data?.content?.question}</Text>

            <View style={{rowGap: s(5), alignItems: 'center'}}>
                
                {shuffledOptions.map((option, index) => {

                    const isSelected = id?.id === option.id;
                    const isCorrect = id?.result === 'correct' && isSelected;
                    const isWrong = id?.result === 'wrong' && isSelected;

                    return (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center', borderRadius: 100, columnGap: s(2), shadowColor: "#D0D0D0", shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 4}}>
                            
                            <View style={{backgroundColor: 'white', borderRadius: 100, borderTopRightRadius: option?.audio ? 0 : 100, borderBottomRightRadius: option?.audio ? 0 : 100}}>
                                
                                <TouchableOpacity onPress={() => onPress(option?.id)} style={{minWidth: s(150), height: s(18), backgroundColor: isCorrect ? '#ADD64D' : isWrong ? '#D816164D' : 'white', borderColor: isCorrect ? '#ADD64D' : isWrong ? '#D816164D' : 'white', borderTopLeftRadius: 100, borderBottomLeftRadius: 100, borderTopRightRadius: option?.audio ? 0 : 100, borderBottomRightRadius: option?.audio ? 0 : 100, justifyContent: 'center', paddingHorizontal: s(8)}}>
                                    
                                    <Text style={{fontWeight: '600', fontSize: s(6), color: '#222222', textAlign: option.audio === null ? 'center' : 'left'}}>{option?.text}</Text>
                                
                                </TouchableOpacity>

                            </View>

                            {option.audio && 
                                
                                <View style={{borderTopRightRadius: 100, borderBottomRightRadius: 100, backgroundColor: 'white'}}>
                                    
                                    <TouchableOpacity onPress={lock ? undefined : () => voiceForTask(option?.audio)} style={{width: s(21), height: s(18), backgroundColor: isCorrect ? '#ADD64D' : isWrong ? '#D816164D' : '#B3ABDB', borderTopRightRadius: 100, borderBottomRightRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                                        
                                        <Image source={isCorrect || isWrong ? require('../../../images/tabler_speakerphone2.png') : require('../../../images/tabler_speakerphone.png')} style={{width: s(11), height: s(11)}}/>
                                    
                                    </TouchableOpacity>

                                </View>

                            }

                        </View>
                    );
                })}

            </View>

        </Animated.View>
    );
};

export default RenderGame12Component;
