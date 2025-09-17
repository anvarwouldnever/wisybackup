import { Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/useScale';

const Pad = ({ onPress }) => {

    const { s, vs } = useScale()

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];

    return (
        <FlatList
            data={numbers}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
                <TouchableOpacity
                    onPress={() => { onPress(item) }}
                    style={{
                        backgroundColor: index === 9 || index === 11 ? 'white' : '#F8F8F8',
                        width: s(96),
                        height: vs(48),
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    {item === 'del'
                        ? <Image source={require('../../images/tabler_backspace.png')} style={{ width: s(24), height: vs(24) }} />
                        : <Text style={{ fontWeight: '600', fontSize: vs(24), lineHeight: vs(40), textAlign: 'center' }}>{item}</Text>
                    }
                </TouchableOpacity>
            )}
            numColumns={3}
            columnWrapperStyle={{ gap: vs(10) }}
            contentContainerStyle={{ gap: vs(10) }}
            scrollEnabled={false}
            style={{ position: 'absolute', bottom: vs(40) }}
        />
    );
};

export default Pad