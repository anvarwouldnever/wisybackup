import { View, Image, FlatList, useWindowDimensions, TouchableOpacity, Platform } from 'react-native';
import React, { useRef, useState } from 'react';
import arrow from '../images/arrow-right.png';
import arrow1 from '../images/arrow-left.png';

const Game8Tutorial = ({ tutorials }) => {
    const { width, height } = useWindowDimensions();
    const data = tutorials ?? [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const renderItem = ({ item }) => {

        return (
            <Image source={{ uri: item?.url }} style={{ width: width * (430 / 800), height: height * (272 / 360), resizeMode: 'contain', backgroundColor: 'white' }} />
        )
    };

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
        }
    };

    return (
        <View style={{ height: '100%', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity
                activeOpacity={currentIndex === 0 ? 0 : 1}
                style={{
                    width: Platform.isPad ? width * (40 / 800) : height * (40 / 360),
                    height: Platform.isPad ? width * (40 / 800) : height * (40 / 360),
                    borderRadius: 100,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: currentIndex === 0 ? 0 : 1,
                }}
                onPress={handlePrevious}
            >
                <Image source={arrow1} style={{ width: width * (24 / 800), height: Platform.isPad ? width * (24 / 800) : height * (24 / 360) }} />
            </TouchableOpacity>

            <View
                style={{
                    width: width * (471 / 800),
                    height: width * (272 / 800),
                    backgroundColor: 'white',
                    alignItems: 'center',
                    padding: width * (20 / 800),
                    borderRadius: 16,
                    justifyContent: 'center'
                }}
            >
                <FlatList
                    ref={flatListRef}
                    data={data}
                    horizontal
                    contentContainerStyle={{ alignItems: 'center'}}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    pagingEnabled
                    snapToAlignment="center"
                    decelerationRate="fast"
                    snapToInterval={width * (464 / 800)}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                />
            </View>

            <TouchableOpacity
                activeOpacity={currentIndex === data.length - 1 ? 0 : 1}
                style={{
                    width: Platform.isPad ? width * (40 / 800) : height * (40 / 360),
                    height: Platform.isPad ? width * (40 / 800) : height * (40 / 360),
                    borderRadius: 100,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: currentIndex === data.length - 1 ? 0 : 1,
                }}
                onPress={handleNext}
            >
                <Image source={arrow} style={{ width: width * (24 / 800), height: Platform.isPad ? width * (24 / 800) : height * (24 / 360) }} />
            </TouchableOpacity>
        </View>
    );
};

export default Game8Tutorial;
