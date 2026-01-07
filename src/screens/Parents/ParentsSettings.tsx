import React, { useState } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import Animated, { withTiming, useAnimatedStyle, FadeInDown } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import store from "../../store/store";
import { useScale } from "../../hooks/utils/useScale";
import NewPasswordModal from "./Settings/NewPasswordModal";
import PopUpModal from "./Settings/PopUpModal";
import { BASE_URL } from "../../api/api";
import * as SecureStore from 'expo-secure-store';
import { clearChildrenCache } from "../ChoosePlayer/hooks/getChildren";
import { gameStore } from "../Games/store/gameStore";

const ParentsSettings = ({ setScreen, labels }) => {

    const navigation = useNavigation();
    const [modal, setModal] = useState(false);
    const [popUpModal, setPopUpModal] = useState(false);
    const [secure, setSecure] = useState(true);
    const [musicToggleBlocked, setMusicToggleBlocked] = useState(false);

    const { s, vs } = useScale();

    const voiceInstructions = store?.voiceInstructions;
    const backgroundMusic = store?.musicTurnedOn;

    const handleToggleBackgroundMusic = () => {
        if (musicToggleBlocked) return;
        setMusicToggleBlocked(true);
        store.setMusicTurnedOn(!store.musicTurnedOn);
        setTimeout(() => setMusicToggleBlocked(false), 500);
    };

    const logout = async () => {
        gameStore.resetCategories()
        clearChildrenCache()
        await SecureStore.deleteItemAsync('token')
        navigation.reset({ index: 0, routes: [{ name: "LanguageScreen" }] });
    };

    const dotMoveLength = vs(8)

    const toggleVoiceStyle = useAnimatedStyle(() => (
        { 
            transform: [{ translateX: withTiming(voiceInstructions ? dotMoveLength : 0, { duration: 300 }) }], 
            backgroundColor: withTiming(voiceInstructions ? "black" : "white", { duration: 400 }) 
        }
    ));

    const toggleMusicStyle = useAnimatedStyle(() => (
        {   
            transform: [{ translateX: withTiming(backgroundMusic ? dotMoveLength : 0, { duration: 300 }) }], 
            backgroundColor: withTiming(backgroundMusic ? "black" : "white", { duration: 400 }) 
        }
    ));

    const items = [
        { key: labels?.change_email, icon: require("../../images/mail.png"), onPress: () => {}, id: 1 },
        { key: labels?.change_password, icon: require("../../images/password.png"), onPress: () => setModal(true), id: 2 },
        { key: "Background music", icon: require("../../images/speaker.png"), onPress: handleToggleBackgroundMusic, animatedStyle: toggleMusicStyle, id: 3 },
        { key: labels?.voice_instructions, icon: require("../../images/speaker.png"), onPress: () => store.setVoiceInstructions(!store.voiceInstructions), animatedStyle: toggleVoiceStyle, id: 4 },
        { key: labels?.text_instructions, icon: require("../../images/text.png"), staticSwitch: true, id: 5 },
        { key: labels?.support, icon: require("../../images/message.png"), onPress: () => {}, id: 6 },
        { key: labels?.language, icon: require("../../images/languageIcon.png"), onPress: () => setScreen("Lang"), id: 7 },
        { key: "Logout", icon: require("../../images/message.png"), onPress: logout, isLogout: true, id: 8 },
    ];

    console.log(labels?.language)

    const renderSwitch = (animatedStyle, staticSwitch) => (
        
        <View style={{ width: vs(22), height: vs(14), borderWidth: vs(2), borderColor: "#222", borderRadius: 100, justifyContent: "center", padding: vs(2) }}>
            
            <Animated.View style={[{ width: vs(6), height: vs(6), borderWidth: vs(2), borderColor: "#222", borderRadius: 100, backgroundColor: "black" }, staticSwitch ? {} : animatedStyle]} />
        
        </View>
    );

    const renderItem = ({ item }) => (
        
        <TouchableOpacity activeOpacity={0.8} onPress={item?.onPress} style={{ width: '100%', height: vs(56), backgroundColor: "#F8F8F8", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: vs(16), borderRadius: vs(16) }}>
            
            <View style={{ flexDirection: 'row', columnGap: vs(10), alignItems: 'center', justifyContent: 'center' }}>
                
                <Image source={item.icon} style={{ width: vs(24), height: vs(24), resizeMode: "contain" }} />
            
                <Text style={{ fontSize: vs(14), fontWeight: "600", color: item.isLogout ? "red" : "#222" }}>{item?.key}</Text>
            
            </View>
            
            {item.animatedStyle || item.staticSwitch ? renderSwitch(item.animatedStyle, item.staticSwitch) : !item.isLogout && <Image source={require("../../images/narrowright.png")} style={{ width: vs(24), height: vs(24), resizeMode: "contain" }} />}
            
        </TouchableOpacity>
        
    );

    return (
        <View style={{ width: '100%', backgroundColor: "white", alignItems: "center" }}>

            <PopUpModal labels={labels} modal={popUpModal} setModal={setPopUpModal} />

            <Text style={{ width: "100%", fontWeight: "600", fontSize: vs(16), lineHeight: vs(24), marginBottom: vs(8) }}>Settings</Text>
            
            <Animated.FlatList 
                entering={FadeInDown}
                data={items} 
                keyExtractor={(item) => item?.id} 
                renderItem={renderItem} 
                contentContainerStyle={{ gap: vs(10), paddingVertical: vs(8) }}
                showsVerticalScrollIndicator={false} 
                scrollEnabled={true} 
            />
            
            {BASE_URL === "https://tapimywisy.hostweb.uz/api/v1/app" && <Text style={{ fontSize: vs(18), color: "grey", fontWeight: "600", margin: vs(20) }}>Dev</Text>}
            
            <NewPasswordModal labels={labels} secure={secure} modal={modal} setModal={setModal} setSecure={setSecure} setPopUpModal={setPopUpModal} />

        </View>
    );
};

export default observer(ParentsSettings);
