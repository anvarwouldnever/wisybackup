import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { useScale } from "../../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown } from "react-native-reanimated";

const Attributes = ({ attributes, activeIndex }) => {

    const navigation = useNavigation();

    const color = attributes?.color;

    const { s, vs } = useScale()

    const renderItem = ({ item }) => {

        const isSvg = item?.image.endsWith(".svg");

        return (
            <TouchableOpacity onPress={() => navigation.navigate('ParentsSegments', { screen: item })} style={{ width: '100%', height: 'auto', borderRadius: vs(12), padding: vs(16), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                
                <View style={{ justifyContent: 'center', alignItems: 'center', columnGap: vs(14), flexDirection: 'row' }}>
                    
                    <View style={{ backgroundColor: `${color}`, borderRadius: vs(12), width: vs(48), height: vs(48) }}>
                        {isSvg ? (
                            <SvgUri uri={item?.image} width={'100%'} height={'100%'} stroke={`${color}`} />
                        ) : (
                            <Image source={item?.image} style={{ width: '100%', height: '100%', borderRadius: vs(12)}}/>
                        )}
                    </View>

                    <Text style={{ color: '#222222', fontWeight: '600', fontSize: vs(14)}}>
                        {item?.name}
                    </Text>

                </View>
                
                <Ionicons name='chevron-forward' size={vs(20)} />

            </TouchableOpacity>
        );

    };

    return (
        <Animated.FlatList
            key={activeIndex}
            entering={FadeInDown.duration(400)}
            data={attributes?.attributes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ rowGap: vs(12) }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
        />
    );
};

export default Attributes;
