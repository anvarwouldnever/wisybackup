import { View, Platform, Text, Image, useWindowDimensions } from "react-native";
import store from "../../store/store";
import star from '../../images/tabler_star-filled.png';

const Stars = () => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <View style={{backgroundColor: '#F8F8F833', gap: 4, justifyContent: 'center', flexDirection: 'row', padding: 8, alignItems: 'center', width: Platform.isPad? windowWidth * (113 / 1194) : windowWidth * (75 / 800), height: Platform.isPad? windowWidth * (72 / 1194) : windowHeight * (40 / 360), top: windowHeight * (24 / 360), left: windowWidth * (653 / 800), position: 'absolute', borderRadius: 100, borderWidth: 1, borderColor: '#FFFFFF1F'}}>
                <Image source={star} style={{width: Platform.isPad? windowWidth * (40 / 1194) : windowWidth * (24 / 800), height: Platform.isPad? windowWidth * (40 / 1194) : windowHeight * (24 / 360), aspectRatio: 24 / 24}}/>
                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowHeight * (24 / 834) : windowWidth * (20 / 800), color: 'white', textAlign: 'center'}}>{store.playingChildId?.stars}</Text>
            </View>
        )
    }

export default Stars