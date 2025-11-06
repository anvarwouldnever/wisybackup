import { View, Text, Image, PanResponder } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Svg, { SvgUri, Polyline } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'
import { useScale } from '../../../hooks/utils/useScale'

const MainContainerBlock = ({ data, viewShotRef, lines, currentLine, id, setCurrentLine, setLines, hint, hintDuration, lock }) => {

    const { s, vs } = useScale()

const [showHint, setShowHint] = useState<boolean>(false);
    
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            if (lock) return;
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
        <Animated.View entering={ZoomInEasyDown} style={{width: 'auto', height: 'auto', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', columnGap: s(10)}}>
                    
            <View style={{borderRadius: 10, width: s(65), height: s(65), backgroundColor: 'white', padding: s(3), shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                
                {data?.content?.first_image?.endsWith(".svg") ? 
                    <SvgUri uri={data?.content?.first_image} width={'100%'} height={'100%'} style={{borderRadius: 10}}/>
                : 
                    <Image source={{uri: data?.content?.first_image }} style={{width: '100%', height: '100%', borderRadius: 10}}/>
                }

            </View>
            
            <Text style={{fontSize: s(30), fontWeight: '600', color: '#555555' }}>{data?.content?.operation === 'addition'? '+' : ''}</Text>
            
            <View style={{borderRadius: 10, shadowColor: "#D0D0D0", width: s(65), height: s(65), backgroundColor: 'white', padding: s(3), shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>

                {data?.content?.second_image?.endsWith(".svg") ?
                    <SvgUri uri={data?.content?.second_image} width={'100%'} height={'100%'} style={{borderRadius: 10}}/> 
                : 
                    <Image source={{uri: data?.content?.second_image }} style={{width: '100%', height: '100%', borderRadius: 10}}/>
                }

            </View>

            <Text style={{fontSize: s(30), fontWeight: '600', color: '#555555'}}>=</Text>

            <ViewShot ref={viewShotRef} style={{borderRadius: 10, width: s(65), height: s(65), backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}} options={{ format: 'png', quality: 1 }}>  
                
                <View {...panResponder.panHandlers} style={{backgroundColor: id?.id == data?.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data?.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: '100%', height: '100%', borderRadius: 10}}>
                    
                    <Svg height='100%' width='100%'>
                        
                        {lines.map((line, index) => (
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
                            <Image source={{ uri: hint }} style={{ width: s(65), height: s(65) }} />
                        </View>
                    }

                </View>

            </ViewShot>
            
        </Animated.View>
    )
}

export default MainContainerBlock