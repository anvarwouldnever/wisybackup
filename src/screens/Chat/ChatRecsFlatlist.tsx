import { Text, FlatList, TouchableOpacity,  } from 'react-native'
import React from 'react'
import store from '../../store/store';
import { useScale } from '../../hooks/useScale';

const ChatRecsFlatlist = ({ sendMessage }) => {

    const recs = store.language === 'lv' ? [
        { header: 'Es vēlos iepriekšējās nedēļas kopsavilkumu.' },
        { header: 'Kā mans bērns šonedēļ ir veicies?' },
        { header: 'Kuras jomas manam bērnam būtu jāuzlabo?' },
        { header: 'Cik daudz laika mans bērns šonedēļ pavadīja mācoties?' }
    ] : [
        { header: 'I’m interested in summary of the previous week.' },
        { header: 'How did my child perform this week?' },
        { header: 'Which areas my child could improve on?' },
        { header: 'How much time my child spent learning this week?' }
    ];

    const { s, vs } = useScale()

    const renderItem = ({ item }) => {
        
        return (
            <TouchableOpacity onPress={() => { sendMessage(item.header)}} activeOpacity={0.6} style={{ width: 'auto', height: 'auto', paddingHorizontal: vs(10), paddingVertical: vs(20), borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center'}}>
                <Text style={{fontWeight: '400', fontSize: vs(12), color: '#222222'}}>{item.header}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList 
            data={recs}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: vs(10) }}
        />
    )
}

export default ChatRecsFlatlist;