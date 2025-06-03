import { View, useWindowDimensions, Image, Text, TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";
import star from '../../images/tabler_star-filled.png'
import store from "../../store/store";
import { observer } from "mobx-react-lite";

const RenderItem = ({ item, setCurrentAnimation, setModal, setAnimationStart, animationStart }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
            
    const isSvg = item?.image?.endsWith('.svg')
    
            return (
                <TouchableOpacity onPress={store.wisySpeaking || animationStart? () => {return} : () => {
                    setCurrentAnimation({animation: item.animation, cost: item.cost, id: item.id})
                    setAnimationStart(false)
                    setModal(true)
                }} style={{width: windowHeight * (136 / 360), height: windowHeight * (176 / 360), padding: 12, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#D8F6FF33', borderRadius: 10, borderColor: '#FFFFFF1F', alignItems: 'center', alignSelf: 'center', position: 'relative', opacity: store.wisySpeaking || animationStart? 0.6 : 1 }}>
                    {isSvg ? (
                        <SvgUri
                            uri={item.image}
                            width={windowHeight * (112 / 360)}
                            height={windowHeight * (112 / 360)}
                        />
                    ) : (
                        <Image
                            source={{ uri: item.image }}
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
                            <Image source={star} style={{resizeMode: 'contain',  width: windowWidth * (12 / 800), height: windowHeight * (12 / 360)}}/>
                            <Text style={{fontSize: 12, fontWeight: '600', color: 'white'}}>{item.cost}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }

export default observer(RenderItem);