import { View, Image, Text, TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";
import store from "../../../store/store";
import { observer } from "mobx-react-lite";
import AnimatedPaw from "../../../components/AnimatedPaw";
import Blur from "../GamesList/SubCollections/BlurView";
import { useScale } from "../../../hooks/utils/useScale";

const RenderItem = ({ item, setCurrentAnimation, setModal, setAnimationStart, animationStart, index }) => {

    const shadow = store?.wisySpeaking || animationStart
            
    const isSvg = item?.image?.endsWith('.svg')

    const { s, vs, isTablet } = useScale()

    const onPress = () => {
        if (shadow || (store.isFirstOpening && index != 0)) return
        setCurrentAnimation({animation: item?.animation, cost: item?.cost, id: item?.id})
        setAnimationStart(false)
        setModal(true)
    }

    return (
        <TouchableOpacity onPress={() => onPress()} style={{width: vs(320), height: vs(370), justifyContent: 'space-between', paddingHorizontal: 0, paddingTop: s(5), paddingBottom: s(8), flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: s(4), borderColor: '#FFFFFF1F', alignItems: 'center', opacity: shadow? 0.6 : 1 }}>
            
            <View style={{ width: '100%', height: '75%', alignItems: 'center', justifyContent: 'center'}}>
                {isSvg ? 
                    <SvgUri uri={item?.image} width={'100%'} height={'100%'} />
                : 
                    <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain'}} />
                }
            </View>

            <View style={{width: '100%', height: 'auto', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(8)}}>
                
                <Text style={{fontSize: isTablet ? s(6) : s(5), fontWeight: '600', color: 'white'}}>{item?.name}</Text>
                
                <View style={{width: 'auto', columnGap: s(2), height: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    
                    <Image source={require('../../../images/star.png')} style={{resizeMode: 'contain',  width: s(7), height: s(7)}}/>
                    
                    <Text style={{fontSize: s(6), fontWeight: '600', color: 'white'}}>{item?.cost}</Text>

                </View>

            </View>

            { shadow ? <></> : store.isFirstOpening && index === 0 && !store.wisySpeaking && <AnimatedPaw /> }

            { store?.isFirstOpening && <Blur forMarket={true} isLocked={index != 0} width={320} height={370} /> }

        </TouchableOpacity>
    )
}

export default observer(RenderItem);