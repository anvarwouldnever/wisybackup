import { View, Text, FlatList, PanResponder, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import  Animated, { ZoomInEasyDown } from 'react-native-reanimated';
import Svg, { SvgUri, Polyline } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import { useScale } from '../../../hooks/utils/useScale';

const MainContentBlock = ({ setCurrentLine, setLines, images, currentLine, lines, data, id, viewShotRef, lock, hint, hintDuration, clicked }) => {

    const { s, vs } = useScale()

    const [showHint, setShowHint] = useState<boolean>(false);
    
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            if (lock) return;
            clicked()
            if (showHint) {
                setShowHint(false)
            }
            const { locationX, locationY } = evt.nativeEvent;
            setCurrentLine([`${locationX},${locationY}`]);
        },
        onPanResponderMove: (evt) => {
            if (lock) return;
            const { locationX, locationY } = evt.nativeEvent;
            setCurrentLine((prev) => [...prev, `${locationX},${locationY}`]);
        },
        onPanResponderRelease: () => {
            if (lock) return;
            setLines((prev) => [...prev, currentLine]);
            setCurrentLine([]);
        },
    });

    useEffect(() => {
        if (lock) return
        if (hintDuration === 'temporary') {
            setShowHint(true);
            const timer = setTimeout(() => {
                setShowHint(false);
            }, 1000); 
            return () => clearTimeout(timer);
        } else if (hintDuration === 'none') {
            setShowHint(false);
        } else if (hintDuration === 'permanent') {
            setShowHint(true);
        }
    }, [hintDuration, lock]);

    const renderItem = ({ item }) => {
        const isSvg = item?.url.endsWith('.svg');
    
        return isSvg ? (
            <SvgUri 
                uri={item.url} 
                width={s(30)} 
                height={s(30)} 
                style={{borderRadius: 10}}
            />
        ) : (
            <Image 
                source={{ uri: item?.url }} 
                style={{ 
                    width: s(30), 
                    height: s(30),
                    borderRadius: 10
                }} 
                resizeMode="contain" 
            />
        );
    };

    return (
        <Animated.View entering={ZoomInEasyDown} style={{alignItems: 'center', width: 'auto', height: 'auto', flexDirection: 'column', rowGap: s(12)}}>
            
            <View style={{width: 'auto', height: s(37), alignItems: 'center', borderRadius: 10, overflow: 'hidden', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                <FlatList 
                    data={images}
                    renderItem={renderItem}
                    contentContainerStyle={{backgroundColor: 'white', alignItems: 'center', borderRadius: 10, columnGap: s(5), paddingHorizontal: s(3)}}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    scrollEnabled={false }
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: 'auto', height: 'auto', columnGap: s(7)}}>
                
                <View style={{width: s(50), height: s(50), padding: s(3), backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                    {data?.content?.question_image.endsWith('.svg') ? (
                        <SvgUri uri={data?.content?.question_image} width={'100%'} height={'100%'} />
                    ) : (
                        <Image source={{ uri: data?.content?.question_image }} style={{ width: '100%', height: '100%', resizeMode: 'contain'}} />
                    )}
                </View>

                <Text style={{fontSize: s(20), fontWeight: '600', color: '#504297'}}>=</Text>
                
                <ViewShot ref={viewShotRef} style={{backgroundColor: 'white', borderRadius: 10, width: s(50), height: s(50)}} options={{ format: 'png', quality: 1 }}>
                   
                   <View {...panResponder.panHandlers} style={{width: '100%', height: '100%', backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                        
                        <Svg height='100%' width='100%'>
                            {
                            lines?.map((line, index) => (
                                <Polyline
                                    key={index}
                                    points={line.join(' ')}
                                    stroke="#504297"
                                    strokeWidth="3"
                                    fill="none"
                                />
                            ))}
                            
                            <Polyline
                                points={currentLine.join(' ')}
                                stroke="#504297"
                                strokeWidth="3"
                                fill="none"
                            />
                        </Svg>

                        {showHint && 
                            <View pointerEvents='none' style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: -100, position: 'absolute' }}>
                                {hint?.endsWith('.svg') ? (
                                    <SvgUri uri={hint} width={s(24)} height={s(24)} />
                                ) : (
                                    <Image source={{ uri: hint }} style={{ width: s(45), height: s(45), resizeMode: 'contain' }} />
                                )}
                            </View>
                        }

                    </View>

                </ViewShot>

            </View>
        
        </Animated.View>
    )
}

export default MainContentBlock