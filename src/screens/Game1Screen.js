import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, useWindowDimensions, TouchableOpacity, Image, Platform, Vibration } from 'react-native';
import bg from '../images/bg.png'
import MicroAnimation from '../animations/MicroAnimation';
import api from '../api/api';
import TaskComponent from '../components/TaskComponent';
import store from '../store/store';
import useTimer from '../hooks/useTimer';
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation';
import { playSound } from '../hooks/usePlayBase64Audio';
import { playSoundWithoutStopping } from '../hooks/usePlayWithoutStoppingBackgrounds';
import speakingWisy from '../lotties/headv9.json';
import LottieView from 'lottie-react-native';

const Game1Screen = ({ data, setLevel, setStars, onCompleteTask, subCollectionId, isFromAttributes, setEarnedStars, introAudio, introText, introTaskIndex, level, tutorials, tutorialShow, setTutorialShow }) => {    

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [text, setText] = useState(data?.content?.question);
    const [attempt, setAttempt] = useState('1');
    const [image, setImage] = useState(1);
    const [thinking, setThinking] = useState(false);
    const [lock, setLock] = useState(false);
    
    const { getTime, start, stop, reset } = useTimer();

    const [wisySpeaking, setWisySpeaking] = useState(false)
    const lottieRef = useRef(null);

    const isActive = useRef(true);
    
    useEffect(() => {
        isActive.current = true;
    
        return () => {
            isActive.current = false;
        };
    }, []);
        
    useEffect(() => {
        if (wisySpeaking) {
            setTimeout(() => {
                lottieRef.current?.play(180, 0);
            }, 1);
        } else {
            setTimeout(() => {
                lottieRef.current?.reset();
            }, 1);
        }
    }, [wisySpeaking]);
                                
    const playVoice = async (sound) => {
            if (!isActive.current) return
            try {
                setWisySpeaking(true)
                await playSound(sound);
            } catch (error) {
                console.error("Ошибка при воспроизведении звука:", error);
            } finally {
                setText(null);
                setWisySpeaking(false);
                setLock(false);
            }
    };

    useEffect(() => {
        playSoundWithoutStopping.stop()
        playSound.stop()
        const introPlay = async() => {
            try {
                setLock(true)
                if (level === introTaskIndex && (!tutorialShow || tutorials == 0)) {
                    setWisySpeaking(true);
                    setText(introText);
                    await playSoundWithoutStopping(introAudio);
                }
            } catch (error) {
                console.log(error);
            } finally {
                try {
                    if ((data?.content?.question || data?.content?.speech) && (!tutorialShow || tutorials == 0)) {
                        setText(data?.content?.question)
                        setWisySpeaking(true);
                        await playSound.stop()
                        await playSound(data?.content?.speech);
                    }
                } catch (error) {
                    console.error("cОшибка при воспроизведении звука:", error);
                } finally {
                    setText(null);
                    setWisySpeaking(false);
                    setLock(false)
                }
            }
        }
    
        introPlay()

        return () => {
            playSound.stop()
            playSoundWithoutStopping.stop()
        }
        
    }, [data?.content?.speech, tutorialShow]);

    useEffect(() => {
        start();
        return () => {
            reset();
        };
    }, []);

    const vibrate = () => {
        Vibration.vibrate(500);
    };

    const lastAnswer = async(hint, stars, voice, old_stars) => {
        if (!isActive.current) return
        setImage(2)
        reset();
        if (isFromAttributes) {
            // store.loadCategories();
        } else {
            onCompleteTask(subCollectionId, data.next_task_id)
        }
        setStars(stars)
        setText(hint)

        try {
            setWisySpeaking(true)
            await playSound(voice)
        } catch (error) {
            console.log(error)
        } finally {
            setText(null);
            setWisySpeaking(false);
            setTimeout(() => {
                setStars(stars);
                setAttempt('1')
                setEarnedStars(stars - old_stars)
                setLevel(prev => prev + 1);
                setLock(false)
            }, 1500);
        }
    }

    const correctAnswer = async(hint, stars, voice, old_stars) => {
        if (!isActive.current) return
        reset();
        if (isFromAttributes) {
            // store.loadCategories();
        } else {
            onCompleteTask(subCollectionId, data.next_task_id)
        }
        setImage(2)
        setText(hint)

        try {
            setWisySpeaking(true)
            await playSound(voice)
        } catch (error) {
            console.log(error)
        } finally {
            setText(null);
            setWisySpeaking(false);
            setTimeout(() => {
                setStars(stars);
                setAttempt('1')
                setEarnedStars(stars - old_stars)
                setText(hint)
                setLevel(prev => prev + 1)
                setImage(1)
                setLock(false)
            }, 1500);
        }
    };

    const incorrectAnswer = async(hint, voice) => {
        if (!isActive.current) return
        start();
        setText(hint);
        playVoice(voice)
        setAttempt('2'); 
    };

    const incorrectAnswerToNext = async(hint, stars, voice, old_stars) => {
        if (!isActive.current) return
        reset();
        if (isFromAttributes) {
            // store.loadCategories();
        } else {
            onCompleteTask(subCollectionId, data.next_task_id)
        }
        vibrate()
        setText(hint)
        try {
            setWisySpeaking(true)
            await playSound(voice)
        } catch (error) {
            console.log(error)
        } finally {
            setText(null);
            setWisySpeaking(false);
            setTimeout(() => {
                setStars(stars);
                setAttempt('1')
                setEarnedStars(stars - old_stars)
                setText(hint)
                setLevel(prev => prev + 1)
                setImage(1)
                setLock(false)
            }, 1500);
        }
    };

    const sendAnswer = async(uri) => {
        try {
            if (!isActive.current) return
            const lead_time = getTime();
            stop();
            setThinking(true)
            setLock(true)
            const requestStatus = await api.answerTask(data.id, attempt, uri, `${store.playingChildId.id}`, store.token, lead_time, store.language)
            // console.log(requestStatus)
            return requestStatus    
        } catch (error) {
            setLock(false)
            setText(error)
        } finally {
            setThinking(false)
        }
    };

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - windowWidth * (60 / 800), height: windowHeight - 60, alignItems: 'center', justifyContent: 'center'}}>
            {tutorialShow && tutorials?.length > 0 && <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
                    <Game8Tutorial tutorials={tutorials}/>
                </View>}
            {data && (!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <TaskComponent image={image === 1? data.content?.placeholder_image?.url : data.content?.image?.url} successImage={image}/>}
                <View style={{width: windowWidth * (255 / 800), height: Platform.isPad? windowWidth * (150 / 800) : windowHeight * (90 / 360), alignItems: 'flex-end', flexDirection: 'row', position: 'absolute', left: 0, bottom: 0}}>
                    <LottieView
                        ref={lottieRef}
                        resizeMode="cover"
                        source={speakingWisy}
                        style={{
                            width: windowWidth * (64 / 800),
                            height: Platform.isPad ? windowWidth * (64 / 800) : windowHeight * (64 / 360),
                            aspectRatio: 64 / 64,
                        }}
                        autoPlay={false}
                        loop={true}
                    />
                    <Game3TextAnimation text={text} thinking={thinking}/>
                </View>
            {(!tutorialShow || tutorials?.length == 0 || isFromAttributes) && <View style={{position: 'absolute', bottom: 0, right: 0}}>
                {!lock && <MicroAnimation playVoice={playVoice} lastAnswer={lastAnswer} correctAnswer={correctAnswer} incorrectAnswer={incorrectAnswer} incorrectAnswerToNext={incorrectAnswerToNext} setText={setText} sendAnswer={sendAnswer} stop={stop}/>}
            </View>}                          
            {tutorialShow && tutorials?.length > 0 && <TouchableOpacity onPress={() => setTutorialShow(false)} style={{width: windowWidth * (58 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), backgroundColor: 'white', position: 'absolute', bottom: 0, right: 0, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : 12, color: '#504297'}}>
                    Skip
                </Text>
            </TouchableOpacity>} 
        </View>                                                                                                                                                                             
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  triangle: {
    width: 0,
    height: 0,
    borderRightWidth: 16,     // Ширина треугольника (основание)
    borderTopWidth: 8,        // Высота треугольника
    borderRightColor: 'transparent',
    borderTopColor: '#C4DF84',   // Цвет треугольника
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    position: 'absolute',
    bottom: -8,
    left: 0
  },
});

export default Game1Screen;

// import { useState, useRef } from 'react';
// import { View, StyleSheet, ImageBackground, Text, useWindowDimensions, TouchableOpacity, Image, Platform, Vibration } from 'react-native';
// import bg from '../images/bg.png'
// import narrowleft from '../images/narrowleft-purple.png'
// import wisy from '../images/pandaHead.png'
// import star from '../images/Star.png'
// import { useNavigation } from '@react-navigation/native';
// import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
// import Game1TextAnimation from '../animations/Game1/Game1TextAnimations';
// import MicroAnimation from '../animations/MicroAnimation';
// import api from '../api/api'
// import TaskComponent from '../components/TaskComponent';
// import store from '../store/store';

// const Game1Screen = () => {

//     const navigation = useNavigation();
//     const { height: windowHeight, width: windowWidth } = useWindowDimensions();

//     const [level, setLevel] = useState(0);
//     const [text, setText] = useState("Kā sauc attēlā redzamo dzīvnieku? Turi mikrofona pogu, lai ierunātu atbildi..");
//     const [attempt, setAttempt] = useState('1');
//     const [image, setImage] = useState(1);
//     const [thinking, setThinking] = useState(false);

//     const animatedProgress = useAnimatedStyle(() => {
//         return {
//             width: withTiming(level === 1 ? windowWidth * (8 / 800) : level === 2? windowWidth * (16 / 800) : level === 3? windowWidth * (24 / 800) : level === 4? windowWidth * (32 / 800) : level === 5? windowWidth * (40 / 800) : level === 6? windowWidth * (48 / 800) : level === 7? windowWidth * (56 / 800) : level === 8? windowWidth * (64 / 800) : level === 9? windowWidth * (72 / 800) : level === 10 && windowWidth * (80 / 800), {duration: 300})
//         }
//     });

//     const vibrate = () => {
//         Vibration.vibrate(500);
//     };

//     const correctAnswer = (hint) => {
//         setImage(2)
//         setText(hint)
//         setTimeout(() => {
//             setText("Kā sauc attēlā redzamo dzīvnieku? Turi mikrofona pogu, lai ierunātu atbildi..")
//             setAttempt('1')
//             setLevel(prev => prev + 1)
//             setImage(1)
//         }, 3000);
//     };

//     const incorrectAnswer = (hint, attempt) => {
//         setText(hint)
//         setAttempt(attempt) 
//     };

//     const incorrectAnswerToNext = (hint) => {
//         vibrate()
//         setText(hint)
//         setTimeout(() => {
//             setLevel(prev => prev + 1)
//             setImage(1)
//             setText("Kā sauc attēlā redzamo dzīvnieku? Turi mikrofona pogu, lai ierunātu atbildi..")
//             setAttempt('1')
//         }, 3000); 
//     };

//     const sendAnswer = async(uri) => {
//         try {
//             setThinking(true)
//             const requestStatus = await api.answerTask(data[level].id, attempt, uri, `${store.playingChildId.id}`)
//             return requestStatus    
//         } catch (error) {
//             console.log(error)   
//         } finally {
//             setThinking(false)
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <ImageBackground source={bg} style={{flex: 1, alignItems: 'center', padding: 30, paddingVertical: Platform.isPad? windowWidth * (40 / 800) : Platform.OS === 'ios'? 25 : 25, justifyContent: 'space-between'}}>
//                 <View style={{width: windowWidth * (730 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
//                     <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor: 'white', width: windowWidth * (85 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: windowWidth * (8 / 800)}}>
//                         <Image source={narrowleft} style={{width: 24, height: 24, aspectRatio: 24 / 24}}/>
//                         <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), lineHeight: windowHeight * (20 / 360), color: '#504297'}}>Exit</Text>
//                     </TouchableOpacity>
//                     <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
//                         <View style={{width: windowWidth * (100 / 800), height: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), backgroundColor: 'white', borderRadius: 100, alignItems: 'center', flexDirection: 'row', padding: 2}}>
//                             <Animated.View style={[animatedProgress, {height: Platform.isPad? windowWidth * (8 / 800) : windowHeight * (8 / 360), backgroundColor: '#504297', borderRadius: 100}]}/>
//                         </View>
//                         <Image source={star} style={{width: windowWidth * (28 / 800) , height: Platform.isPad? windowWidth * (28 / 800) : windowHeight * (28 / 360), aspectRatio: 28 / 28, position: 'absolute', alignSelf: 'center', right: -2, bottom: -3}}/>
//                     </View>
//                 </View>
//                 {data && data[level] && <TaskComponent image={image === 1? data[level].content.placeholder_image.url : data[level].content.image.url} successImage={image}/>}
//                 <View style={{width: windowWidth * (730 / 800), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
//                     <View style={{width: windowWidth * (255 / 800), height: Platform.isPad? windowWidth * (150 / 800) : windowHeight * (150 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
//                         <Image source={wisy} style={{width: windowWidth * (64 / 800), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), aspectRatio: 64 / 64}}/>
//                         <Game1TextAnimation text={text} thinking={thinking}/>
//                     </View>
//                     {!thinking && <MicroAnimation correctAnswer={correctAnswer} incorrectAnswer={incorrectAnswer} incorrectAnswerToNext={incorrectAnswerToNext} setText={setText} sendAnswer={sendAnswer} />}
//                 </View>
//             </ImageBackground>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'white',
//   },
//   triangle: {
//     width: 0,
//     height: 0,
//     borderRightWidth: 16,     // Ширина треугольника (основание)
//     borderTopWidth: 8,        // Высота треугольника
//     borderRightColor: 'transparent',
//     borderTopColor: '#C4DF84',   // Цвет треугольника
//     borderLeftWidth: 0,
//     borderBottomWidth: 0,
//     position: 'absolute',
//     bottom: -8,
//     left: 0
//   },
// });

// export default Game1Screen;