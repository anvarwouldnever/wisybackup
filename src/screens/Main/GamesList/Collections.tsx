import { View, Text, Platform, TouchableOpacity, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur';
import api from '../../../api/api';
import Animated, { Easing, FadeInRight } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import store from '../../../store/store';
import { gameStore } from '../../Games/store/gameStore';

const Collections = ({ item, index, playSpeech }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const func = () => {
        if (store.isFirstOpening) return
        if (store.wisySpeaking) return
        playSpeech('enter_subcollections_screen');
    };

    const isPad = Platform.isPad;
    const windowWidthFactor = isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360);
    const windowHeightFactor = isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360);
    const textFontSize = isPad ? windowWidth * (20 / 1194) : windowHeight * (12 / 360);
    const imageWidth = isPad ? windowWidth * (256 / 1194) : windowWidth * (135 / 800);
    const imageHeight = isPad ? windowWidth * (224 / 1194) : windowHeight * (82 / 360);
    const bottomSpacing = isPad ? windowHeight * (76 / 834) : windowHeight * (35 / 360);

    return (
        <Animated.View entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))} style={{ width: 'auto', height: 'auto' }}>
            
            <TouchableOpacity onPress={() => { try { gameStore.enqueueGetAndProcessSubCollections({collectionId: item?.id, categoryId: item?.category?.id}); gameStore.setCollectionId(item.id); gameStore.setCollectionName(item?.name); func(); } catch (error) { console.log('Ошибка в onPress:', error); } }} style={{ backgroundColor: 'white', borderRadius: 12, width: windowWidthFactor, height: windowHeightFactor, marginRight: 20, borderWidth: 1, borderColor: '#FFFFFF1F' }}>
                
                <Text style={{ fontWeight: '600', fontSize: textFontSize, textAlign: 'center', width: '100%', height: 'auto', color: 'black', position: 'absolute', top: isPad ? windowHeight * (12 / 360) : 12 }}>{item.name}</Text>
                {api.baseUrl === 'https://tapimywisy.hostweb.uz/api/v1/app' && <Text style={{ fontWeight: '600', fontSize: textFontSize, color: 'blue', position: 'absolute', top: isPad ? windowHeight * (12 / 360) : 10, left: 10 }}>{item?.id}</Text>}
                
                <View style={{ width: '100%', position: 'absolute', borderColor: 'white', borderWidth: 1, opacity: 0.12, top: 35 }} />
                
                <Image source={{ uri: item?.image?.url }} style={{ width: imageWidth, height: imageHeight, alignSelf: 'center', position: 'absolute', top: isPad ? windowHeight * (70 / 800) : windowHeight * (35 / 360), resizeMode: 'contain' }} resizeMode='contain' resizeMethod='scale' />
                
                <View style={{ width: '100%', position: 'absolute', borderColor: 'white', borderWidth: 1, opacity: 0.12, bottom: 40 }} />
                
                <View style={{ width: '100%', height: bottomSpacing, bottom: 0, position: 'absolute', alignItems: 'center', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
                    
                    <View style={{ width: windowWidth * (53 / 800), height: windowHeight * (20 / 360), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        
                        <Image source={require('../../../images/tabler_star-filled.png')} style={{ width: windowWidth * (14 / 800), height: windowHeight * (14 / 360) }} resizeMode='contain' />
                        
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: '600', fontSize: windowWidth * (12 / 800), color: 'black' }}>{item.stars.earned}</Text>
                            <Text style={{ fontWeight: '600', fontSize: windowWidth * (12 / 800), color: '#B4B4B4' }}> / {item.stars.total}</Text>
                        </View>

                    </View>

                </View>

                {index > 1 && (
                    <BlurView intensity={10} tint="light" style={{ flex: 1, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name='lock-closed' size={24} color={'#504297'} />
                    </BlurView>
                )}
            </TouchableOpacity>

        </Animated.View>
    );
};

export default Collections