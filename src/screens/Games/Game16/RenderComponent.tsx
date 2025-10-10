import { useEffect, useState , useRef} from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { SvgUri } from "react-native-svg";
import Animated, { ZoomInEasyDown } from "react-native-reanimated";
import { useScale } from "../../../hooks/useScale";

const RenderComponent = ({ animal, isAnimalSvg, answer, setId, id, lock, data, voice }) => {

    const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (data?.content?.options) {
            setShuffledOptions([...data?.content?.options].sort(() => Math.random() - 0.5));
        }
    }, []);

    const { s, vs } = useScale()

    const onPress = (id) => {
        if (lock) return
        answer({ answer: id });
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setId(null);
    }

    return (
        <Animated.View entering={ZoomInEasyDown} style={{ width: 'auto', height: 'auto', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', rowGap: s(17) }}>
            
            <View style={{ width: s(68), height: s(68), borderRadius: s(5), overflow: 'hidden', padding: s(2), backgroundColor: 'white' }}>
                {animal ? 
                    (
                        isAnimalSvg ? 
                            <SvgUri uri={animal} width={'100%'} height={'100%'} style={{ borderRadius: s(5) }} />
                        : 
                            <Image source={{ uri: animal }} style={{ resizeMode: 'contain', width: '100%', height: '100%', borderRadius: s(5) }} />
                    ) : null
                }
            </View>
            
            <View style={{ width: 'auto', columnGap: s(10), height: 'auto', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                {shuffledOptions.map((option, index) => (
                    !option.audio ? (
                        <View key={index} style={{ borderRadius: 100, backgroundColor: 'white' }}>
                            <TouchableOpacity
                                onPress={() => onPress(option?.id)}
                                style={{
                                    minWidth: s(55),
                                    maxWidth: s(65),
                                    height: s(25),
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
                                        fontSize: s(6),
                                        color: id?.id == null ? 'black' : id?.id != null && id?.id == option.id ? 'black' : '#D4D1D1',
                                    }}
                                >
                                    {option?.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View key={index} style={{ width: 'auto', height: 'auto', flexDirection: 'row', columnGap: s(2) }}>
                            
                            <View style={{ backgroundColor: 'white', borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0, }}>
                                <TouchableOpacity onPress={() => onPress(option?.id)} style={{ minWidth: s(55), maxWidth: s(65), height: s(20), alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: id?.id == option?.id && id?.result == 'correct' ? '#ADD64D' : id?.id == option.id && id?.result == 'wrong' ? '#D816164D' : 'white', borderColor: id?.id == option?.id && id?.result == 'correct' ? '#ADD64D' : id?.id == option.id && id?.result == 'wrong' ? '#D816164D' : 'white'}}>
                                    <Text style={{ fontWeight: '600', fontSize: s(6), color: 'black' }}>
                                        {option?.text}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ backgroundColor: 'white', borderRadius: 100, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                                <TouchableOpacity onPress={!lock? () => voice(option?.audio) : () => {return}} 
                                    style={{
                                        width: s(20),
                                        height: s(20),
                                        backgroundColor: id?.id == option.id && id?.result == 'correct' ? '#ADD64D' : id?.id == option.id && id?.result == 'wrong' ? '#D816164D' : '#B3ABDB',
                                        borderRadius: 100,
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image source={id?.id == option?.id && id?.result == 'correct' ? require('../../../images/tabler_speakerphone2.png') : id?.id == option?.id && id?.result == 'wrong' ? require('../../../images/darkRedSpeaker.png') : require('../../../images/tabler_speakerphone2.png')} style={{ width: s(11), height: s(11) }} />
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    )
                ))}
            </View>
        </Animated.View>
    )
}

export default RenderComponent;
