import { View, Text, PanResponder, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Svg, { Polyline, SvgUri } from 'react-native-svg'
import ViewShot from 'react-native-view-shot'
import { useScale } from '../../../hooks/utils/useScale'

const MainContainerBlock = ({ viewShotRef, lines, currentLine, id, data, setCurrentLine, setLines, lock, hint, hintDuration, letter, clicked }) => {

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
                 

    return (
        <Animated.View entering={ZoomInEasyDown} style={{width: 'auto', height: 'auto', alignItems: 'center', flexDirection: 'row', columnGap: s(15)  }}>
            
            <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: s(85), height: s(85), borderRadius: vs(16), shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}}>
                
                <Text style={{fontSize: s(45), color: "#504297", fontWeight: '600', textAlign: 'center'}}>{letter}</Text>
            
            </View>
            
            <ViewShot ref={viewShotRef} style={{backgroundColor: 'white', borderRadius: vs(16), shadowColor: "#D0D0D0", width: s(85), height: s(85), shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4 }} options={{ format: 'png', quality: 1 }}>  
                
                <View {...panResponder.panHandlers} style={{ backgroundColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == data.id && id?.result == 'wrong'? '#D816164D' : 'white', borderWidth: 2, borderColor: id?.id == data.id && id?.result == 'correct'? '#ADD64D' : id?.id == data.id && id?.result == 'wrong'? '#D81616' : 'white', width: '100%', height: '100%', borderRadius: vs(16), justifyContent: 'center', alignItems: 'center'}}>
                    
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
                            {hint?.endsWith('.svg') ? (
                                <SvgUri uri={hint} width={s(24)} height={s(24)} />
                            ) : (
                                <Image source={{ uri: hint }} style={{ width: s(80), height: s(80), resizeMode: 'contain' }} />
                            )}
                        </View>
                    }

                </View>

            </ViewShot>

        </Animated.View>
    )
}

export default MainContainerBlock;