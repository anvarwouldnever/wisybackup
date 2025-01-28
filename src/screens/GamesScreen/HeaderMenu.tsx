import { View, Platform, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import tabler from '../../images/tabler_device-gamepad.png';
import building from '../../images/tabler_building-store.png';

const HeaderMenu = ({ setMarketCollections, setAnimationStart }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: 100, padding: 8, width: Platform.isPad? windowWidth * (184 / 1194) : windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (104 / 1194) : windowHeight * (56 / 360), position: 'absolute', top: windowHeight * (16 / 360), left: windowWidth * (320 / 800)}}>
                <TouchableOpacity onPress={() => {
                    setAnimationStart(false)
                    setMarketCollections(null)
                }} style={{borderRadius: 100, backgroundColor: '#504297', justifyContent: 'center', alignItems: 'center', width: Platform.isPad? windowWidth * (72 / 1194) : windowWidth * (40 / 800), height: Platform.isPad? windowWidth * (68 / 1194) : windowHeight * (40 / 360), borderColor: 'black'}}>
                    <Image source={tabler} style={{width: Platform.isPad? windowWidth * (40 / 1194) : windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360), backgroundColor: '#504297', aspectRatio: 24 / 24}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setAnimationStart(false)
                    setMarketCollections(!null)
                }} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 100, width: Platform.isPad? windowWidth * (72 / 1194) : windowWidth * (40 / 800), height: Platform.isPad? windowHeight * (68 / 834) : windowHeight * (40 / 360),}}>
                    <Image source={building} style={{width: Platform.isPad? windowWidth * (40 / 1194) : windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360), aspectRatio: 24 / 24}}/>
                </TouchableOpacity>
            </View>
        )
    }

export default HeaderMenu;