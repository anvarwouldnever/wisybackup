import React, { useState, useEffect } from "react";
import { Text, View, useWindowDimensions, Image, Touchable, TouchableOpacity } from "react-native";
import { AVPlaybackStatus, Audio } from "expo-av";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Sound } from "expo-av/build/Audio";
import Animated, { useAnimatedStyle, withTiming, SlideInRight, SlideInLeft } from "react-native-reanimated";
import store from "../store/store";
import { observer } from "mobx-react-lite";
import pause from '../images/pauseIcon.jpg'
import play from '../images/playIcon.jpg'

const PlayVoiceMessage = ({uri, animated, index}) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [sound, setSound] = useState<Sound>();
    const [status, setStatus] = useState<AVPlaybackStatus>();

    useEffect(() => {
        if (store.playinVoiceMessageId == index) return;
        if (store.playinVoiceMessageId !== index && sound) {
            sound.stopAsync();
        }
    }, [store.playinVoiceMessageId]);

    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
    }, [sound]);

    async function playSound(uri: any) {
        await store.setPlayingMusic(false);

        if (sound) {
            const status = await sound.getStatusAsync();
    
            if (status.isLoaded) {
                if (status.isPlaying) {
                    await store.setPlayingMusic(true);
                    await sound.pauseAsync();
                    
                } else if (status.positionMillis > 0 && status.positionMillis < status.durationMillis) {
                    await store.setPlayingMusic(false);
                    await sound.playAsync();
                    store.setPlayingVoiceMessageId(index);
                } else {
                    await store.setPlayingMusic(false);
                    await sound.replayAsync();
                    store.setPlayingVoiceMessageId(index);
                }
                return;
            }
        }
    
        store.stopAllPlayingVoiceMessages();
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { progressUpdateIntervalMillis: 1000 / 60 },
            onPlaybackStatusUpdate
        );
    
        setSound(newSound);
        await newSound.playAsync();
        store.setPlayingVoiceMessageId(index);
    }    

    async function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
        setStatus(status)
        if (status.isLoaded && status.didJustFinish && !status.isLooping) {
            store.setPlayingMusic(true);
        }
    }

    const isPlaying = status?.isLoaded ? status.isPlaying : false
    const position = status?.isLoaded ? status.positionMillis : 0
    const duration = status?.isLoaded ? status.durationMillis : 1;

    const progress = position / duration;

    const animatedProgress = useAnimatedStyle(() => ({
        left: withTiming(`${progress * 100}%`, {duration: 1000 / 60})
    }))

    return (
        <Animated.View entering={animated? SlideInRight.springify().damping(12) : undefined} style={{flexDirection: 'column', gap: windowWidth * (8 / 360), alignItems: 'flex-end'}}>
            <View style={{flexDirection: 'row-reverse', alignItems: 'center', gap: windowWidth * (8 / 360),}}>
                <Image source={require('../images/Dog.png')} style={{ width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24 }} />
                <Text style={{color: '#555555', fontWeight: '600', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (24 / 800),}}>You</Text>
            </View>
            <View style={{width: windowWidth * (250 / 360), height: 70, shadowColor: "#000000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.2, shadowRadius: 7, backgroundColor: 'white', borderRadius: 10, alignSelf: 'flex-end', marginRight: 5, flexDirection: 'row', alignItems: 'center', padding: 20, gap: 10, justifyContent: 'center'}}>
                <TouchableOpacity activeOpacity={1} onPress={() => playSound(uri)}>
                    <Image source={isPlaying? pause : play} style={{width: windowWidth * (25 / 360), height: windowHeight * (25 / 800), backgroundColor: 'white'}}/>
                </TouchableOpacity>
                <View style={{height: 2, width: windowWidth * (180 / 360), backgroundColor: 'grey', flexDirection: 'row', alignItems: 'center'}}>
                    <Animated.View style={[animatedProgress, {position: 'absolute', width: 10, height: 10, backgroundColor: 'royalblue', borderRadius: 100}]}/>
                </View>
                {/* <Text style={{position: 'absolute', alignSelf: 'flex-start', right: 20, bottom: 5, fontSize: 10}}>{formatMillis(position || 0)} / {formatMillis(duration || 0)}</Text> */}
            </View>
        </Animated.View>
    )
}

export default observer(PlayVoiceMessage);

// const formatMillis = (millis: number) => {
    //     const minutes = Math.floor(millis / (1000 * 60));
    //     const seconds = Math.floor((millis % (1000 * 60)) / 1000)

    //     return `${minutes}:${seconds < 10? '0' : ''}${seconds}`
    // }