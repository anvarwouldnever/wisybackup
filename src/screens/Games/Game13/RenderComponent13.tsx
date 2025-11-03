import { View, TouchableOpacity, Text } from "react-native";
import { useRef, useEffect, useState } from "react";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import { useScale } from "../../../hooks/utils/useScale";

const RenderComponent13 = ({ lock, data, answer, id, setId }) => {

    const timeoutRef = useRef(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const { s } = useScale();

    useEffect(() => {
        if (data?.content?.options) {
            setShuffledOptions([...data.content.options].sort(() => Math.random() - 0.5));
        }
    }, [data]);

    const onPress = (id) => {
        if (lock) return;
        answer({ answer: id });
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setId(null);
    };

    return (
        <Animated.View entering={ZoomInEasyDown} style={{ width: 'auto', height: 'auto', rowGap: s(12), flexDirection: 'column' }}>
            
            <Text adjustsFontSizeToFit numberOfLines={2} ellipsizeMode='tail' style={{ color: '#222222', fontWeight: '600', fontSize: s(11), width: s(150), maxWidth: s(200), textAlign: 'center' }}>
                {data?.content?.question}
            </Text>
            
            <View style={{ width: 'auto', height: 'auto', columnGap: s(6), alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                
                {shuffledOptions?.map((option, index) => {
                    const isSelected = id?.id === option?.id;
                    const isCorrect = isSelected && id?.result === 'correct';
                    const isWrong = isSelected && id?.result === 'wrong';

                    return (
                        <View key={index} style={{ backgroundColor: 'white', overflow: 'hidden', borderRadius: s(5), shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4 }}>
                            
                            <TouchableOpacity onPress={() => onPress(option?.id)} style={{ width: s(38), height: s(38), borderRadius: s(5), backgroundColor: isCorrect ? '#ADD64D' : isWrong ? '#D816164D' : 'white', borderColor: isCorrect ? '#ADD64D' : isWrong ? '#D816164D' : 'white', borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                
                                <Text style={{ fontWeight: '600', fontSize: s(10), color: '#000000' }}>{option?.text}</Text>
                            
                            </TouchableOpacity>

                        </View>
                    );
                })}

            </View>

        </Animated.View>
    );
};

export default RenderComponent13;

