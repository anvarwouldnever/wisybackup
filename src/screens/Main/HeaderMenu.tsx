import { View, TouchableOpacity, Image } from "react-native";
import { observer } from "mobx-react-lite";
import store from "../../store/store";
import { useScale } from "../../hooks/useScale";

const HeaderMenu = ({ setMarketCollections, setAnimationStart, marketCollections, setAnimation }) => {

        const { s, vs } = useScale()

        const onPressMenu = () => {
            if (store.isFirstOpening) return
            setAnimation(null)
            setAnimationStart(false)
            setMarketCollections(null)
        }

        const onPressMarket = () => {
            if (store.isFirstOpening) return
            setAnimation(null)
            setAnimationStart(false)
            setMarketCollections(!null)
        }

        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: 100, columnGap: vs(6), width: 'auto', height: 'auto', padding: vs(14)}}>
                
                <TouchableOpacity onPress={() => onPressMenu()} style={{borderRadius: 100, backgroundColor: marketCollections === null? '#504297' : '#F8F8F8', justifyContent: 'center', alignItems: 'center', width: s(20), height: s(20)}}>
                    
                    <Image source={marketCollections === null? require('../../images/activeTabler.png') : require('../../images/tablerInactive.png')} style={{ width: s(12), height: s(12) }}/>
                
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onPressMarket()} style={{justifyContent: 'center', backgroundColor: marketCollections === null? '#F8F8F8' : '#504297', alignItems: 'center', borderRadius: 100, width: s(20), height: s(20)}}>
                    
                    <Image source={marketCollections === null? require('../../images/tabler_building-store.png') : require('../../images/activeBuilding2.png')} style={{ width: s(12), height: s(12) }}/>
                
                </TouchableOpacity>

            </View>
        )
    }

export default observer(HeaderMenu);