import { TouchableOpacity, Platform, View, Text, Image, useWindowDimensions } from "react-native";
import store from "../../store/store";
import { useNavigation } from "@react-navigation/native";
import dog from '../../images/Dog.png'
import { SvgUri } from "react-native-svg";
import { observer } from "mobx-react-lite";
import { gameStore } from "../Games/store/gameStore";
import { getAvatars } from "../ChildParams/hooks/getAvatars";
import { useScale } from "../../hooks/useScale";

const Back = () => {

        const navigation = useNavigation();
        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        const { s, vs } = useScale()

        const { avatars, error, loading } = getAvatars()

        const goBack = () => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'ChoosePlayerScreen' }],
            });
            gameStore.resetSubCollection()
        }
        

        return (
            <TouchableOpacity onPress={store.isFirstOpening ? () => {} : () => goBack()} style={{width: s(60), alignItems: 'center', flexDirection: 'row', height: s(24), position: 'absolute', left: windowWidth * (60 / 800), top: windowHeight * (20 / 360)}}>
                <View style={{width: windowWidth * (100 / 800), justifyContent: 'center', alignItems: 'center', position: 'absolute', alignSelf: 'center', right: 0, borderRadius: 100, height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: '#FFFFFF'}}>
                    <Text style={{fontWeight: '600', fontSize: windowWidth * (12 / 800), color: '#000000'}}>{store.playingChildId.name}</Text>
                </View>
                {(() => {
                    const avatarObj = avatars?.find(avatar => avatar.id === store.playingChildId?.avatar_id);
                    const avatarUrl = avatarObj ? avatarObj.image?.url : dog;
                    const isSvg = typeof avatarUrl === 'string' && avatarUrl.endsWith('.svg');

                    return isSvg ? (
                        <SvgUri
                            uri={avatarUrl} 
                            width={s(24)}
                            height={s(24)}
                        />
                    ) : (
                        <Image 
                            source={{ uri: avatarUrl }} 
                            style={{
                                width: s(24), 
                                height: s(24), 
                                resizeMode: 'contain'
                            }}
                        />
                    );
                })()}
            </TouchableOpacity>
        )
    }

export default observer(Back);