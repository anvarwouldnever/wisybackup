import { View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import AnimatedPaw from '../../../components/AnimatedPaw';
import store from '../../../store/store';
import { useScale } from '../../../hooks/useScale';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tutorial = ({ tutorials }) => {

    const data = tutorials ?? [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const { s } = useScale();

    const ITEM_WIDTH = s(190); // 👈 фиксированная ширина
    const ITEM_SPACING = ITEM_WIDTH / 9; // padding/отступ
    const FULL_ITEM_WIDTH = ITEM_WIDTH; // если нет margin — оставь ITEM_WIDTH

    const renderItem = ({ item }) => {
        return <Image source={{ uri: item?.url }} style={{ width: ITEM_WIDTH - ITEM_SPACING, height: s(130), resizeMode: 'contain', backgroundColor: 'white' }} />
    };

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            flatListRef.current?.scrollToIndex({
                index: prevIndex,
                animated: true,
            });
        }
    };

    const getItemLayout = (_, index) => ({
        length: FULL_ITEM_WIDTH,
        offset: FULL_ITEM_WIDTH * index,
        index,
    });

    return (
        <View style={{ height: '100%', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(20) }}>
           
            <TouchableOpacity onPress={() => handlePrevious()} activeOpacity={currentIndex === 0 ? 0 : 1} style={{ width: s(20), height: s(20), borderRadius: 100, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', opacity: currentIndex === 0 ? 0 : 1 }}>

                <Ionicons name='arrow-back' color={'#504297'} size={s(10)} />
            
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                getItemLayout={getItemLayout} // 👈 обязательно
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                snapToInterval={FULL_ITEM_WIDTH}
                style={{ width: ITEM_WIDTH, height: s(115), backgroundColor: 'white', borderRadius: s(6), flexGrow: 0 }}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', columnGap: ITEM_SPACING, padding: ITEM_SPACING / 2 }}
            />

            <TouchableOpacity onPress={() => handleNext()} activeOpacity={currentIndex === data.length - 1 ? 0 : 1} style={{ width: s(20), height: s(20), borderRadius: 100, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', opacity: currentIndex === data?.length - 1 ? 0 : 1 }}>
                
                <Ionicons name='arrow-forward' color={'#504297'} size={s(10)} />
                
                { store.isFirstOpening && 
                    <AnimatedPaw />
                }

            </TouchableOpacity>

        </View>
    );
};

export default Tutorial;
