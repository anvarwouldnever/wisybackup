import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import Knowledge from "./ParentsComponent/Knowledge";
import Animated, { FadeInDown } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { useScale } from "../../hooks/useScale";
import GetToKnowYourChild from "./ParentsComponent/GetToKnowYourChild";

const ParentsComponent = ({ screen, loading, error }) => {

    const { s, vs } = useScale()

    return (
        <View style={{width: s(312), height: vs(502), justifyContent: 'space-between', gap: vs(13)}}>
            
            <Text style={{fontSize: vs(16), fontWeight: '600', height: vs(24)}}>{screen?.name}</Text>
            
            {screen != 'Settings' && <GetToKnowYourChild />}
            
            <ScrollView contentContainerStyle={{justifyContent: loading? 'center' : 'space-between', gap: s(16), height: loading? vs(300) : 'auto'}} showsVerticalScrollIndicator={false}>
                {error != ''? 
                    
                    <Text style={{fontSize: vs(18), width: s(312), position: 'absolute', alignSelf: 'center', color: 'purple', textAlign: 'center'}}>{error}</Text> 
                
                : loading? 

                    <ActivityIndicator size={'large'} color={'purple'} style={{position: 'absolute', alignSelf: 'center'}}/> 
                
                :

                    <Animated.View key={screen?.name} entering={FadeInDown.duration(400)} style={{width: s(312), height: 'auto'}}>
                        <Knowledge screen={screen}/>
                    </Animated.View>

                }

            </ScrollView>

        </View>
    )
}

export default observer(ParentsComponent);