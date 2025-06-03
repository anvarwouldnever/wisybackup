import { TouchableOpacity, Platform, View, Text, Image, useWindowDimensions } from "react-native";
import store from "../../store/store";
import { useNavigation } from "@react-navigation/native";
import dog from '../../images/Dog.png'
import { SvgUri } from "react-native-svg";

const Back = () => {

        const navigation = useNavigation();
        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        const goBack = () => {
            navigation.goBack()
            store.resetSubCollection()
        }

        return (
            <TouchableOpacity onPress={() => goBack()} style={{width: windowWidth * (126 / 800), alignItems: 'center', flexDirection: 'row', height: Platform.isPad? windowWidth * (48 / 800) : windowHeight * (48 / 360), position: 'absolute', left: windowWidth * (60 / 800), top: windowHeight * (20 / 360)}}>
                <View style={{width: windowWidth * (100 / 800), justifyContent: 'center', alignItems: 'center', position: 'absolute', alignSelf: 'center', right: 0, borderRadius: 100, height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: '#FFFFFF'}}>
                    <Text style={{fontWeight: '600', fontSize: windowWidth * (12 / 800), color: '#000000'}}>{store.playingChildId.name}</Text>
                </View>
                {(() => {
                    const avatarObj = store.avatars?.find(avatar => avatar.id === store.playingChildId?.avatar_id);
                    const avatarUrl = avatarObj ? avatarObj.image?.url : dog;
                    const isSvg = typeof avatarUrl === 'string' && avatarUrl.endsWith('.svg');

                    return isSvg ? (
                        <SvgUri 
                            uri={avatarUrl} 
                            width={windowHeight * (48 / 360)} 
                            height={windowHeight * (48 / 360)}
                        />
                    ) : (
                        <Image 
                            source={{ uri: avatarUrl }} 
                            style={{
                                width: windowHeight * (48 / 360), 
                                height: windowHeight * (48 / 360), 
                                resizeMode: 'contain'
                            }}
                        />
                    );
                })()}
            </TouchableOpacity>
        )
    }

export default Back;