import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useScale } from "../../hooks/utils/useScale";
import * as ScreenOrientation from "expo-screen-orientation";

const ParentsCancel = ({ setIsFrozen, labels }) => {

    const navigation = useNavigation();

    const { s, vs } = useScale()

    const onPress = async() => {
        setIsFrozen(true)
    
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        setTimeout(() => {
            navigation.navigate('GamesScreen');
        }, 150);
    }
    
    return (
        <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', height: vs(28)}}>
            
            <Text style={{fontWeight: '600', fontSize: vs(20), lineHeight: vs(28)}}>{labels?.parents}</Text>
            
            <TouchableOpacity onPress={() => onPress()} style={{justifyContent: 'center', alignItems: 'center', width: s(24), height: vs(24)}}>
                
                <Image source={require('../../images/x.png')} style={{width: s(18), height: vs(18), aspectRatio: 1}}/>
            
            </TouchableOpacity>

        </View>
    )
}

export default ParentsCancel;