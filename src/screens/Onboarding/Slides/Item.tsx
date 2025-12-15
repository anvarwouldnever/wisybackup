import { View, Text, Platform } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { SvgUri } from 'react-native-svg';
import { useScale } from '../../../hooks/utils/useScale';
import { observer } from 'mobx-react-lite';
import { Image } from 'expo-image'

const Item = ({ item, slideWidth }) => {

    const { vs } = useScale();

    const isLottie = item?.image?.url.endsWith('json');
    const isSvg = item?.image?.url.endsWith('svg');

    return (
        <View style={{alignItems: 'center', width: slideWidth, height: vs(402), justifyContent: 'flex-start'}}>

            {isLottie? 
                <LottieView source={{ uri: item?.image?.url }} autoPlay style={{width: slideWidth, height: vs(206)}} loop={true} resizeMode='contain'/> 
                    : 
                isSvg?
                    <SvgUri uri={item?.image?.url} width={slideWidth} height={vs(206)} />
                    :
                    <Image style={{width: slideWidth, height: vs(206) }} contentFit='contain' source={{ uri: item?.image?.url }}/>
            }

            <View style={{width: slideWidth, height: 'auto', marginTop: vs(10)}}>
                
                <View style={{width: slideWidth, height: 'auto', flexDirection: 'column'}}>
                    <Text style={{letterSpacing: 0.5, fontWeight: '600', color: '#222222', fontSize: Platform.isPad? vs(26) : vs(24), textAlign: 'center'}}>{item?.header1}</Text>
                    {item?.title != '' && <Text style={{marginTop: 5, letterSpacing: 0.5, fontWeight: '600', color: '#222222', fontSize: Platform.isPad? vs(26) : vs(24), textAlign: 'center'}}>{item?.title}</Text>}
                </View>
                
                <View style={{paddingTop: vs(10), alignItems: 'center', justifyContent: 'center', width: slideWidth, height: 'auto'}}>
                    <Text style={{color: '#555555', fontSize: Platform.isPad? vs(14) : vs(12), fontWeight: '400', textAlign: 'center', lineHeight: Platform.isPad? vs(26) : vs(24)}}>
                        {item?.description}
                    </Text>
                </View>

            </View>

        </View>
    )
};

export default observer(Item)