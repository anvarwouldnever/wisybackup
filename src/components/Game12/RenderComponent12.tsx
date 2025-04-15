import { View, Platform, TouchableOpacity, Text, Image, useWindowDimensions } from "react-native";
import { playSound } from "../../hooks/usePlayBase64Audio";
import { useRef, useEffect, useState } from "react";
import speaker from '../../images/tabler_speakerphone.png';
import grayspeaker from '../../images/grayspeaker.png';
import black from '../../images/tabler_speakerphone2.png';

const RenderGame12Component = ({ data, lock, setId, id, answer, voiceForTask }) => {
    const timeoutRef = useRef(null);
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        if (data?.content?.options) {
            setShuffledOptions([...data.content.options].sort(() => Math.random() - 0.5));
        }
    }, []);

    return (
        <View style={{width: windowWidth * (440 / 800), height: 'auto', flexDirection: 'column',  gap: windowWidth * (24 / 800), justifyContent: 'flex-start'}}>
            <View style={{width: '100%', height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#222222', fontWeight: '600', fontSize: windowWidth * (24 / 800)}}>{data?.content?.question}</Text>
            </View>
            <View style={{width: windowWidth * (440 / 800), height: 'auto', gap: windowWidth * (12 / 800), justifyContent: 'space-between', alignItems: 'center'}}>
                {shuffledOptions.map((option, index) => {

                    return (
                        <View key={index} style={{width: windowWidth * (440 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 100, shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                            <View style={{backgroundColor: 'white', borderRadius: 100, borderTopLeftRadius: 100, borderBottomLeftRadius: 100, borderTopRightRadius: option.audio === null? 100 : 0, borderBottomRightRadius: option.audio === null? 100 : 0}}>
                                <TouchableOpacity onPress={!lock? () => {
                                    answer({ answer: option.id })
                                    if (timeoutRef.current) {
                                        clearTimeout(timeoutRef.current); // Сбрасываем таймер, если был установлен
                                    }
                                    setId(null);
                                    } : () => {return}} style={{width: option.audio != null ? windowWidth * (390 / 800) : windowWidth * (440 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), 
                                    backgroundColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? '#D816164D' : 'white', borderColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? '#D816164D' : 'white', 
                                    borderTopLeftRadius: 100, borderBottomLeftRadius: 100, borderTopRightRadius: option.audio === null? 100 : 0, borderBottomRightRadius: option.audio === null? 100 : 0, justifyContent: 'center', paddingLeft: 16}}>
                                    <Text style={{fontWeight: '600', fontSize: windowWidth * (12 / 800), color: id?.id != null && id?.id == option.id? '#222222' : id?.id != null && id?.id != option.id? '#D4D1D1' : '#222222', textAlign: option.audio === null? 'center' : 'left'}}>
                                        {option?.text}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {option.audio != null && 
                            <View style={{borderTopRightRadius: 100, borderBottomRightRadius: 100, backgroundColor: 'white'}}>
                                <TouchableOpacity onPress={lock? () => {return} : () => voiceForTask(option?.audio)} style={{width: windowWidth * (46 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: id?.id != null && id?.id != option.id? 'white' : id?.result == 'wrong'? '#D816164D' : id?.result == 'correct'? '#ADD64D' : '#B3ABDB', borderTopRightRadius: 100, borderBottomRightRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={id?.id != null && id?.id != option.id? grayspeaker : id?.result == 'correct' || 'wrong' && id?.id == option.id? black : speaker} style={{width: windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (24 / 800) : windowHeight * (24 / 360)}}/>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    )
                })}
            </View>
        </View>
    )
};

export default RenderGame12Component;
