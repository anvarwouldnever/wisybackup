import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import parent from '../../images/tabler_accessible.png';
import store from "../../store/store";
import { observer } from "mobx-react-lite";
import { useScale } from "../../hooks/useScale";

const GoParent = ({ setAnimationStart }) => {

        const navigation = useNavigation();

        const { s, vs } = useScale()
        
        return (
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', height: s(20), width: s(20), paddingHorizontal: s(5), backgroundColor: '#F8F8F833', borderRadius: 100, borderWidth: 1, borderColor: '#FFFFFF1F'}} onPress={store.isFirstOpening ? () => {} : () => {setAnimationStart(false); navigation.navigate('ParentsCaptchaScreen')}}>
                
                <Image source={parent} style={{width: s(12), height: s(12)}}/>
            
            </TouchableOpacity>
        )
    }

export default observer(GoParent);