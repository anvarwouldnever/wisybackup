import React, { useCallback } from 'react'
import { View, Platform, TouchableOpacity, Image, ScrollView, useWindowDimensions, Text } from 'react-native'
import store from '../store/store'
import rabbit from '../images/Rabbit.png'
import plus from '../images/Button.png'
import { observer } from 'mobx-react-lite';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SvgUri } from 'react-native-svg'
import * as ScreenOrientation from 'expo-screen-orientation';

function Children({ setChosenPlayerIndex, chosenPlayerIndex, setChosenPlayer }) {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    // useFocusEffect(
    //         useCallback(() => {
    //             async function changeScreenOrientation() {
    //                 await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    //             }
    //             changeScreenOrientation();
    //         }, [])
    //     );
  
    return (
        <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignSelf: 'center', alignItems: 'center', width: 'auto', height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), gap: 32}}>
                    {store?.children && store?.children?.map((player, index) => {
                        const avatarObj = store?.avatars?.find(avatar => avatar.id === player.avatar_id);
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
                                    marginLeft: index === 0 ? 150 : 0
                                }}
                            >
                                <TouchableOpacity 
                                    activeOpacity={1} 
                                    onPress={() => { 
                                        setChosenPlayerIndex(index);
                                        setChosenPlayer(player);    
                                    }} 
                                    style={{
                                        width: 'auto', 
                                        height: 'auto', 
                                        borderWidth: 3, 
                                        borderColor: chosenPlayerIndex === index ? '#504297' : '#F4E3F1', 
                                        borderRadius: 100
                                    }}
                                >
                                    {isSvg ? (
                                        <SvgUri 
                                            uri={avatarUrl} 
                                            width={Platform.isPad ? windowHeight * (96 / 360) : windowHeight * (96 / 360)}
                                            height={Platform.isPad ? windowWidth * (96 / 800) : windowHeight * (96 / 360)}
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
                                                aspectRatio: 96 / 96
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
                                    {player.name}
                                </Text>
                            </View>
                        );
                    })}
                    <TouchableOpacity onPress={() => navigation.navigate('ChildParamsScreen')} style={{width: Platform.isPad? windowWidth * (96 / 800) : windowWidth * (96 / 800), height: Platform.isPad? windowWidth * (136 / 800) : windowHeight * (136 / 360), justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', marginRight: 150}}>
                        <Image source={plus} style={{width: Platform.isPad? windowHeight * (96 / 360) : windowWidth * (96 / 800), height: Platform.isPad? windowWidth * (96 / 800) : windowHeight * (96 / 360), aspectRatio: 96 / 96}}/>
                        <Text style={{color: '#504297', width: 'auto', height: windowHeight * (24 / 360), fontSize: 14, lineHeight: 24, fontWeight: '600'}}>Add new user</Text>
                    </TouchableOpacity>
        </ScrollView>
    )
}

export default observer(Children);