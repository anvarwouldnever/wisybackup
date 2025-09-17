import { View, Text, Platform, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import React, { useRef } from 'react'
import { SvgUri } from 'react-native-svg';
import galochka from '../../../images/galochka.png'
import x from '../../../images/wrongX.png'

const RenderItem = ({ item, id, lock, answer, setId }) => {

        const isSvg = item.url.endsWith('.svg');

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        const timeoutRef = useRef(null);
    
        return (
            <View style={{backgroundColor: 'white', width: Platform.isPad ? windowWidth * (100 / 800) : windowHeight * (100 / 360), height: Platform.isPad ? windowWidth * (100 / 800) : windowHeight * (100 / 360), borderRadius: 10, justifyContent: 'center'}}>
                <TouchableOpacity onPress={!lock? () => {
                        answer({ answer: item?.id });

                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    
                        timeoutRef.current = setTimeout(() => {
                            setId(null);
                        }, 100)
                    } : () => {}} style={{
                    borderRadius: 10, backgroundColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == item?.id && id?.result == 'wrong'? '#D816164D' : 'white',  
                    width: '100%', height: '100%', 
                    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: id?.id == item?.id && id?.result == 'correct'? '#ADD64D' : id?.id == item?.id && id?.result == 'wrong'? '#D81616' : 'white',
                    shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
                }}>
                    {isSvg ? (
                        <SvgUri uri={item.url} width={Platform.isPad? windowWidth * (90 / 800) : windowHeight * (90 / 360)} height={Platform.isPad? windowWidth * (90 / 800) : windowHeight * (90 / 360)} style={{ width: windowWidth * (90 / 800), height: Platform.isPad ? windowWidth * (90 / 360) : windowHeight * (90 / 360), aspectRatio: 1, borderRadius: 10}} />
                    ) : (
                        <Image source={{ uri: item?.url }} style={{ width: Platform.isPad? windowWidth * (90 / 800) : windowHeight * (90 / 360), height: Platform.isPad ? windowWidth * (90 / 800) : windowHeight * (90 / 360), aspectRatio: 1, borderRadius: 10 }} />
                    )}
                    {/* {item.name === 'monkey' && <Image source={passedimg} style={{ width: windowWidth * (24 / 800), height: Platform.isPad ? windowWidth * (24 / 800) : windowHeight * (24 / 360), position: 'absolute', right: 4, top: 4 }} />} */}
                    {id?.id == item?.id && <View style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360), position: 'absolute', top: 3, right: 5, backgroundColor: id?.id == item.id && id?.result == 'correct'? '#ADD64D' : id?.id == item.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                        <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360)}}/>
                    </View>}
                </TouchableOpacity>
            </View>
        );
};

export default RenderItem