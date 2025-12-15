import { View, Text, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import { FadeInRight, runOnJS } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import AnimatedPaw from '../../../components/AnimatedPaw';
import Blur from './SubCollections/BlurView';
import store from '../../../store/store';
import RenderAttributes from './SubCollections/RenderAttributes';
import Animated, { Easing } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import RenderStars from './SubCollections/RenderStars';
import { gameStore } from '../../Games/store/gameStore';
import { useScale } from '../../../hooks/utils/useScale';
import { BASE_URL } from '../../../api/api';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SubCollections = ({ item, onComplete, onCompleteTask, index, availableSubCollections, setWasAnimated, wasAnimated, playSpeech, firstOpeningAction }) => {

    const navigation = useNavigation();

    const { s, vs } = useScale()

    const isLocked = !availableSubCollections?.includes(item?.id) || (store?.isFirstOpening && index !== 0);

    const currentCategory = gameStore.categories.find(item => item.id === gameStore.categoryId)
    const categoryId = currentCategory?.id

    const func3 = () => {
        if (store.isFirstOpening) return
        if (store.wisySpeaking) return
        playSpeech('locked_subcollection_attempt')
    };

    if (item?.isLoading) {
        return (
            <View style={{ backgroundColor: '#D8F6FF33', borderRadius: 12, width: vs(305), height: vs(360), borderWidth: 1, borderColor: '#FFFFFF1F', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large' color="#504297" />
            </View>
        );
    }

    return (
        <AnimatedTouchableOpacity entering={ store.isFirstOpening && !wasAnimated ? FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic)).withCallback(() => {runOnJS(setWasAnimated)(true)}) : !store.isFirstOpening && FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))} onPress={(store.isFirstOpening && store.wisySpeaking) ? () => {} : isLocked ? () => func3() : () => { gameStore.prepareTasksArray(item.id); navigation.navigate('GameScreen', { breaks: item?.breaks, isFromBreak: item?.isBreak, categoryId, onComplete, onCompleteTask, firstOpeningAction, availableSubCollections})}} style={{ backgroundColor: '#D8F6FF33', borderRadius: 12, width: vs(305), height: vs(360), borderWidth: 1, borderColor: '#FFFFFF1F', overflow: 'visible', padding: vs(20), justifyContent: 'space-between' }}>
            
            { store.isFirstOpening && index === 0 && !store.wisySpeaking && 
                <AnimatedPaw /> 
            }
            
            <RenderStars earned={item?.stars?.earned} total={item?.stars?.total} />
            
            <View style={{ width: '100%', borderColor: 'white', borderWidth: 1, opacity: 0.12, alignSelf: 'center' }} />
            
            {BASE_URL === 'https://tapimywisy.hostweb.uz/api/v1/app' && 
                <Text style={{ position: 'absolute', left: s(2), top: s(8), color: 'blue', fontSize: s(5) }}>{item?.id}</Text>
            }
            
            {typeof item?.image === 'string' && !item.image.endsWith('.svg') ? (
                <View style={{ width: '100%', height: '50%' }}>
                    <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                </View>
            ) : (
                <View style={{ width: '100%', height: '50%' }}>
                    <SvgUri uri={item?.image} width={'100%'} height={'100%'} style={{ alignSelf: 'center'}} />
                </View>
            )}
            
            <View style={{ width: '100%', borderColor: 'white', borderWidth: 1, opacity: 0.12, alignSelf: 'center' }} />
            
            <RenderAttributes attributes={item?.attributes} />

            <Blur isLocked={isLocked} forMarket={false} height={vs(360)} width={vs(305)} borderRadius={12} />

        </AnimatedTouchableOpacity>
    )
};

export default SubCollections;