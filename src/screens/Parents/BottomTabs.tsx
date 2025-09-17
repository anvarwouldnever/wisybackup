import settings from '../../images/settings.png';
import settingsActive from '../../images/settingsActive.png';
import chat from '../../images/chat.png';
import React from "react";
import { View, TouchableOpacity, Image, Text, FlatList, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import store from "../../store/store";
import { Svg, Path } from "react-native-svg";
import { useScale } from '../../hooks/useScale';

const BottomTabs = ({ screen, setScreen }) => {

    const navigation = useNavigation();

    const attributes = store?.attributes

    const { s, vs } = useScale()

    const renderItem = ({ item }) => {

        let isSvg = item?.image?.endsWith('.svg');
        const svg = item?.svgData

        return (
            <TouchableOpacity activeOpacity={1} onPress={() => setScreen(item)} style={{width: vs(40), height: vs(40), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: screen.name === item?.name? "#504297" : "#F8F8F8", marginHorizontal: 4}}>
                {isSvg && svg ? (
                    <Svg
                        style={{
                            aspectRatio: 1
                        }}
                        viewBox="0 0 24 24"
                        width={vs(24)}
                        height={vs(24)}
                        fill={'none'}
                    >
                        {svg.paths.map((path, index) => (
                        <Path
                            key={index}
                            d={path.d}
                            stroke={screen.name === item.name? "white" : "#504297"}
                            strokeWidth={2}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                        />
                    ))}
                    </Svg>
                ) : (
                    <Image
                        source={{ uri: item?.image }}
                        style={{
                            width: vs(24),
                            height: vs(24),
                            aspectRatio: 1,
                        }}
                    />
                )}
            </TouchableOpacity>
        )
    }

    return (
        <View style={{width: s(312), height: vs(56), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            
            <View style={{width: 'auto', height: vs(56), justifyContent: 'space-between', padding: 8, alignItems: 'center', flexDirection: 'row', backgroundColor: '#F8F8F8', borderRadius: 100}}>
                
                <FlatList 
                    data={attributes}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    horizontal
                />

                <TouchableOpacity activeOpacity={1} onPress={() => setScreen('Settings')} style={{width: s(40), height: vs(40)}}>
                    <Image source={screen === 'Settings' || screen === 'Lang'? settingsActive : settings} style={{width: s(40), height: vs(40), aspectRatio: 1 }}/>
                </TouchableOpacity>
                
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={{width: Platform.isPad? vs(56) : s(112), height: vs(56), gap: vs(8), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 100}}>
                <Image source={chat} style={{width: vs(24), height: vs(24), aspectRatio: 1}}/>
                <Text style={{fontWeight: '600', fontSize: vs(12), lineHeight: vs(24), color: '#504297'}}>Chat</Text>
            </TouchableOpacity>

        </View>
    )
}

export default BottomTabs;