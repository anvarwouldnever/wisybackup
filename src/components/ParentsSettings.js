import React, { useState } from "react";
import { TouchableOpacity, View, useWindowDimensions, Image, Text } from "react-native";
import mail from '../images/mail.png';
import narrowright from '../images/narrowright.png';
import password from '../images/password.png';
import support from '../images/message.png';
import speaker from '../images/speaker.png';
import Animated, { withTiming, useAnimatedStyle } from "react-native-reanimated";
import text from '../images/text.png';
import NewPasswordModal from "./NewPasswordModal";
import PopUpModal from "./PopUpModal";
import store from "../store/store";
import langIcon from '../images/languageIcon.png';
import { observer } from "mobx-react-lite";
import translations from "../../localization";

const ParentsSettings = ({ setScreen }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [modal, setModal] = useState(false);
    const [popUpModal, setPopUpModal] = useState(false);
    const [secure, setSecure] = useState(true);

    let voiceInstructions = store.voiceInstructions;

    const animatedToggle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: withTiming(voiceInstructions? windowHeight * (9 / 800) : 0, {duration: 300})
            }],
            backgroundColor: withTiming(!voiceInstructions? 'white' : 'black', {duration: 400})
        }
    })

    const logout = async() => {
        await store.setToken(null)
        await store.setChildren(null)
        // setTimeout(() => {
        //     navigation.navigate('AuthScreen')
        // }, 100);
    }

    return (
            <View style={{width: windowWidth * (312 / 360), backgroundColor: 'white', alignItems: 'center', height: windowHeight * (414 / 800), gap: 16}}>
                <PopUpModal modal={popUpModal} setModal={setPopUpModal}/>
                <Text style={{width: windowWidth * (312 / 360), height: windowHeight * (24 / 800), fontWeight: '600', fontSize: windowHeight * (16 / 800), lineHeight: windowHeight * (24 / 800)}}>Settings</Text>
                <View style={{width: 'auto', height: windowHeight * (328 / 800), alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
                    <TouchableOpacity style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: windowHeight * (16 / 800), borderRadius: 10, gap: 8}}>
                        <Image source={mail} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        <Text style={{fontSize: windowHeight * (14 / 800), fontWeight: '600', lineHeight: windowHeight * (20 / 800), color: '#222222', width: windowWidth * (216 / 360)}}>{translations?.[store.language].changeEmail}</Text>
                        <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModal(true)} style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: windowHeight * (16 / 800), borderRadius: 10}}>
                        <Image source={password} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        <Text style={{fontSize: windowHeight * (14 / 800), fontWeight: '600', lineHeight: windowHeight * (20 / 800), color: '#222222', width: windowWidth * (216 / 360)}}>{translations?.[store.language].changePassword}</Text>
                        <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => store.setVoiceInstructions(!store.voiceInstructions)} style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: windowHeight * (16 / 800), borderRadius: 10}}>
                        <Image source={speaker} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        <Text style={{fontSize: windowHeight * (14 / 800), fontWeight: '600', lineHeight: windowHeight * (20 / 800), color: '#222222', width: windowWidth * (216 / 360)}}>{translations?.[store.language].voiceInstructions}</Text>
                        <View style={{width: windowHeight * (22 / 800), height: windowHeight * (14 / 800), borderWidth: windowHeight * (2 / 800), borderColor: '#222222', borderRadius: 100, justifyContent: 'center', padding: 2}}>
                            <Animated.View style={[animatedToggle, {backgroundColor: 'black', borderWidth: windowHeight * (2 / 800), borderColor: 'black', width: windowHeight * (6 / 800), height: windowHeight * (6 / 800), borderRadius: 100}]}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: windowHeight * (16 / 800), borderRadius: 10}}>
                        <Image source={text} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        <Text style={{fontSize: windowHeight * (14 / 800), fontWeight: '600', lineHeight: windowHeight * (20 / 800), color: '#222222', width: windowWidth * (216 / 360)}}>{translations?.[store.language].textInstructions}</Text>
                        <View style={{width: windowHeight * (22 / 800), height: windowHeight * (14 / 800), borderWidth: windowHeight * (2 / 800), borderColor: '#222222', borderRadius: 100, justifyContent: 'center', padding: 2, alignItems: 'flex-end'}}>
                            <Animated.View style={[{backgroundColor: 'black', borderWidth: windowHeight * (2 / 800), borderColor: 'black', width: windowHeight * (6 / 800), height: windowHeight * (6 / 800), borderRadius: 100}]}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: windowHeight * (16 / 800), borderRadius: 10}}>
                        <Image source={support} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        <Text style={{fontSize: windowHeight * (14 / 800), fontWeight: '600', lineHeight: windowHeight * (20 / 800), color: '#222222', width: windowWidth * (216 / 360)}}>{translations?.[store.language].support}</Text>
                        <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setScreen('Lang')} style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: windowHeight * (16 / 800), borderRadius: 10}}>
                        <Image source={langIcon} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24, resizeMode: 'contain' }}/>
                        <Text style={{fontSize: windowHeight * (14 / 800), fontWeight: '600', lineHeight: windowHeight * (20 / 800), color: '#222222', width: windowWidth * (216 / 360)}}>{translations?.[store.language].language}</Text>
                        <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => logout()} style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: windowHeight * (16 / 800), borderRadius: 10}}>
                        <Image source={support} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        <Text style={{fontSize: windowHeight * (14 / 800), fontWeight: '600', lineHeight: windowHeight * (20 / 800), color: 'red', width: windowWidth * (216 / 360)}}>{translations?.[store.language].logout}</Text>
                        <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    </TouchableOpacity>
                </View>
                <NewPasswordModal secure={secure} modal={modal} setModal={setModal} setSecure={setSecure} setPopUpModal={setPopUpModal}/>
            </View> 
    )
}

export default observer(ParentsSettings);