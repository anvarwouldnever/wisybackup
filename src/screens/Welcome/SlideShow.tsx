import React from "react";
import { FlatList, View, Image, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { SvgUri } from "react-native-svg";

const { width, height } = Dimensions.get('window');

const SlideShow = ({ onPageChange, onboardings }) => {

    const renderItem = ({ item }) => {

        const isLottie = item?.image?.url.endsWith('json')
        const isSvg = item?.image?.url.endsWith('svg')

        return (
            <View style={{flexDirection: 'column', alignItems: 'center', width: width, height: 'auto'}}>
                
                {isLottie? 
                    <LottieView 
                        source={{ uri: item.image.url }}
                        autoPlay
                        style={{width:  width * 0.8666, height: height * 0.2575}}
                        loop={true}
                        resizeMode='contain'
                    /> 
                        : 
                    isSvg?
                        <SvgUri uri={item.image.url} width={width * 0.8666} height={height * 0.2575}/>
                        :
                        <Image style={{width: width * 0.8666, height: height * 0.2575}} resizeMode='contain' source={{ uri: item.image.url }}/>
                }

                <View style={{width: width * 0.8666, height: 'auto', marginTop: height * (20 / 800)}}>
                    <View style={{width: width * 0.8666, height: 'auto', flexDirection: 'column'}}>
                        <Text style={{letterSpacing: 0.5, fontWeight: '600', color: '#222222', fontSize: height * (24 / 800), textAlign: 'center'}}>{item.header1}</Text>
                        {item.title != '' && <Text style={{marginTop: 5, letterSpacing: 0.5, fontWeight: '600', color: '#222222', fontSize: height * (24 / 800), textAlign: 'center'}}>{item.title}</Text>}
                    </View>
                    <View style={{paddingTop: height * (10 / 800), alignItems: 'center', justifyContent: 'center', width: width * 0.8666, height: 'auto'}}>
                        <Text style={{color: '#555555', fontSize: height * (12 / 800), fontWeight: '400', textAlign: 'center', lineHeight: height * (24 / 800)}}>{item.description}</Text>
                    </View>
                </View>
            </View>
        )
    };

    return (
        <FlatList
            keyExtractor={item => item.id}
            data={onboardings} 
            renderItem={renderItem}
            horizontal={true}
            pagingEnabled={true}
            style={{alignSelf: 'center'}}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(event) => {
                const index = Math.floor(event.nativeEvent.contentOffset.x / (width - (width - (width * 0.8666))));
                onPageChange(index)}
            }
        />
    )
}

export default SlideShow;