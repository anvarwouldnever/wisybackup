import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import store from "../../store/store";
import { observer } from "mobx-react-lite";
import { useScale } from "../../hooks/utils/useScale";

const GoParent = ({ setAnimationStart }) => {

        const navigation = useNavigation();

        const { s, vs } = useScale()
        
        return (
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', height: s(20), width: s(20), paddingHorizontal: s(5), backgroundColor: '#F8F8F833', borderRadius: 100, borderWidth: 1, borderColor: '#FFFFFF1F'}} onPress={store.isFirstOpening ? () => {} : () => {setAnimationStart(false); navigation.replace('ParentsCaptchaScreen')}}>
                
                <Image source={require('../../images/parent.png')} style={{width: s(12), height: s(12)}}/>
            
            </TouchableOpacity>
        )
    }

export default observer(GoParent);