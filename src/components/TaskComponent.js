import React, { useState, useEffect } from "react";
import { View, useWindowDimensions, Platform, Image } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import passedimg from '../images/gamepassed.png';
import api from '../api/api'
import { SvgUri } from "react-native-svg";

const TaskComponent = ({ image, successImage }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [imageKey, setImageKey] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setImageKey(prevKey => prevKey + 1);
        setImageLoaded(false);
    }, [image]);

    return (
        <View style={{backgroundColor: 'white', borderRadius: 10, width: windowWidth * (188 / 800),
            height: Platform.isPad ? windowWidth * (188 / 800) : windowHeight * (188 / 360), position: 'absolute',}}>
        <View style={{
            width: windowWidth * (188 / 800),
            height: Platform.isPad ? windowWidth * (188 / 800) : windowHeight * (188 / 360),
            backgroundColor: successImage === 2 && imageLoaded ? '#ADD64D4D' : 'white',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: successImage === 2 && imageLoaded ? '#ADD64D' : 'white',
            padding: 24,
            position: 'absolute',
            shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4
        }}>
            {imageLoaded ? (
                <Animated.Image
                    key={imageKey}
                    entering={FadeInRight.duration(500)}
                    source={{ uri: image }}
                    style={{
                        width: windowWidth * (140 / 800),
                        height: Platform.isPad ? windowWidth * (140 / 800) : windowHeight * (140 / 360)
                    }}
                />
            ) : (
                <Image
                    source={{ uri: image }}
                    style={{
                        opacity: 0,
                        width: windowWidth * (140 / 800),
                        height: Platform.isPad ? windowWidth * (140 / 800) : windowHeight * (140 / 360)
                    }}
                    onLoad={() => setImageLoaded(true)}
                />
            )}
            {successImage === 2 && imageLoaded && (
                <Image
                    source={passedimg}
                    style={{
                        width: windowWidth * (24 / 800),
                        height: Platform.isPad ? windowWidth * (24 / 800) : windowHeight * (24 / 360),
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        aspectRatio: 24 / 24
                    }}
                />
            )}
        </View>
        </View>
    );
}

export default TaskComponent;


// const getAnswer = async() => {  
    //     const requestStatus = await api.answerTask(task.id, uri, '1')
    //     console.log(requestStatus)
    // }