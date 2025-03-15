import { TouchableOpacity, Image, Text, useWindowDimensions, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native";
import tablerleft from '../../images/tabler_arrow-left.png'

const Back = ({ name }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();
        const navigation = useNavigation();

        return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{width: windowWidth * (312 / 360), height: windowHeight * (28 / 800), flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS == 'android'? windowHeight * (40 / 800) : 0}}>
                <Image source={tablerleft} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800)}}/>
                <Text style={{fontWeight: '600', fontSize: windowHeight * (20 / 800), marginLeft: windowWidth * (5 / 360), textAlignVertical: 'center'}}>{name}</Text>
            </TouchableOpacity>
        )
    }

export default Back;