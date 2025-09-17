import { View, Text, Platform, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import React, { useRef } from 'react'
import { SvgUri } from 'react-native-svg';
import galochka from '../../../images/galochka.png'
import x from '../../../images/wrongX.png'

const RenderItem = ({ item, lock, answer, setId, id }) => {

        const isSvg = item.url.endsWith('.svg');
        
        const timeoutRef = useRef(null);

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    
        return (
            <View style={{backgroundColor: 'white', width: Platform.isPad ? windowWidth * (100 / 800) : windowHeight * (100 / 360), height: Platform.isPad ? windowWidth * (100 / 800) : windowHeight * (100 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'visible'}}>
                <TouchableOpacity onPress={lock? () => {return} : () => {
                    answer({ answer: item.id })
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setId(null);
                }} style={{
                    borderRadius: 10, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item.id && id?.result == 'wrong'? '#D816164D' : 'white', 
                    width: '100%', height: '100%', 
                    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white',
                    shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
                }}>
                    {isSvg ? (
                        <SvgUri uri={item?.url} style={{ width: windowHeight * (90 / 360), height: Platform.isPad ? windowWidth * (90 / 800) : windowHeight * (100 / 360), aspectRatio: 1, borderRadius: 5 }} />
                    ) : (
                        <Image source={{ uri: item?.url }} style={{ width: windowHeight * (90 / 360), height: Platform.isPad ? windowWidth * (100 / 800) : windowHeight * (90 / 360), aspectRatio: 1, borderRadius: 5, alignSelf: 'center', resizeMode: 'center' }} />
                    )}
                    {id?.id == item?.id && <View style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                        <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360)}}/>
                    </View>}
                </TouchableOpacity>
            </View>
        );
    };

export default RenderItem