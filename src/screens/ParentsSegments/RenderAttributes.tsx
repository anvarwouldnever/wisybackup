import { TouchableOpacity, View, Image, Text,  } from "react-native";
import { useScale } from "../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";

const RenderAttributes = ({ item, setModalData, setInformationModal }) => {

    const onPress = () => {
        setModalData(item);
        setInformationModal(true);
    }

    const { s, vs } = useScale()

    return (
        <TouchableOpacity onPress={() => onPress()} style={{ width: '100%', height: 'auto', backgroundColor: '#F8F8F8', borderRadius: vs(12), padding: vs(16), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            
            <View style={{ flexDirection: 'row', columnGap: vs(14) }}>

                <Image source={require('../../images/Numbers.png')} style={{ width: vs(40), height: vs(40) }} />
                
                <View style={{ width: '70%', height: 'auto', rowGap: vs(6), justifyContent: 'center' }}>
                    
                    <Text numberOfLines={1} style={{ color: '#222222', fontWeight: '600', fontSize: vs(14) }}>
                        {item?.name}
                    </Text>

                    <Text style={{ color: '#222222', fontWeight: '400', fontSize: vs(12) }}>
                        {item?.mistakes} mistakes
                    </Text>

                </View>

            </View>
            
           <Ionicons name='chevron-forward' size={vs(24)} />

        </TouchableOpacity>
    )
} 

export default RenderAttributes;