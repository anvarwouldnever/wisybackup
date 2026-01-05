import { TouchableOpacity, View, Image, Text } from "react-native"
import store from "../../store/store";
import { SvgUri } from "react-native-svg";
import { observer } from "mobx-react-lite";
import translations from "../../../localization";
import Animated from "react-native-reanimated";
import { getChildren } from "../ChoosePlayer/hooks/getChildren";
import { getAvatars } from "../CreateChild/hooks/getAvatars";
import { useScale } from "../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";
import { calculateAge } from "./utils/calculateAge";
import { calculateAvatar } from "./utils/calculateAvatar";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const Child = ({ setDropDown, dropDown }) => {

    const { children } = getChildren()
    const { avatars } = getAvatars()

    const { s, vs } = useScale()

    const completedSubs = children?.find(child => child.id === store.playingChildId?.id)?.completed_sub_collections;

    const { avatarUrl, isSvg } = calculateAvatar(avatars, store.playingChildId?.avatar_id);

    return (
        <AnimatedTouchableOpacity activeOpacity={1} onPress={() => setDropDown(prev => !prev)} style={{ height: 'auto', width: '100%', borderRadius: vs(12), justifyContent: 'space-between', backgroundColor: '#F8F8F8', flexDirection: 'row', padding: vs(16), alignItems: 'center' }}>
           
            <View style={{ columnGap: vs(15), flexDirection: 'row' }}>

                <View style={{ width: vs(48), height: vs(48), justifyContent: 'center', alignItems: 'center' }}>
                    {isSvg ? 
                        <SvgUri uri={avatarUrl} width={'100%'} height={'100%'} />
                    :
                        <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    }
                </View>
                    
                    
                <View style={{width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', rowGap: vs(10) }}>
                        
                    <View style={{width: 'auto', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: vs(5)}}>
                        
                        <Text style={{fontWeight: '600', color: '#000000', fontSize: vs(12) }}>{store.playingChildId.name}</Text>
                        
                        <Text style={{color: '#555555', fontWeight: '400', fontSize: vs(12) }}>/ {translations?.[store.language].age} {calculateAge(store.playingChildId?.birthday)}</Text>
                    
                    </View>

                    <View style={{width: 'auto', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: vs(5) }}>
                        
                        <Text style={{fontWeight: '600', color: '#222222', fontSize: vs(12) }}>{completedSubs}</Text>
                        
                        <Text style={{fontWeight: '400', fontSize: vs(12), color: '#555555' }}>{translations?.[store.language].completedTasks}</Text>
                    
                    </View>

                </View>

            </View>
                
            <Ionicons name='chevron-down' size={vs(24)} />

        </AnimatedTouchableOpacity>
    )
}

export default observer(Child);