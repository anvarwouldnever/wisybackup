import { View, Text, Platform, TouchableOpacity, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import { SvgUri } from 'react-native-svg';
import galochka from '../../../images/galochka.png'
import x from '../../../images/wrongX.png'

const Button = ({ item, lock, answer, id }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const isSvg = item.url.endsWith('.svg');
    
    const onPress = () => {
        answer({ answer: item?.id })
    }

    return (
        <TouchableOpacity onPress={lock? () => {} : () => onPress()} 
            style={{
                borderRadius: 10, backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item?.id && id?.result == 'wrong'? '#D816164D' : 'white', 
                width: Platform.isPad ? windowWidth * (120 / 800) : windowWidth * (120 / 800), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), 
                justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D' : id?.id == item?.id && id?.result == 'wrong'? '#D81616' : 'white',
                shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
            }}
        >
            {isSvg ? (
                <SvgUri uri={item.url} style={{ width: windowHeight * (108 / 360), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (108 / 360), aspectRatio: 1, borderRadius: 10 }} />
            ) : (
                <Image source={{ uri: item?.url }} style={{ width: windowHeight * (108 / 360), height: Platform.isPad ? windowWidth * (108 / 800) : windowHeight * (108 / 360), aspectRatio: 1, borderRadius: 10 }} />
            )}
            {id?.id == item?.id && 
            <View style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D' : id?.id == item?.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360)}}/>
            </View>}
        </TouchableOpacity>
    )
}

export default Button;