import { View, Text, Image, useWindowDimensions } from "react-native";
import store from "../../store/store";
import star from '../../images/tabler_star-filled.png';
import { observer } from "mobx-react-lite";
import { useScale } from "../../hooks/useScale";

const Stars = () => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        const { s, vs, isTablet } = useScale()

        return (
            <View style={{backgroundColor: '#F8F8F833', columnGap: s(2), height: s(20), justifyContent: 'center', flexDirection: 'row', paddingHorizontal: s(6), alignItems: 'center', borderRadius: 100, borderWidth: 1, borderColor: '#FFFFFF1F'}}>
                
                <Image source={star} style={{width: s(10), height: s(10)}}/>
                
                <Text style={{fontWeight: '600', fontSize: isTablet ? s(10) : s(10), color: 'white', textAlign: 'center'}}>{store.playingChildId?.stars}</Text>
            
            </View>
        )
    }

export default observer(Stars);