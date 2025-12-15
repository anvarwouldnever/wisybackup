import store from '../../store/store'
import { FlatList, TouchableOpacity, View, Text, Image } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { getAvatars } from '../ChildParams/hooks/getAvatars';
import { useScale } from '../../hooks/utils/useScale';
import Ionicons from '@expo/vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import translations from '../../../localization';
import * as ScreenOrientation from "expo-screen-orientation";
import { useMemo } from 'react';

function Children({ setChosenPlayerIndex, chosenPlayerIndex, setChosenPlayer, children, loading, setIsFrozen }) {
    
    const navigation = useNavigation();

    const { s, vs, isTablet } = useScale()

    const ITEM_WIDTH = s(46) + vs(30);

    const { avatars } = getAvatars()

    const onPress = (item, isNew) => {
        setChosenPlayerIndex(item?.id);
        setChosenPlayer(item);
        if (isNew) {
            store.setIsFirstOpening(true)
            store.setIsBlacked(true)
        } else {
            store.setIsFirstOpening(false)
            store.setIsBlacked(false)
        }
    }

    const avatarsMap = useMemo(() => {
        const map = new Map();
        avatars?.forEach(a => map.set(a.id, a));
        return map;
    }, [avatars]);

    const onAddChild = async() => {
        setIsFrozen(true)
            
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setTimeout(() => {
            navigation.navigate('ChildParamsScreen')
        }, 100);
    }

    const renderItem = ({ item }) => {
        
        if (item?.isAddButton) {
            return (
                <View style={{ alignItems: 'center', rowGap: vs(20) }}>

                    <TouchableOpacity onPress={() => onAddChild()} style={{ width: s(46), height: s(46), justifyContent: 'center', flexDirection: 'column', alignItems: 'center', borderRadius: 100, backgroundColor: 'white', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2}}>
                        <Ionicons name='add' size={s(22)} color={'#504297'} />
                    </TouchableOpacity>

                    <Text style={{ color: '#504297', fontSize: vs(22), fontWeight: '600'}}>
                        {translations?.[store.language]?.addNewUser}
                    </Text>

                </View>
            );
        }

        const avatarObj = avatarsMap.get(item?.avatar_id);
        const avatarImage = avatarObj?.image
        const avatarUrl = typeof avatarImage === 'string' ? avatarImage : avatarImage?.url; 
        const isSvg = avatarUrl?.endsWith('.svg');

        const isNew = store?.newChildren?.includes(item?.id) 

        return (
            <View style={{ alignItems: 'center', rowGap: vs(20)}}>
                
                <TouchableOpacity activeOpacity={1} onPress={() => onPress(item, isNew)} style={{ alignItems: 'center', justifyContent: 'center'}}>
                    
                    {isSvg ? (
                        <View style={{ width: s(46), height: s(46), borderRadius: 100, overflow: 'hidden', borderWidth: 3, borderColor: chosenPlayerIndex === item?.id ? '#504297' : '#F4E3F1' }}>
                            <SvgUri uri={avatarUrl} width="100%" height="100%" />
                        </View>
                    ) : (
                        <Image source={{ uri: avatarUrl }} style={{ borderWidth: 2, borderColor: 'white', borderRadius: 100, width: s(46), height: s(46)}}/>
                    )}

                </TouchableOpacity>

                <Text style={{ color: '#504297', fontSize: vs(22), fontWeight: '600', textAlign: 'center'}}>
                    {item?.name}
                </Text>

            </View>
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, width: '100%', height: '100%' }}>
                <LottieView
                    loop={true}
                    autoPlay
                    source={require('../../../assets/loading.json')}
                    style={{width: s(30), height: s(30), alignSelf: 'center'}}
                />
            </View>
        );
    }

    return (
        <FlatList
            data={[...(children || []), { id: 'add-btn', isAddButton: true }]}
            keyExtractor={(item) => item?.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: 'auto' }}
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', columnGap: vs(30), paddingHorizontal: vs(170) }}
            renderItem={renderItem}
            getItemLayout={(_, index) => ({
                length: ITEM_WIDTH,
                offset: ITEM_WIDTH * index,
                index,
            })}
            initialNumToRender={8}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews
            updateCellsBatchingPeriod={50}
        />
    );
}

export default observer(Children);
