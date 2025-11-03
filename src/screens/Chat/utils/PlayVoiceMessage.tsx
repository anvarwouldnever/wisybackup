import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { AVPlaybackStatus, Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import Animated, { useAnimatedStyle, withTiming, SlideInRight } from "react-native-reanimated";
import store from "../../../store/store";
import { observer } from "mobx-react-lite";
import { useScale } from "../../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";
import { chatStore } from "../store/chatStore";

const PlayVoiceMessage = ({uri, animated, index}) => {

    const [sound, setSound] = useState<Sound>();
    const [status, setStatus] = useState<AVPlaybackStatus>();

    const { s, vs } = useScale()

    useEffect(() => {
        if (chatStore.playinVoiceMessageId == index) return;
        if (chatStore.playinVoiceMessageId !== index && sound) {
            sound.stopAsync();
        }
    }, [chatStore.playinVoiceMessageId]);

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
                    chatStore.setPlayingVoiceMessageId(index);
                } else {
                    await store.setPlayingMusic(false);
                    await sound.replayAsync();
                    chatStore.setPlayingVoiceMessageId(index);
                }
                return;
            }
        }
    
        chatStore.stopAllPlayingVoiceMessages();
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { progressUpdateIntervalMillis: 1000 / 60 },
            onPlaybackStatusUpdate
        );
    
        setSound(newSound);
        await newSound.playAsync();
        chatStore.setPlayingVoiceMessageId(index);
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
        <Animated.View entering={animated? SlideInRight.springify(500) : undefined} style={ {flexDirection: 'column', rowGap: vs(5), alignItems: 'flex-end' }}>
            
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', columnGap: vs(6), justifyContent: 'center' }}>
                
                <Image source={require('../../../images/Dog.png')} style={{ width: vs(24), height: vs(24) }} />
                
                <Text style={{color: '#555555', fontWeight: '600', fontSize: vs(14)}}>You</Text>
            
            </View>

            <View style={{width: 'auto', height: 'auto', padding: vs(15), shadowColor: "#000000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 10, backgroundColor: 'white', borderRadius: vs(12), marginRight: vs(30), alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', columnGap: vs(5), justifyContent: 'center'}}>
                
                <TouchableOpacity activeOpacity={1} onPress={() => playSound(uri)}>
                    
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={vs(24)} />
                
                </TouchableOpacity>
                
                <View style={{height: 2, width: s(130), backgroundColor: 'grey', flexDirection: 'row', alignItems: 'center' }}>
                    
                    <Animated.View style={[animatedProgress, {position: 'absolute', width: vs(10), height: vs(10), backgroundColor: 'royalblue', borderRadius: 100}]}/>
                
                </View>
        
            </View>

        </Animated.View>
    )
}

export default observer(PlayVoiceMessage);