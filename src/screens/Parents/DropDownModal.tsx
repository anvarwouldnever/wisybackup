import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import store from "../../store/store";
import Modal from 'react-native-modal'
import { SvgUri } from "react-native-svg";
import translations from "../../../localization";
import { getChildren } from "../ChoosePlayer/hooks/getChildren";
import { getAvatars } from "../ChildParams/hooks/getAvatars";
import { useScale } from '../../hooks/useScale';
import Ionicons from "@expo/vector-icons/Ionicons";
import { calculateAge } from "./utils/calculateAge";
import { calculateAvatar } from "./utils/calculateAvatar";

const DropDownModal = ({ setDropDown, dropDown }) => {

    const { children } = getChildren()
    const { avatars } = getAvatars()

    const { s, vs, isTablet } = useScale()

    const renderChild = ({ item, index }) => {
    
        const { avatarUrl, isSvg } = calculateAvatar(avatars, item?.avatar_id);
    
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => { if (index !== 0) store.setPlayingChildId(item); setDropDown(false) }}  style={{ height: 'auto', width: '100%', justifyContent: 'space-between', backgroundColor: '#F8F8F8', flexDirection: 'row', padding: vs(16), alignItems: 'center' }}>
       
                <View style={{ columnGap: vs(16), flexDirection: 'row' }}>
    
                    <View style={{ width: vs(48), height: vs(48), justifyContent: 'center', alignItems: 'center' }}>
                        {isSvg ? 
                            <SvgUri uri={avatarUrl} width={'100%'} height={'100%'} />
                        :
                            <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                        }
                    </View>
                        
                        
                    <View style={{width: 'auto', height: 'auto', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', rowGap: vs(10) }}>
                            
                        <View style={{width: 'auto', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: vs(5)}}>
                            
                            <Text style={{fontWeight: '600', color: '#000000', fontSize: vs(12) }}>{item.name}</Text>
                            
                            <Text style={{color: '#555555', fontWeight: '400', fontSize: vs(12) }}>/ {translations?.[store.language].age} {calculateAge(item?.birthday)}</Text>
                        
                        </View>
    
                        <View style={{width: 'auto', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: vs(5) }}>
                            
                            <Text style={{fontWeight: '600', color: '#222222', fontSize: vs(12) }}>{item.completed_sub_collections}</Text>
                            
                            <Text style={{fontWeight: '400', fontSize: vs(12), color: '#555555' }}>{translations?.[store.language].completedTasks}</Text>
                        
                        </View>
    
                    </View>
    
                </View>
                    
                {index == 0 && 
                    <Ionicons name='chevron-up' size={vs(24)} />
                }
    
            </TouchableOpacity>
        );
    }

    return (
        <Modal backdropColor="black" backdropOpacity={0.1} hasBackdrop={true} onBackdropPress={() => setDropDown(prev => !prev)} style={{ height: 'auto', alignSelf: 'center', width: '100%', paddingHorizontal: vs(20), justifyContent: 'flex-start' }} isVisible={dropDown} animationOutTiming={1} animationInTiming={1}>
            <FlatList 
                showsVerticalScrollIndicator={false}
                data={children.slice().sort((a, b) => {
                    if (a?.id === store.playingChildId?.id) return -1;
                    if (b?.id === store.playingChildId?.id) return 1;
                    return 0;
                })}
                renderItem={renderChild}
                scrollEnabled={children.length >= 3? true : false}
                keyExtractor={(item) => item?.id.toString()}
                contentContainerStyle={{ backgroundColor: 'transparent' }}
                style={{ height: vs(240), flexGrow: 0, marginTop: isTablet ? vs(30) : vs(75), borderRadius: vs(12), backgroundColor: 'white' }}
                initialNumToRender={3}
                updateCellsBatchingPeriod={30}
                windowSize={5}
                bounces={false}
            />
        </Modal>
    )
}

export default DropDownModal;