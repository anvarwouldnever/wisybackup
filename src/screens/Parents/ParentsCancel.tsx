import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import translations from "../../../localization";
import store from "../../store/store";
import { useScale } from "../../hooks/useScale";

const ParentsCancel = () => {

    const navigation = useNavigation();

    const { s, vs } = useScale()
    
    return (
        <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', height: vs(28)}}>
            
            <Text style={{fontWeight: '600', fontSize: vs(20), lineHeight: vs(28)}}>{translations?.[store.language]?.parents}</Text>
            
            <TouchableOpacity onPress={() => navigation.replace('GamesScreen')} style={{justifyContent: 'center', alignItems: 'center', width: s(24), height: vs(24)}}>
                
                <Image source={require('../../images/x.png')} style={{width: s(18), height: vs(18), aspectRatio: 1}}/>
            
            </TouchableOpacity>

        </View>
    )
}

export default ParentsCancel;