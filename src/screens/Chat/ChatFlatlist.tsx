import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import store from '../../store/store'
import PlayVoiceMessage from './utils/PlayVoiceMessage'
import DotsAnimation from './ChatFlatlist/DotsAnimation'
import { observer } from 'mobx-react-lite'
import { useScale } from '../../hooks/utils/useScale'
import { getMessages } from './hooks/getMessages'
import { chatStore } from './store/chatStore'

const ChatFlatlist = ({ flatListRef, firstMessageRef }) => {

    const { loading, error } = getMessages(store.playingChildId.id)

    const { s, vs } = useScale()

    const renderItemMessage = ({ item, index }) => {
        
        const messageType = item.type
        const isLastVoiceMessage = index === 0;
    
        return (
            messageType === 'text' || messageType === 'thinking'? (
                
                <View ref={index === 0 ? firstMessageRef : null} style={{ width: 'auto', height: 'auto', flexDirection: 'column', rowGap: vs(5) }}>
                    
                    <View style={{ flexDirection: item.author === 'MyWisy' ? 'row' : 'row-reverse', alignItems: 'center', columnGap: vs(6) }} >
                        
                        <Image source={item.author === 'MyWisy' ? require('../../images/wisypfp.png') : require('../../images/Dog.png')} style={{ width: vs(24), height: vs(24) }} />
                    
                        <Text style={{ color: '#555555', fontWeight: '600', fontSize: vs(14), textAlign: item?.author === 'MyWisy' ? 'left' : 'right' }}>{item?.author}</Text>
                    
                    </View>
                        
                    <View style={{ width: 'auto', maxWidth: s(250), flexDirection: 'row', alignItems: 'center', paddingLeft: item?.author === "MyWisy" ? vs(30) : 0, paddingRight: item?.author === "MyWisy" ? 0 : vs(30), alignSelf: item?.author === "MyWisy" ? 'flex-start' : 'flex-end' }}>
                            
                        <Text style={{ color: '#555555', fontSize: vs(14), fontWeight: '400', lineHeight: vs(22), textAlign: item?.author === 'MyWisy' ? 'left' : 'right', writingDirection: 'auto'}}>
                            {item?.text}
                        </Text>
                            
                        {messageType === 'thinking' && 
                            <View style={{ marginTop: vs(5) }}>
                                <DotsAnimation />
                            </View>
                        }

                    </View>

                </View>

            ) : <PlayVoiceMessage animated={isLastVoiceMessage} uri={item.text} index={index}/>
        )
    }

    return (
        <FlatList
            ref={flatListRef}
            data={chatStore.messages}
            renderItem={renderItemMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ rowGap: vs(16), paddingVertical: vs(30) }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            inverted={true} 
            scrollsToTop={false}
        />
    )
}

export default observer(ChatFlatlist);