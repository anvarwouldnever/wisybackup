import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { observer } from "mobx-react-lite";
import { useScale } from "../../hooks/utils/useScale";
import GetToKnowYourChild from "./ParentsComponent/GetToKnowYourChild";
import Attributes from "./ParentsComponent/Attributes";

const ParentsComponent = ({ activeIndex, loading, attributes, name, labels }) => {

    const { s, vs } = useScale()

    return (
        <View style={{ width: '100%', height: vs(502), justifyContent: 'space-between', gap: vs(13) }}>
            
            <Text style={{ fontSize: vs(16), fontWeight: '600', height: vs(24) }}>{name}</Text>
            
            {activeIndex != 'Settings' && 
                <GetToKnowYourChild labels={labels} />
            }
            
            <ScrollView contentContainerStyle={{justifyContent: loading? 'center' : 'space-between', height: loading? vs(300) : 'auto' }} showsVerticalScrollIndicator={false}>
                
                {loading? 

                    <ActivityIndicator size={'large'} color={'purple'} style={{position: 'absolute', alignSelf: 'center'}}/> 
                :
                    <Attributes attributes={attributes} activeIndex={activeIndex} />
                }

            </ScrollView>

        </View>
    )
}

export default observer(ParentsComponent);