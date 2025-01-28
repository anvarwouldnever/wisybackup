import { TouchableOpacity, Platform, View, Text, Image, useWindowDimensions } from "react-native";
import store from "../../store/store";
import { useNavigation } from "@react-navigation/native";
import dog from '../../images/Dog.png'

const Back = () => {

        const navigation = useNavigation();
        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{width: windowWidth * (126 / 800), alignItems: 'center', flexDirection: 'row', height: Platform.isPad? windowWidth * (48 / 800) : windowHeight * (48 / 360), position: 'absolute', left: windowWidth * (60 / 800), top: windowHeight * (20 / 360)}}>
                <View style={{width: windowWidth * (100 / 800), justifyContent: 'center', alignItems: 'center', position: 'absolute', alignSelf: 'center', right: 0, borderRadius: 100, height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: '#FFFFFF'}}>
                    <Text style={{fontWeight: '600', fontSize: windowWidth * (12 / 800), color: '#000000'}}>{store.playingChildId.name}</Text>
                </View>
                <Image source={dog} style={{width: windowWidth * (48 / 800), height: windowHeight * (48 / 360), aspectRatio: 48 / 48}}/>
            </TouchableOpacity>
        )
    }

export default Back;