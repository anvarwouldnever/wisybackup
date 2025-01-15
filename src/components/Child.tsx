import { TouchableOpacity, View, Image, Text, useWindowDimensions } from "react-native"
import dog from '../images/Dog.png';
import narrowdown from '../images/narrowdown.png';
import store from "../store/store";

const Child = ({ setDropDown, dropDown }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <TouchableOpacity activeOpacity={1} onPress={() => setDropDown(prev => !prev)} style={{height: 'auto', width: windowWidth * (312 / 360)}}>
                <View style={{width: windowWidth * (312 / 360), padding: windowWidth * (16 / 360), height: windowHeight * (80 / 800), justifyContent: 'space-between', borderRadius: 12, backgroundColor: '#F8F8F8', flexDirection: 'row', gap: windowWidth * (12 / 360), alignItems: 'center'}}>
                    <Image source={dog} style={{width: windowHeight * (48 / 800), height: windowWidth * (48 / 800), aspectRatio: 48 / 48}}/>
                    <View style={{width: windowWidth * (184 / 360), height: windowHeight * (44 / 800), alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <View style={{width: windowWidth * (184 / 360), height: windowHeight * (20 / 800), flexDirection: 'row'}}>
                            <Text style={{fontWeight: '600', color: '#000000', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>{store.playingChildId.name}</Text>
                            <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800), marginLeft: 5}}>/ age 6</Text>
                        </View>
                        <View style={{width: windowWidth * (184 / 360), flexDirection: 'row', height: windowHeight * (20 / 800)}}>
                            <Text style={{fontWeight: '600', color: '#222222', lineHeight: windowHeight * (20 / 800), fontSize: windowHeight * (12 / 800)}}>63</Text>
                            <Text style={{fontWeight: '400', fontSize: windowHeight * (12 / 800), color: '#555555', lineHeight: windowHeight * (20 / 800), marginLeft: 5}}>completed tasks</Text>
                        </View>
                    </View>
                    <View style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={narrowdown} style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

export default Child;