import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SvgUri } from 'react-native-svg';
import { useScale } from '../../../hooks/utils/useScale';

const Button = ({ item, answer, id, clicked, lock }) => {

    const { s, vs } = useScale()

    const isSvg = item.url.endsWith('.svg');
    
    const onPress = () => {
        if (lock) return
        clicked()
        answer({ answer: item?.id })
    }

    return (
        <TouchableOpacity onPress={() => onPress()} style={{ borderRadius: 10, width: s(52), height: s(52), padding: s(2), backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item?.id && id?.result == 'wrong'? '#D816164D' : 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D' : id?.id == item?.id && id?.result == 'wrong'? '#D81616' : 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                            
            {isSvg ? 
                <SvgUri uri={item?.url} width={'100%'} height={'100%'} style={{ borderRadius: 10 }} />
            : 
                <Image source={{ uri: item?.url }} style={{ width: '100%', height: '100%', borderRadius: 10, }} />
            }

            {id?.id === item?.id && 
                <View style={{width: s(12), height: s(12), position: 'absolute', top: vs(5), right: vs(5), backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                    <Image source={id?.result == 'correct'? require('../../../images/galochka.png') : require('../../../images/wrongX.png')} style={{ width: s(10), height: s(10) }}/>
                </View>
            }

        </TouchableOpacity>
    )
}

export default Button;