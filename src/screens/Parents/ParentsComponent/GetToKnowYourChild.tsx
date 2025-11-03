import { Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import translations from '../../../../localization';
import store from '../../../store/store';
import { observer } from 'mobx-react-lite';
import { useScale } from '../../../hooks/utils/useScale';

const GetToKnowYourChild = () => {

    const navigation = useNavigation();

    const { s, vs, isTablet } = useScale()

    return (
        <View style={{ backgroundColor: '#C4DF84', flexDirection: 'row', columnGap: vs(16), padding: vs(14), alignSelf: 'center', borderRadius: vs(16), width: '100%', height: 'auto' }}>
            
            <Image source={require('../../../images/Winking.png')} style={{ width: vs(46), height: vs(46) }}/>
            
            <View style={{ width: '75%', height: 'auto', justifyContent: 'center', rowGap: vs(16) }}>
                
                <View style={{ width: '100%', height: 'auto', alignSelf: 'center', flexDirection: 'column', justifyContent: 'center', rowGap: vs(6) }}>
                    
                    <Text style={{ fontWeight: '600', fontSize: vs(16), height: 'auto', lineHeight: vs(20) }}>{translations?.[store.language].getToKnowYourChild}</Text>
                    
                    <Text style={{ fontWeight: '600', color: '#555555', fontSize: isTablet ? vs(14) : vs(12), height: 'auto', lineHeight: vs(20) }}>{translations?.[store.language].tenInsights}</Text>
                
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("ChatScreen")} style={{width: vs(110), height: vs(40), justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 100}}>
                    
                    <Text style={{ color: '#504297', fontWeight: '600', fontSize: vs(12) }}>{translations?.[store.language]?.openChat}</Text>
                
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default observer(GetToKnowYourChild);