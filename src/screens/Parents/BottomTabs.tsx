import React from "react";
import { View, TouchableOpacity, Image, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Svg, Path } from "react-native-svg";
import { useScale } from '../../hooks/utils/useScale';

const BottomTabs = ({ activeIndex, setScreen, attributes, labels }) => {

    const navigation = useNavigation();

    const { s, vs } = useScale()

    const renderItem = ({ item, index }) => {

        const isSvg = item?.image?.endsWith('.svg');
        const svg = item?.svgData
        const isActive = index === activeIndex

        return (
            <TouchableOpacity activeOpacity={1} onPress={() => setScreen(index)} style={{width: vs(40), height: vs(40), alignItems: 'center', justifyContent: 'center', borderRadius: 100, backgroundColor: isActive ? "#504297" : "#F8F8F8", marginHorizontal: 4}}>
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
                        {svg?.paths.map((path, index) => (
                            <Path
                                key={index}
                                d={path.d}
                                stroke={isActive ? "white" : "#504297"}
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
        <View style={{width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            
            <View style={{width: 'auto', height: '100%', padding: vs(8), alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#F8F8F8', borderRadius: 100 }}>
                
                <FlatList 
                    data={attributes}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    horizontal
                />

                <TouchableOpacity activeOpacity={1} onPress={() => setScreen('Settings')} style={{ width: vs(40), height: vs(40) }}>
                   
                   <Image source={activeIndex === 'Settings' || activeIndex === 'Lang'? require('../../images/settingsActive.png') : require('../../images/settings.png')} style={{ width: vs(40), height: vs(40) }}/>
                
                </TouchableOpacity>
                
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')} style={{width: vs(112), height: '100%', columnGap: vs(10), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 100}}>
                
                <Image source={require('../../images/chat.png')} style={{ width: vs(24), height: vs(24) }}/>
               
                <Text style={{fontWeight: '600', fontSize: vs(12), lineHeight: vs(24), color: '#504297'}}>{labels?.chat}</Text>
                
            </TouchableOpacity>

        </View>
    )
}

export default BottomTabs;