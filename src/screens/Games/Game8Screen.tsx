import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { captureRef } from 'react-native-view-shot';
import useTimer from '../../hooks/utils/useTimer';
import { useHandwrittenAnswerLogic } from '../../hooks/answer/useHandwrittenAnswerLogic';
import { useIntroSequence } from '../../hooks/useIntroSequence';
import TutorialOverlay from './components/TutorialOverlay'
import SkipButton from './components/SkipButton';
import store from '../../store/store';
import WisyHint from './components/WisyHint';
import OverlayHint from './components/OverlayHint';
import MainContainerBlock from './Game8/MainContainerBlock';
import { useScale } from '../../hooks/utils/useScale';
import { Ionicons } from '@expo/vector-icons';

const Game8Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow, labels }) => {

    const { s, vs } = useScale()

    const hint = data?.content?.hint_image;
    const hintDuration = data?.content?.hint_display_mode;

    const viewShotRef = useRef(null);
    
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);
    const [lock, setLock] = useState(true);
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const { start, reset } = useTimer();

    const saveAndShareImage = async () => {
        try {
            const uri = await captureRef(viewShotRef, {
                format: 'png',
                quality: 1,
            });
    
            const fileName = uri.split('/').pop();
            const fileType = 'image/png';
    
            const file = {
                uri,
                name: fileName,
                type: fileType,
            };
    
            return [{ image: file, index: 0 }];
        } catch (error) {
            console.error("Error saving and sharing image:", error);
            return [];
        }
    };

    const { answer, isActive } = useHandwrittenAnswerLogic({ data, subCollectionId, onCompleteTask, isFromAttributes, levelHandlers: { setLevel, setStars, setEarnedStars }, uiHandlers: { setText, setId, setLock, setWisySpeaking, setThinking }, attemptState: { attempt, setAttempt }, saveAndShareImage, setLines });

    const { clicked } = useIntroSequence({ data, tutorialShow, tutorials, introText, introAudio, level, introTaskIndex, setText, setWisySpeaking, setLock });
    
    useEffect(() => {
        isActive.current = true;
        start();
                      
        return () => {
            isActive.current = false;
            reset();
        };
    }, [])

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            
            {tutorialShow && tutorials?.length > 0 && (
                <TutorialOverlay tutorials={tutorials} />
            )}

            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && 
                <MainContainerBlock clicked={clicked} lock={lock} hint={hint} hintDuration={hintDuration} data={data} viewShotRef={viewShotRef} lines={lines} currentLine={currentLine} id={id} setCurrentLine={setCurrentLine} setLines={setLines} />
            }
            
            <OverlayHint visible={store.isBlacked}>
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            </OverlayHint>

            {!store?.isBlacked && (
                <WisyHint text={text} thinking={thinking} wisySpeaking={wisySpeaking} />
            )}

            <SkipButton visible={tutorialShow && tutorials?.length > 0} showPaw={store?.isFirstOpening}
                onSkip={() => {
                    if (store.isFirstOpening) {
                        store.setIsFirstOpening(false)
                    }
                    setTutorialShow(false)
                }}
            />
            
            {lines?.length != 0 &&
                        
                <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0, width: 'auto', height: 'auto', columnGap: s(5) }}>

                    <TouchableOpacity onPress={() => setLines([])} style={{ width: s(24), height: '100%', backgroundColor: '#B3ABDB', borderRadius: 100, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Ionicons name='reload-sharp' color={'white'} size={s(8)} />
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={lock? () => {return} : () => { answer(); setId(null) }} style={{ width: 'auto', height: 'auto', paddingHorizontal: s(18), paddingVertical: s(7), backgroundColor: '#FF69B4', borderRadius: 100, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: s(8), color: 'white', fontWeight: '600' }}>{labels?.send}</Text>
                    </TouchableOpacity>
    
                </View>    
            }

        </View>
    )
}

export default Game8Screen;