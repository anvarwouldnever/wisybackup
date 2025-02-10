import { View, Text, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import PlayVoiceMessage from '../../components/PlayVoiceMessage'
import DotsAnimation from '../../animations/DotsAnimation'
import wisypfp from '../../images/wisypfp.png'
import dog from '../../images/Dog.png'

const RenderItemMessage = ({ item, index, firstMessageRef }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
        
    const messageType = item.type
    const isLastVoiceMessage = index === 0;
        
    return (
            messageType === 'text' || messageType === 'thinking'? (
                    <View ref={index === 0 ? firstMessageRef : null} style={{ width: 'auto', height: 'auto', flexDirection: item.author === 'MyWisy' ? 'row' : 'row-reverse', gap: windowWidth * (8 / 360)}}>
                        <Image source={item.author === 'MyWisy' ? wisypfp : dog} style={{ width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24 }} />
                        <View style={{ width: 'auto', maxWidth: windowWidth * (250 / 360), height: 'auto', gap: windowWidth * (8 / 360), flexDirection: 'column' }}>
                            <Text style={{ color: '#555555', fontWeight: '600', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (24 / 800), textAlign: item.author === 'MyWisy' ? 'left' : 'right' }}>{item.author}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{ color: '#555555', fontSize: windowHeight * (14 / 800), fontWeight: '400', lineHeight: windowHeight * (24 / 800), textAlign: item.author === 'MyWisy' ? 'left' : 'left', writingDirection: 'ltr'}}>{item.text}</Text>
                                {messageType === 'thinking' && <View style={{ marginTop: 3 }}>
                                    <DotsAnimation />
                                </View>}
                            </View>
                        </View>
                    </View>
                ) : <PlayVoiceMessage animated={isLastVoiceMessage} uri={item.text} index={index}/>
        )
    }

export default RenderItemMessage