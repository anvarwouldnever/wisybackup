import store from '../store/store'
import rabbit from '../images/Rabbit.png'
import plus from '../images/Button.png'

import { FlatList, TouchableOpacity, View, Text, Image, Platform, useWindowDimensions } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

function Children({ setChosenPlayerIndex, chosenPlayerIndex, setChosenPlayer }) {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    const renderItem = ({ item, index }) => {
        if (item.isAddButton) {
            return (
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ChildParamsScreen')} 
                    style={{
                        width: Platform.isPad ? windowWidth * (96 / 800) : windowWidth * (96 / 800), 
                        height: Platform.isPad ? windowWidth * (136 / 800) : windowHeight * (136 / 360), 
                        justifyContent: 'space-between', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        marginRight: 150
                    }}
                >
                    <Image 
                        source={plus} 
                        style={{
                            width: Platform.isPad ? windowHeight * (96 / 360) : windowWidth * (96 / 800), 
                            height: Platform.isPad ? windowWidth * (96 / 800) : windowHeight * (96 / 360), 
                            aspectRatio: 96 / 96
                        }}
                    />
                    <Text 
                        style={{
                            color: '#504297', 
                            width: 'auto', 
                            height: windowHeight * (24 / 360), 
                            fontSize: 14, 
                            lineHeight: 24, 
                            fontWeight: '600'
                        }}
                    >
                        Add new user
                    </Text>
                </TouchableOpacity>
            );
        }

        const avatarObj = store?.avatars?.find(avatar => avatar.id === item.avatar_id);
        const avatarImage = avatarObj ? avatarObj.image : rabbit;
        const avatarUrl = typeof avatarImage === 'string' ? avatarImage : avatarImage?.url; 
        const isSvg = avatarUrl?.endsWith('.svg');

        return (
            <View 
                key={index} 
                style={{
                    width: Platform.isPad ? windowWidth * (96 / 800) : windowWidth * (96 / 800), 
                    height: Platform.isPad ? windowWidth * (136 / 800) : windowHeight * (136 / 360), 
                    justifyContent: 'space-between', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    marginLeft: index === 0 ? 150 : 0,
                }}
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => { 
                        setChosenPlayerIndex(index);
                        setChosenPlayer(item);    
                    }} 
                    style={{
                        width: 'auto',
                        height: 'auto',
                        
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {isSvg ? (
                        <SvgUri 
                            uri={avatarUrl} 
                            width={Platform.isPad ? windowWidth * (96 / 800) : windowHeight * (96 / 360)}
                            height={Platform.isPad ? windowWidth * (96 / 800) : windowHeight * (96 / 360)}
                            style={{
                                borderWidth: 3, 
                                borderColor: chosenPlayerIndex === index ? '#504297' : '#F4E3F1', 
                                borderRadius: 100,
                            }}
                        />
                    ) : (
                        <Image 
                            source={{ uri: avatarUrl }} 
                            style={{
                                borderWidth: 2, 
                                borderColor: 'white', 
                                borderRadius: 100, 
                                width: Platform.isPad ? windowHeight * (96 / 360) : windowWidth * (96 / 800), 
                                height: Platform.isPad ? windowWidth * (96 / 800) : windowHeight * (96 / 360), 
                                aspectRatio: 1
                            }}
                        />
                    )}
                </TouchableOpacity>
                <Text 
                    style={{
                        color: '#504297', 
                        width: 'auto', 
                        height: windowHeight * (24 / 360), 
                        fontSize: 14, 
                        lineHeight: 24, 
                        fontWeight: '600', 
                        textAlign: 'center'
                    }}
                >
                    {item?.name}
                </Text>
            </View>
        );
    };

    return (
        <FlatList
            data={[...(store?.children || []), { isAddButton: true }]}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                paddingHorizontal: 10, 
                alignSelf: 'center', 
                alignItems: 'center', 
                width: 'auto', 
                height: Platform.isPad ? windowWidth * (136 / 800) : windowHeight * (136 / 360),
                gap: 32
            }}
            renderItem={renderItem}
        />
    );
}

export default observer(Children);
