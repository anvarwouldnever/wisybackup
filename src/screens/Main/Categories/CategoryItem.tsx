import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useScale } from '../../../hooks/utils/useScale';
import { gameStore } from '../../Games/store/gameStore';
import store from '../../../store/store';
import Blur from '../GamesList/SubCollections/BlurView';
import { observer } from 'mobx-react-lite';

const CategoryItem = ({ item, onPress, index }) => {
    
    const { s } = useScale();
    
    const isSvg = item?.image?.url?.endsWith('.svg');

    return (
        <TouchableOpacity onPress={() => onPress(item)} style={{ alignItems: 'center', padding: s(3), justifyContent: 'center', borderTopLeftRadius: 100, borderTopRightRadius: 100, backgroundColor: gameStore.categoryId === item?.id? 'white' : '#F8F8F833', overflow: 'hidden'}}>
            
            {isSvg?
                <View style={{ width: s(24), height: s(24) }}>
                    <SvgUri width={'100%'} height={'100%'} uri={item?.image?.url} style={{backgroundColor: '#F8F8F833', borderRadius: 100}}/> 
                </View>
            :
                <Image source={{ uri: item?.image?.url }} style={{ width: s(24), height: s(24), backgroundColor: '#F8F8F833', borderRadius: 100 }}/>
            }
            
            {index != 0 && store?.isFirstOpening && <Blur forMarket={true} isLocked={true} height={s(24)} width={s(24)} borderRadius={100} />}
        
        </TouchableOpacity>
    );
};

export default observer(CategoryItem);
