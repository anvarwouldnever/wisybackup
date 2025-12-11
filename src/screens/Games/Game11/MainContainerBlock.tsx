import { View, Text, TouchableOpacity, PanResponder, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Svg, { SvgUri, Polyline } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'
import { useScale } from '../../../hooks/utils/useScale'

const MainContainerBlock = ({ setCurrentLine, setLines, currentLine, data, word, lines, viewShotRef, audio, voiceForTask, lock, id, hint, hintDuration, clicked }) => {

    const { s, vs } = useScale()

    const [showHint, setShowHint] = useState(false);

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

    return (
        <Animated.View entering={ZoomInEasyDown} style={{ width: 'auto', height: 'auto', alignItems: 'center', flexDirection: 'column', rowGap: s(12)}}>
            
            <View style={{ width: 'auto', height: 'auto', backgroundColor: '#FFFFFF', borderRadius: s(5), padding: s(10), columnGap: s(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
            
                <View style={{ width: s(40), height: s(40), justifyContent: 'center', alignItems: 'center' }}>
                    {data?.content?.image.endsWith(".svg") ? 
                        <SvgUri uri={data?.content?.image} width={'100%'} height={'100%'} /> 
                    : 
                        <Image source={{ uri: data?.content?.image }} style={{width: '100%', height: '100%'}}/>
                    }
                </View>

                {audio && 
                    <TouchableOpacity onPress={lock? () => {} : () => voiceForTask(audio)} style={{width: s(35), height: s(35), padding: s(7), borderRadius: 100, backgroundColor: '#B3ABDB', borderColor: '#DFD0EE', borderWidth: 4, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={require('../../../images/speaker2.png')} style={{width: '100%', height: '100%'}}/> 
                    </TouchableOpacity>
                }

            </View>
            
            <View style={{ flexDirection: 'row', columnGap: s(5) }}>
                {word?.map((letter, index) => {
                    const isUnknown = letter === '*';

                    return (
                        <View key={index} style={{ width: s(40), height: s(40), borderWidth: isUnknown ? 0 : 2, borderColor: 'white', backgroundColor: 'white', justifyContent: 'center', borderRadius: s(3), alignItems: 'center', shadowColor: "#D0D0D0", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 4}}>
                            
                            {isUnknown ? (
                                <ViewShot ref={viewShotRef} style={{ backgroundColor: 'white', borderRadius: 10, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} options={{ format: 'png', quality: 1 }}>  
                                    
                                        <View {...panResponder.panHandlers} style={{ borderWidth: 2, backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : '#504297', borderRadius: s(3), width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                            
                                            <Svg height='100%' width='100%' >
                                                
                                                {lines?.map((line, index) => (
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

                                                {showHint && 
                                                    <View pointerEvents='none' style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: -100 }}>
                                                        {hint?.endsWith('.svg') ? (
                                                            <SvgUri uri={hint} width={s(24)} height={s(24)} />
                                                        ) : (
                                                            <Image source={{ uri: hint }} style={{ width: s(24), height: s(24) }} />
                                                        )}
                                                    </View>
                                                }

                                            </Svg>

                                        </View>
                                    

                                </ViewShot>
                            ) : (
                                <Text style={{ fontSize: s(24), fontWeight: '600', textAlign: 'center', color: '#504297' }}>{letter}</Text>
                            )}

                        </View>
                    );
                })}
            </View>

        </Animated.View>
    )
}

export default MainContainerBlock