import { View, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import React, { useRef } from 'react'
import { SvgUri } from 'react-native-svg';
import galochka from '../../../images/galochka.png'
import x from '../../../images/wrongX.png'
import { useScale } from '../../../hooks/utils/useScale';

const RenderItem = ({ item, id, lock, answer, setId }) => {

        const isSvg = item?.url?.endsWith('.svg');

        const { s, vs } = useScale()

        const timeoutRef = useRef(null);

        const onPress = () => {
            if (lock) return
            answer({ answer: item?.id });
            if (timeoutRef.current) clearTimeout(timeoutRef.current);    
            timeoutRef.current = setTimeout(() => {
                setId(null);
             }, 100)
        }
    
        return (
            <View style={{backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                
                <TouchableOpacity onPress={() => onPress()} style={{ borderRadius: 10, width: s(50), height: s(50), padding: s(1), backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item?.id && id?.result == 'wrong'? '#D816164D' : 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D' : id?.id == item?.id && id?.result == 'wrong'? '#D81616' : 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                    
                    {isSvg ? 
                        <SvgUri uri={item?.url} width={'100%'} height={'100%'} style={{ borderRadius: 10 }} />
                    : 
                        <Image source={{ uri: item?.url }} style={{ width: '100%', height: '100%', borderRadius: 10, }} />
                    }

                    {id?.id === item?.id && 
                        <View style={{width: s(12), height: s(12), position: 'absolute', top: vs(5), right: vs(5), backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                            <Image source={id?.result == 'correct'? galochka : x} style={{ width: s(10), height: s(10) }}/>
                        </View>
                    }

                </TouchableOpacity>

            </View>
        );
};

export default RenderItem