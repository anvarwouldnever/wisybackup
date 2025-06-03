import { useEffect, useState , useRef} from "react";
import { View, Platform, TouchableOpacity, useWindowDimensions, Image, Text } from "react-native";
import { SvgUri } from "react-native-svg";
import { playSound2 } from "../../hooks/usePlaySound2";
import blackRed from '../../images/darkRedSpeaker.png';
import black from '../../images/tabler_speakerphone2.png';
import { playSound } from "../../hooks/usePlayBase64Audio";

const RenderComponent = ({ animal, isAnimalSvg, answer, setId, id, lock, data, voice }) => {
    const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
    const timeoutRef = useRef(null);
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    useEffect(() => {
        if (data?.content?.options) {
            setShuffledOptions([...data.content.options].sort(() => Math.random() - 0.5));
        }
    }, []);

    return (
        <View style={{ width: windowWidth * (392 / 800), height: Platform.isPad ? windowWidth * (360 / 800) : windowHeight * (280 / 360), flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center'}}>
            <View style={{ backgroundColor: 'white', borderRadius: 10, width: 'auto', height: 'auto', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4 }}>
                {animal ? (
                    isAnimalSvg ? (
                        <SvgUri uri={animal} style={{ width: windowWidth * (176 / 800), height: windowHeight * (176 / 360) }} />
                    ) : (
                        <Image source={{ uri: animal }} style={{ width: windowWidth * (176 / 800), height: Platform.isPad ? windowWidth * (176 / 800) : windowHeight * (176 / 360), resizeMode: 'cover', borderWidth: 2, borderColor: 'white', borderRadius: 10, aspectRatio: 1 }} />
                    )
                ) : null}
            </View>
            <View style={{ width: windowWidth * (575 / 800), gap: 16, height: Platform.isPad ? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                {shuffledOptions.map((option, index) => (
                    !option.audio ? (
                        <View key={index} style={{ borderRadius: 100, backgroundColor: 'white' }}>
                            <TouchableOpacity
                                onPress={lock ? () => { return } : () => {
                                    answer({ answer: option.id });
                                    if (timeoutRef.current) {
                                        clearTimeout(timeoutRef.current);
                                    }
                                    setId(null);
                                }}
                                style={{
                                    width: windowWidth * (120 / 800),
                                    height: Platform.isPad ? windowWidth * (56 / 800) : windowHeight * (56 / 360),
                                    backgroundColor: id?.id == option.id && id?.result == 'correct' ? '#ADD64D4D' : id?.id == option.id && id?.result == 'wrong' ? '#D816164D' : 'white',
                                    borderColor: id?.id == option.id && id?.result == 'correct' ? '#ADD64D' : id?.id == option.id && id?.result == 'wrong' ? '#D81616' : 'white',
                                    borderWidth: 2,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 100,
                                    shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: '600',
                                        fontSize: windowWidth * (14 / 800),
                                        color: id?.id == null ? 'black' : id?.id != null && id?.id == option.id ? 'black' : '#D4D1D1',
                                    }}
                                >
                                    {option?.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View key={index} style={{ width: windowWidth * (181 / 800), height: Platform.isPad ? windowWidth * (40 / 800) : windowHeight * (40 / 360), flexDirection: 'row', gap: 5 }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0, }}>
                                <TouchableOpacity
                                    onPress={lock ? () => { return } : () => {
                                        answer({ answer: option.id });
                                        if (timeoutRef.current) {
                                            clearTimeout(timeoutRef.current);
                                        }
                                        setId(null);
                                    }}
                                    style={{
                                        width: windowWidth * (131 / 800),
                                        height: Platform.isPad ? windowWidth * (40 / 800) : windowHeight * (40 / 360),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 100,
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                        backgroundColor: id?.id == option.id && id?.result == 'correct' ? '#ADD64D' : id?.id == option.id && id?.result == 'wrong' ? '#D816164D' : 'white',
                                        borderColor: id?.id == option.id && id?.result == 'correct' ? '#ADD64D' : id?.id == option.id && id?.result == 'wrong' ? '#D816164D' : 'white',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: '600',
                                            fontSize: windowWidth * (12 / 800),
                                            color: 'black'
                                        }}
                                    >
                                        {option.text}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderRadius: 100, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: 'white' }}>
                                <TouchableOpacity onPress={!lock? () => voice(option?.audio) : () => {return}} style={{
                                    width: windowWidth * (46 / 800),
                                    height: Platform.isPad ? windowWidth * (40 / 800) : windowHeight * (40 / 360),
                                    backgroundColor: id?.id == option.id && id?.result == 'correct' ? '#ADD64D' : id?.id == option.id && id?.result == 'wrong' ? '#D816164D' : '#B3ABDB',
                                    borderRadius: 100,
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image source={id?.id == option?.id && id?.result == 'correct' ? black : id?.id == option?.id && id?.result == 'wrong' ? blackRed : black} style={{ width: windowWidth * (24 / 800), height: windowWidth * (24 / 800) }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                ))}
            </View>
        </View>
    )
}

export default RenderComponent;
