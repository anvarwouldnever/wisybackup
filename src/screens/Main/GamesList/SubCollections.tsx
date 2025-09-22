import { View, Text, ActivityIndicator, Platform, TouchableOpacity, useWindowDimensions , Image} from 'react-native'
import React from 'react'
import { FadeInRight, runOnJS } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import AnimatedPaw from '../../../components/AnimatedPaw';
import api from '../../../api/api';
import Blur from './SubCollections/BlurView';
import store from '../../../store/store';
import RenderAttributes from './SubCollections/RenderAttributes';
import Animated, { Easing } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import RenderStars from './SubCollections/RenderStars';
import { gameStore } from '../../Games/store/gameStore';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SubCollections = ({ item, onComplete, onCompleteTask, index, availableSubCollections, setWasAnimated, wasAnimated, playSpeech, firstOpeningAction }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const navigation = useNavigation();

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
            <View
                style={{
                    backgroundColor: '#D8F6FF33',
                    borderRadius: 12,
                    width: Platform.isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360),
                    height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360),
                    marginRight: 20,
                    borderWidth: 1,
                    borderColor: '#FFFFFF1F',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size='large' color="#504297" />
            </View>
        );
    }

    return (
        <AnimatedTouchableOpacity
            entering={
                store.isFirstOpening && !wasAnimated
                ? FadeInRight
                    .delay(200)
                    .duration(400)
                    .easing(Easing.out(Easing.cubic))
                    .withCallback(() => {
                        runOnJS(setWasAnimated)(true);
                    })
                : !store.isFirstOpening 
                && 
                    FadeInRight
                    .delay(200)
                    .duration(400)
                    .easing(Easing.out(Easing.cubic))
                    
            }
            onPress={(store.isFirstOpening && store.wisySpeaking) ? () => {} : isLocked ? () => func3() : () => {
                    gameStore.prepareTasksArray(item.id);
                    navigation.navigate('GameScreen', {
                    breaks: item?.breaks,
                    isFromBreak: item?.isBreak,
                    categoryId,
                    onComplete,
                    onCompleteTask,
                    firstOpeningAction,
                    availableSubCollections
                });
            }}
            style={{ backgroundColor: '#D8F6FF33', borderRadius: 12, width: Platform.isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360), height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360), marginRight: 20, borderWidth: 1, borderColor: '#FFFFFF1F', overflow: 'visible', position: 'relative' }}
            >
            {!item?.isBreak && <RenderStars earned={item?.stars?.earned} total={item?.stars?.total} />}
            <View style={{ width: '100%', position: 'absolute', borderColor: 'white', borderWidth: 1, opacity: 0.12, top: Platform.isPad ? windowHeight * (60 / 800) : 35 }} />
            {api.baseUrl === 'https://tapimywisy.hostweb.uz/api/v1/app' && <Text style={{position: 'absolute', left: windowHeight * (10 / 360), top: '10%', color: 'blue'}}>{item?.id}</Text>}
            {typeof item?.image === 'string' && !item.image.endsWith('.svg') ? (
                <Image source={{ uri: item?.image }} style={{ width: Platform.isPad ? windowWidth * (256 / 1194) : windowWidth * (135 / 800), height: Platform.isPad ? windowWidth * (224 / 1194) : windowHeight * (82 / 360), alignSelf: 'center', resizeMode: 'contain', position: 'absolute', top: Platform.isPad ? windowHeight * (90 / 800) : windowHeight * (35 / 360) }} />
            ) : (
                <SvgUri uri={item?.image} width={Platform.isPad ? windowWidth * (256 / 1194) : windowWidth * (135 / 800)} height={Platform.isPad ? windowWidth * (224 / 1194) : windowHeight * (82 / 360)} style={{ alignSelf: 'center', position: 'absolute', top: Platform.isPad ? windowHeight * (90 / 800) : windowHeight * (35 / 360) }} />
            )}
            <View style={{ width: '100%', position: 'absolute', borderColor: 'white', borderWidth: 1, opacity: 0.12, bottom: Platform.isPad ? windowHeight * (30 / 360) : 40 }} />
            {!(store.isFirstOpening && index === 0) && (
                <View style={{ 
                    width: '100%', 
                    height: windowHeight * (35 / 360), 
                    bottom: 0, 
                    position: 'absolute', 
                    alignItems: 'center', 
                    flexDirection: 'row', 
                    alignSelf: 'center', 
                    justifyContent: 'center', 
                    borderRadius: 10,
                }}>
                    <RenderAttributes attributes={item?.attributes} />
                </View>
            )}
            <Blur isLocked={isLocked} />
            { store.isFirstOpening && index === 0 && !store.wisySpeaking && <AnimatedPaw /> }
        </AnimatedTouchableOpacity>
    )
};

export default SubCollections