import { View, Text, Image, useWindowDimensions, Platform, TouchableOpacity, Vibration } from 'react-native'
import React, { useState } from 'react'
import Animated, { ZoomInEasyDown } from 'react-native-reanimated'
import Game3TextAnimation from '../animations/Game3/Game3TextAnimation'
import wisy from '../images/pandaHead.png'
import api from '../api/api'
import { playSound } from '../hooks/usePlayBase64Audio'
import store from '../store/store'
import galochka from '../images/galochka.png'
import x from '../images/wrongX.png'

const Game13Screen = ({ data, setLevel, setStars, subCollectionId, onCompleteTask }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState('');
    const [attempt, setAttempt] = useState('1');
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);

    const vibrate = () => {
        Vibration.vibrate(500);
    };

    const answer = async({ answer }) => {
        try {
            setId(null)
            setThinking(true)
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer})
            if (response && response.stars && response.success) {
                onCompleteTask(subCollectionId, data.next_task_id)
                setId({id: answer, result: 'correct'})
                setText(response?.hint)
                playSound(response?.sound)
                setTimeout(() => {
                    setStars(response.stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && response.stars && !response.success) {
                onCompleteTask(subCollectionId, data.next_task_id)
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response?.hint)
                playSound(response?.sound)
                setTimeout(() => {
                    setStars(response.stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && !response.success && !response.to_next) {
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)
                playSound(response.sound)
                setAttempt('2')
            } else if(response && response.success) {
                onCompleteTask(subCollectionId, data.next_task_id)
                setId({id: answer, result: 'correct'})
                setText(response.hint)
                playSound(response.sound)
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                }, 1500);
            } else if(response && !response.success && response.to_next) {
                onCompleteTask(subCollectionId, data.next_task_id)
                setId({id: answer, result: 'wrong'})
                vibrate()
                setText(response.hint)
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                }, 1500);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setThinking(false)
        }
    }

    const RenderGame13Component = () => {

        const options = [{num: '1'}, {num: '2'}, {num: '3'}];

        return (
            <View style={{width: windowWidth * (592 / 800), height: windowHeight * (160 / 360), flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{width: '100%', height: windowHeight * (40 / 360), justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#222222', fontWeight: '600', fontSize: windowWidth * (24 / 800)}}>{data.content.question}</Text>
                </View>
                <View style={{width: 'auto', gap: 16, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    {data && data.content.options && data.content.options.map((option, index) => {
                        return (
                            <TouchableOpacity onPress={() => answer({ answer: option.id })} key={index} style={{width: windowWidth * (80 / 800), height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), backgroundColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D4D' : id?.id == option.id && id?.result == 'wrong'? '#D816164D' : 'white', borderColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? '#D81616' : 'white', borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                                <Text style={{fontWeight: '600', fontSize: windowWidth * (24 / 800), color: 'black'}}>{option.text}</Text>
                                {id?.id == option?.id && <View style={{width: windowWidth * (16 / 800), height: windowHeight * (16 / 360), position: 'absolute', top: 5, right: 5, backgroundColor: id?.id == option.id && id?.result == 'correct'? '#ADD64D' : id?.id == option.id && id?.result == 'wrong'? '#D81616' : 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
                                    <Image source={id?.result == 'correct'? galochka : x} style={{width: windowWidth * (8 / 800), height: windowHeight * (8 / 360)}}/>
                                </View>}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }

    return (
        <Animated.View entering={ZoomInEasyDown} style={{top: 24, width: windowWidth - 60, height: windowHeight - 60, position: 'absolute', paddingTop: 50, flexDirection: 'row', justifyContent: 'center'}}>
            <RenderGame13Component />
            <View style={{width: windowWidth * (255 / 800), position: 'absolute', left: 0, bottom: 0, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), alignSelf: 'flex-end', alignItems: 'flex-end', flexDirection: 'row'}}>
                <Image source={wisy} style={{width: windowWidth * (64 / 800), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), aspectRatio: 64 / 64}}/>
                <Game3TextAnimation text={text} thinking={thinking}/>
            </View>
        </Animated.View>
    )
}

export default Game13Screen;