import { View, Platform, TouchableOpacity, useWindowDimensions, Text } from "react-native";
import { useRef, useEffect, useState } from "react";

const RenderComponent13 = ({ lock, data, answer, id, setId }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const timeoutRef = useRef(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        if (data?.content?.options) {
            setShuffledOptions([...data.content.options].sort(() => Math.random() - 0.5));
        }
    }, []);

    return (
        <View style={{width: windowWidth * (592 / 800), height: windowHeight * (160 / 360), flexDirection: 'column', justifyContent: 'space-between'}}>
            <View style={{width: '100%', height: windowHeight * (40 / 360), justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#222222', fontWeight: '600', fontSize: windowWidth * (24 / 800)}}>{data?.content?.question}</Text>
            </View>
            <View style={{width: 'auto', gap: 16, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                {shuffledOptions.map((option, index) => {
                    return (
                        <TouchableOpacity onPress={lock? () => {return} : () => {
                                answer({ answer: option.id })
                                if (timeoutRef.current) {
                                    clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                                }
                                setId(null);
                            }} key={index} style={{width: windowWidth * (80 / 800), height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), backgroundColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? 'red' : 'white', borderColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? '#D81616' : 'white', borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 10, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                            <Text style={{fontWeight: '600', fontSize: windowWidth * (24 / 800), color: id?.id == null? 'black' : id?.id != null && id?.id == option.id? 'black' : '#D4D1D1'}}>{option.text}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
};

export default RenderComponent13;
