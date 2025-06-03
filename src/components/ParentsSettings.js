import React, { useState } from "react";
import { TouchableOpacity, View, useWindowDimensions, Image, Text } from "react-native";
import mail from '../images/mail.png';
import narrowright from '../images/narrowright.png';
import password from '../images/password.png';
import support from '../images/message.png';
import speaker from '../images/speaker.png';
import Animated, { withTiming, useAnimatedStyle, FadeInDown } from "react-native-reanimated";
import text from '../images/text.png';
import NewPasswordModal from "./NewPasswordModal";
import PopUpModal from "./PopUpModal";
import store from "../store/store";
import langIcon from '../images/languageIcon.png';
import { observer } from "mobx-react-lite";
import translations from "../../localization";
import api from "../api/api";

const ParentsSettings = ({ setScreen }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [modal, setModal] = useState(false);
    const [popUpModal, setPopUpModal] = useState(false);
    const [secure, setSecure] = useState(true);
    const [musicToggleBlocked, setMusicToggleBlocked] = useState(false);

    let voiceInstructions = store.voiceInstructions;
    let backgroundMusic = store.musicTurnedOn;

    const handleToggleBackgroundMusic = () => {
        if (musicToggleBlocked) return;

        setMusicToggleBlocked(true);
        store.setMusicTurnedOn(!store.musicTurnedOn);

        setTimeout(() => {
            setMusicToggleBlocked(false);
        }, 500);
    }

    const animatedToggleVoiceInstructions = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(voiceInstructions? windowHeight * (9 / 800) : 0, {duration: 300})
            }],
            backgroundColor: withTiming(!voiceInstructions? 'white' : 'black', {duration: 400})
        }
    })

    const animatedToggleBackgroundMusic = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(backgroundMusic? windowHeight * (9 / 800) : 0, {duration: 300})
            }],
            backgroundColor: withTiming(!backgroundMusic? 'white' : 'black', {duration: 400})
        }
    })

    const logout = async() => {
        await store.setToken(null)
        await store.setChildren(null)
    };

    const settingsItems = [
        {
            key: 'changeEmail',
            icon: mail,
            onPress: () => {},
        },
        {
            key: 'changePassword',
            icon: password,
            onPress: () => setModal(true),
        },
        {
            key: 'backgroundMusic',
            icon: speaker,
            onPress: () => handleToggleBackgroundMusic(),
            isBackgroundMusicSwitch: true,
            value: store.musicTurnedOn,
        },
        {
            key: 'voiceInstructions',
            icon: speaker,
            isSwitch: true,
            value: voiceInstructions,
            onPress: () => store.setVoiceInstructions(!store.voiceInstructions),
        },
        {
            key: 'textInstructions',
            icon: text,
            isStaticSwitch: true,
        },
        {
            key: 'support',
            icon: support,
            onPress: () => {},
        },
        {
            key: 'language',
            icon: langIcon,
            onPress: () => setScreen('Lang'),
        },
        {
            key: 'logout',
            icon: support,
            onPress: logout,
            isLogout: true,
        },
    ];

    const renderItem = ({ item }) => {
        if (item.isSwitch) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={item.onPress} style={styles.touchable(windowWidth, windowHeight)}>
                    <Image source={item.icon} style={styles.icon(windowHeight)} />
                    <Text style={styles.text(windowWidth, windowHeight)}>{translations?.[store.language][item.key]}</Text>
                    <View style={styles.switchContainer(windowHeight)}>
                        <Animated.View style={[animatedToggleVoiceInstructions, styles.switchThumb(windowHeight)]} />
                    </View>
                </TouchableOpacity>
            );
        }

        if (item.isStaticSwitch) {
            return (
                <TouchableOpacity activeOpacity={1} style={styles.touchable(windowWidth, windowHeight)}>
                    <Image source={item.icon} style={styles.icon(windowHeight)} />
                    <Text style={styles.text(windowWidth, windowHeight)}>{translations?.[store.language][item.key]}</Text>
                    <View style={[styles.switchContainer(windowHeight), { alignItems: 'flex-end' }]}>
                        <Animated.View style={styles.switchThumb(windowHeight)} />
                    </View>
                </TouchableOpacity>
            );
        }

        if (item.isBackgroundMusicSwitch) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={item.onPress} style={styles.touchable(windowWidth, windowHeight)}>
                    <Image source={item.icon} style={styles.icon(windowHeight)} />
                    <Text style={styles.text(windowWidth, windowHeight)}>{translations?.[store.language][item.key]}</Text>
                    <View style={styles.switchContainer(windowHeight)}>
                        <Animated.View style={[animatedToggleBackgroundMusic, styles.switchThumb(windowHeight)]} />
                    </View>
                </TouchableOpacity>     
            )
        }

        return (
            <TouchableOpacity onPress={item.onPress} style={styles.touchable(windowWidth, windowHeight)}>
                <Image source={item.icon} style={styles.icon(windowHeight)} />
                <Text style={[
                    styles.text(windowWidth, windowHeight),
                    item.isLogout ? { color: 'red' } : {}
                ]}>
                    {translations?.[store.language][item.key]}
                </Text>
                <Image source={narrowright} style={styles.icon(windowHeight)} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ width: windowWidth * (312 / 360), backgroundColor: 'white', alignItems: 'center', height: 'auto'}}>
            <PopUpModal modal={popUpModal} setModal={setPopUpModal} />
            <Text style={{
                width: windowWidth * (312 / 360),
                height: windowHeight * (24 / 800),
                fontWeight: '600',
                fontSize: windowHeight * (16 / 800),
                lineHeight: windowHeight * (24 / 800),
            }}>Settings</Text>
            <Animated.FlatList
                entering={FadeInDown}
                data={settingsItems}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                contentContainerStyle={{ gap: 12, paddingVertical: 8, width: '100%' }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />
            <Text style={{fontSize: windowHeight * (18 / 800), color: 'grey', fontWeight: '600', margin: windowHeight * (20 / 800)}}>{api.baseUrl === 'https://tapimywisy.hostweb.uz/api/v1/app' ? 'Dev' : ''}</Text>
            <NewPasswordModal secure={secure} modal={modal} setModal={setModal} setSecure={setSecure} setPopUpModal={setPopUpModal} />
        </View>
    )
}

const styles = {
    touchable: (width, height) => ({
        width: width * (312 / 360),
        height: height * (56 / 800),
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: height * (16 / 800),
        borderRadius: 10,
    }),
    icon: (height) => ({
        width: height * (24 / 800),
        height: height * (24 / 800),
        aspectRatio: 1,
    }),
    text: (width, height) => ({
        fontSize: height * (14 / 800),
        fontWeight: '600',
        lineHeight: height * (20 / 800),
        color: '#222222',
        width: width * (216 / 360),
    }),
    switchContainer: (height) => ({
        width: height * (22 / 800),
        height: height * (14 / 800),
        borderWidth: height * (2 / 800),
        borderColor: '#222222',
        borderRadius: 100,
        justifyContent: 'center',
        padding: 2,
    }),
    switchThumb: (height) => ({
        backgroundColor: 'black',
        borderWidth: height * (2 / 800),
        borderColor: 'black',
        width: height * (6 / 800),
        height: height * (6 / 800),
        borderRadius: 100,
    }),
};

export default observer(ParentsSettings);