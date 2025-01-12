import { View, Image, Platform, useWindowDimensions, Vibration } from 'react-native'
import React, { useState } from 'react'
import wisy from '../images/pandaHead.png'
import Game4TextAnimation from '../animations/Game4/Game4TextAnimation'
import Game5AnimalsAnimation from '../animations/Game5/Game5AnimalsAnimation'
import store from '../store/store'
import api from '../api/api'
import { playSound } from '../hooks/usePlayBase64Audio'
import Game2Text1Animation from '../animations/Game2/Game2Text1Animation'

const Game5Screen = ({ data, setLevel, setStars }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [text, setText] = useState(data.content.wisy_question)
    const [attempt, setAttempt] = useState('1')
    const [thinking, setThinking] = useState(false);
    const [id, setId] = useState(null);

    const vibrate = () => {
                        Vibration.vibrate(500);
                    };

    const answer = async({ answer }) => {
        try {
            setThinking(true)
            const response = await api.answerTaskSC({task_id: data.id, attempt: attempt, child_id: store.playingChildId.id, answer: answer})
            if (response && response.stars && response.success) {
                setText(response?.hint)
                playSound(response?.sound)
                setId(answer)
                setTimeout(() => {
                    setStars(response.stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && response.stars && !response.success) {
                vibrate()
                setText(response?.hint)
                playSound(response?.sound)
                setId(answer)
                setTimeout(() => {
                    setStars(response.stars)
                    setLevel(prev => prev + 1);
                }, 1500);
            }
            else if (response && !response.success && !response.to_next) {
                vibrate()
                setText(response.hint)
                playSound(response.sound)
                setAttempt('2')
            } else if(response && response.success) {
                setText(response.hint)
                playSound(response.sound)
                setId(answer)
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setAttempt('1');
                }, 1500);
            } else if(response && !response.success && response.to_next) {
                vibrate()
                setId(answer)
                setLevel(prev => prev + 1);
                setText(response.hint? response.hint : '')
                setAttempt('1')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setThinking(false)
        }
    }

    return (
        <View style={{position: 'absolute', top: 24, width: windowWidth - 60, height: windowHeight - 60, justifyContent: 'center'}}>
            {data && <Game5AnimalsAnimation id={id} thinking={thinking} answer={answer} animal={data.content.question_image} images={data.content.images}/>}
            <View style={{width: 'auto', height: Platform.isPad? windowWidth * (150 / 800) : 'auto', alignSelf: 'center', alignItems: 'flex-end', flexDirection: 'row', position: 'absolute', bottom: 0, left: 0,}}>
                <Image source={wisy} style={{width: windowWidth * (64 / 800), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), aspectRatio: 64 / 64}}/>
                <View style={{marginBottom: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (70 / 800)}}>
                    <Game2Text1Animation text={text} thinking={thinking}/>
                </View>
            </View>
        </View>
    )
}

export default Game5Screen;