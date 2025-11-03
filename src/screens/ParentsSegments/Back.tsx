import { TouchableOpacity, Image, Text, useWindowDimensions, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native";
import tablerleft from '../../images/tabler_arrow-left.png'
import { useScale } from "../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";

const Back = ({ name }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();
        const navigation = useNavigation();

        const { s, vs } = useScale()

        return (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{width: 'auto', height: 'auto', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', columnGap: vs(5), marginTop: Platform.OS == 'android'? windowHeight * (40 / 800) : 0}}>
                
                <Ionicons name='arrow-back' size={vs(20)} />
                
                <Text style={{fontWeight: '600', fontSize: vs(20), textAlignVertical: 'center'}}>{name}</Text>

            </TouchableOpacity>
        )
    }

export default Back;