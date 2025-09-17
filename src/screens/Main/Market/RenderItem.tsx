import { View, useWindowDimensions, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SvgUri } from "react-native-svg";
import store from "../../../store/store";
import { observer } from "mobx-react-lite";
import AnimatedPaw from "../../../components/AnimatedPaw";
import Blur from "../GamesList/SubCollections/BlurView";

const RenderItem = ({ item, setCurrentAnimation, setModal, setAnimationStart, animationStart, index }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const shadow = store.wisySpeaking || animationStart
            
    const isSvg = item?.image?.endsWith('.svg')

    if (store.loadingMarketItems) {
        return (
            <View style={{width: windowHeight * (136 / 360), height: windowHeight * (176 / 360), justifyContent: 'center', flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: 10, borderColor: '#FFFFFF1F', alignItems: 'center', position: 'relative' }}>
                <ActivityIndicator color={'purple'} size={'small'} />
            </View>
        )
    }

    return (
        <TouchableOpacity onPress={shadow || (store.isFirstOpening && index != 0)? () => {} : () => {
            setCurrentAnimation({animation: item?.animation, cost: item?.cost, id: item?.id})
            setAnimationStart(false)
            setModal(true)
        }} style={{width: windowHeight * (136 / 360), height: windowHeight * (176 / 360), padding: 12, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: 10, borderColor: '#FFFFFF1F', alignItems: 'center', position: 'relative', opacity: shadow? 0.6 : 1 }}>
            {isSvg ? (
                <SvgUri
                    uri={item.image}
                    width={windowHeight * (112 / 360)}
                    height={windowHeight * (112 / 360)}
                />
            ) : (
                <Image
                    source={{ uri: item?.image }}
                    style={{
                        width: windowHeight * (112 / 360),
                        height: windowHeight * (112 / 360),
                        resizeMode: 'contain',
                    }}
                />
            )}
            <View style={{width: windowWidth * (112 / 800), height: windowHeight * (16 / 360), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', bottom: windowHeight * (10 / 360)}}>
                <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.name}</Text>
                <View style={{width: 'auto', gap: 4, height: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../images/tabler_star-filled.png')} style={{resizeMode: 'contain',  width: windowWidth * (12 / 800), height: windowHeight * (12 / 360)}}/>
                    <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.cost}</Text>
                </View>
            </View>
            { shadow? <></> : store.isFirstOpening && index === 0 && !store.wisySpeaking && <AnimatedPaw /> }
            { store.isFirstOpening && <Blur forMarket={true} isLocked={index != 0} /> }
        </TouchableOpacity>
    )
}

export default observer(RenderItem);