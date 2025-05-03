import { TouchableOpacity, Platform, Image, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import parent from '../../images/tabler_accessible.png';

const GoParent = ({ setAnimationStart }) => {

        const navigation = useNavigation();
        const { height: windowHeight, width: windowWidth } = useWindowDimensions();
        
        return (
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', width: Platform.isPad? windowWidth * (68 / 1194) : windowHeight * (40 / 360), height: Platform.isPad? windowWidth * (68 / 1194) : windowHeight * (40 / 360), backgroundColor: '#F8F8F833', borderRadius: 100, borderWidth: 1, borderColor: '#FFFFFF1F'}} onPress={() => { 
                setAnimationStart(false)
                navigation.navigate('ParentsCaptchaScreen')
            }}>
                <Image source={parent} style={{width: windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (24 / 800) : windowHeight * (24 / 360), aspectRatio: 24 / 24}}/>
            </TouchableOpacity>
        )
    }

export default GoParent;