import { View, Text, FlatList, useWindowDimensions, TouchableOpacity,  } from 'react-native'
import React, { useState } from 'react'

const ChatRecsFlatlist = ({ sendMessage }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [recs, setRecs] = useState([
            {header: 'I’m interested in summary of the previous week.'},
            {header: 'How did my child perform this week?'},
            {header: 'Which areas my child could improve on?'},
            {header: 'How much time my child spent learning this week?'},
        ])

        const renderItem = ({ item }) => {
        
                return (
                    <TouchableOpacity onPress={() => {
                        sendMessage(item.header)
                    }} activeOpacity={0.6} style={{marginRight: windowWidth * (16 / 932), width: windowWidth * (264 / 360), height: windowHeight * (60 / 800), paddingHorizontal: windowWidth * (10 / 360), paddingVertical: windowHeight * (16 / 932), gap: windowWidth * (4 / 360), borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center'}}>
                        <Text style={{fontWeight: '400', fontSize: windowHeight * (12 / 800), color: '#222222'}}>{item.header}</Text>
                    </TouchableOpacity>
                )
            }

    return (
        <View style={{width: windowWidth, height: windowHeight * (60 / 800), position: 'absolute', bottom: 15}}>
            <FlatList 
                data={recs}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default ChatRecsFlatlist