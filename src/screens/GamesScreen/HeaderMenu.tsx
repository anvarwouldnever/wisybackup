import { View, Platform, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import tabler from '../../images/activeTabler.png';
import building from '../../images/tabler_building-store.png';
import tabler2 from '../../images/tablerInactive.png';
import activeBuilding from '../../images/activeBuilding2.png'

const HeaderMenu = ({ setMarketCollections, setAnimationStart, marketCollections, setAnimation }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: 100, gap: 4, width: Platform.isPad? windowWidth * (184 / 1194) :  windowHeight * (100 / 360), height: Platform.isPad? windowWidth * (104 / 1194) : windowHeight * (56 / 360), position: 'absolute', top: windowHeight * (16 / 360), left: windowWidth * (320 / 800)}}>
                <TouchableOpacity onPress={() => {
                    setAnimation(null)
                    setAnimationStart(false)
                    setMarketCollections(null)
                }} style={{borderRadius: 100, backgroundColor: marketCollections === null? '#504297' : '#F8F8F8', justifyContent: 'center', alignItems: 'center', width: Platform.isPad? windowWidth * (72 / 1194) : windowHeight * (40 / 360), height: Platform.isPad? windowWidth * (68 / 1194) : windowHeight * (40 / 360), borderColor: 'black'}}>
                    <Image source={marketCollections === null? tabler : tabler2} style={{width: Platform.isPad? windowWidth * (40 / 1194) : windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360), aspectRatio: 24 / 24}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setAnimation(null)
                    setAnimationStart(false)
                    setMarketCollections(!null)
                }} style={{justifyContent: 'center', backgroundColor: marketCollections === null? '#F8F8F8' : '#504297', alignItems: 'center', borderRadius: 100, width: Platform.isPad? windowWidth * (72 / 1194) : windowHeight * (40 / 360), height: Platform.isPad? windowHeight * (68 / 834) : windowHeight * (40 / 360),}}>
                    <Image source={marketCollections === null? building : activeBuilding} style={{width: Platform.isPad? windowWidth * (40 / 1194) : windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360), aspectRatio: 24 / 24}}/>
                </TouchableOpacity>
            </View>
        )
    }

export default HeaderMenu;