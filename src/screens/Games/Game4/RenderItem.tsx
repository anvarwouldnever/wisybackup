import { View, TouchableOpacity, Image } from 'react-native'
import React, { useRef } from 'react'
import { SvgUri } from 'react-native-svg';
import { useScale } from '../../../hooks/utils/useScale';

const RenderItem = ({ item, lock, answer, setId, id }) => {

    const isSvg = item.url.endsWith('.svg');

    const { s, vs } = useScale()
        
    const timeoutRef = useRef(null);

    const onPress = (id) => {
        if (lock) return
        answer({ answer: id })
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setId(null);
    }
    
    return (  
        <View style={{ backgroundColor: 'white', borderRadius: 10 }}>
            
            <TouchableOpacity onPress={() => onPress(item?.id)} style={{ width: s(55), height: s(55), padding: s(1), borderRadius: 10, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                
                {isSvg ? (
                    <SvgUri uri={item?.url} width={'100%'} height={'100%'} style={{ aspectRatio: 1, borderRadius: 5 }} />
                ) : (
                    <Image source={{ uri: item?.url }} style={{ width: '100%', height: '100%', aspectRatio: 1, borderRadius: 5, alignSelf: 'center', resizeMode: 'center' }} />
                )}

                {id?.id == item?.id &&
                    <View style={{width: 'auto', height: 'auto', position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                        <Image source={id?.result == 'correct'? require('../../../images/galochka.png') : require('../../../images/wrongX.png')} style={{ width: s(10), height: s(10)}}/>
                    </View>
                }

            </TouchableOpacity>
            
        </View>
    );
};

export default RenderItem