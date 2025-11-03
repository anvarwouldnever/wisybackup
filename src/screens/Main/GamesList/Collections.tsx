import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur';
import Animated, { Easing, FadeInRight } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import store from '../../../store/store';
import { gameStore } from '../../Games/store/gameStore';
import { useScale } from '../../../hooks/utils/useScale';
import { SvgUri } from 'react-native-svg';
import StarsInfo from './Collections/StarsInfo';
import { BASE_URL } from '../../../api/api';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Collections = ({ item, index, playSpeech }) => {

    const { s, vs, isTablet } = useScale()

    const func = () => {
        if (store.isFirstOpening) return
        if (store.wisySpeaking) return
        playSpeech('enter_subcollections_screen');
    };

    return (
        <AnimatedTouchableOpacity onPress={() => { try { gameStore.enqueueGetAndProcessSubCollections({collectionId: item?.id, categoryId: item?.category?.id}); gameStore.setCollectionId(item.id); gameStore.setCollectionName(item?.name); func(); } catch (error) { console.log('Ошибка в onPress:', error); } }} entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))} style={{ width: vs(305), height: vs(360), backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#FFFFFF1F', justifyContent: 'space-between', padding: vs(20) }}>
                
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontWeight: '600', fontSize: isTablet ? s(7) : s(6), textAlign: 'center', width: '100%', color: 'black' }}>{item.name}</Text>
                
                {BASE_URL === 'https://tapimywisy.hostweb.uz/api/v1/app' && 
                    <Text style={{ fontWeight: '600', fontSize: s(5), color: 'blue', position: 'absolute', top: s(10), left: s(2) }}>{item?.id}</Text>
                }
                
                {typeof item?.image?.url === 'string' && !item?.image?.url?.endsWith('.svg') ? 
                    <View style={{ width: '100%', height: '65%' }}>
                        <Image source={{ uri: item?.image?.url }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    </View>
                : 
                    <View style={{ width: '100%', height: '65%' }}>
                        <SvgUri uri={item?.image?.url} width={'100%'} height={'100%'} style={{ alignSelf: 'center'}} />
                    </View>
                }
                
                <StarsInfo item={item}/>

                {index > 10 && (
                    <BlurView intensity={10} tint="light" style={{ flex: 1, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name='lock-closed' size={vs(24)} color={'#504297'} />
                    </BlurView>
                )}

        </AnimatedTouchableOpacity>
    );
};

export default Collections