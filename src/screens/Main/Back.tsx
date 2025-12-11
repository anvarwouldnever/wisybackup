import { TouchableOpacity, View, Text, Image } from "react-native";
import store from "../../store/store";
import { useNavigation } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { observer } from "mobx-react-lite";
import { gameStore } from "../Games/store/gameStore";
import { getAvatars } from "../ChildParams/hooks/getAvatars";
import { useScale } from "../../hooks/utils/useScale";

const Back = () => {

    const navigation = useNavigation();

    const { s, vs } = useScale()

    const { avatars, error, loading } = getAvatars()

    const goBack = () => {
        if (store.isFirstOpening) return; 
        navigation.reset({
            index: 0,
            routes: [{ name: 'ChoosePlayerScreen' }],
        });
        gameStore.resetSubCollection()
    }    
       
    return (
        <TouchableOpacity onPress={() => goBack()} style={{width: 'auto', height: s(26), alignItems: 'center', alignSelf: 'center', justifyContent: 'center', flexDirection: 'row'}}>
            
            <View style={{width: s(65), justifyContent: 'center', alignItems: 'center', borderRadius: 100, height: s(20), backgroundColor: '#FFFFFF'}}>
                <Text ellipsizeMode='tail' style={{fontWeight: '600', fontSize: s(7), color: '#000000', marginLeft: s(15), width: '50%', textAlign: 'center'}}>{store?.playingChildId?.name}</Text>
            </View>

            {(() => {
                const avatarObj = avatars?.find(avatar => avatar?.id === store.playingChildId?.avatar_id);    
                const avatarUrl = avatarObj.image?.url
                const isSvg = typeof avatarUrl === 'string' && avatarUrl.endsWith('.svg');

                return isSvg ? (
                    <SvgUri
                        uri={avatarUrl} 
                        width={s(24)}
                        height={s(24)}
                        style={{ position: 'absolute', left: 0 }}
                    />
                ) : (
                    <Image 
                        source={{ uri: avatarUrl }} 
                        style={{
                            width: s(24), 
                            height: s(24), 
                            resizeMode: 'contain',
                            position: 'absolute', 
                            left: 0
                        }}
                    />
                );
            })()}

        </TouchableOpacity>
    )
}

export default observer(Back);