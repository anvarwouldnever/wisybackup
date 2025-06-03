import React from "react";
import { TextInput, View, Dimensions, Text } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as ScreenOrientation from 'expo-screen-orientation';
import store from "../store/store";
import translations from "../../localization";

const { width, height } = Dimensions.get('window');

const ChildName = ({ setKeyboardActive, setOptions, options, nameError, setNameError }) => {

    return (
        <Animated.View entering={SlideInRight} style={{flexDirection: 'column', justifyContent: 'space-between', width: width * 0.8666, height: height * (135 / 800)}}>
            <View style={{width: width * 0.8666, height: height * (28 / 800)}}>
                <Text style={{fontWeight: '600', fontSize: height * (20 / 800), textAlign: 'center', color: '#222222'}}>What's Your Child's Name?</Text>
            </View>
            <TextInput 
                style={{fontWeight: '600', fontSize: height * (14 / 800), textAlign: 'center', borderRadius: 100, width: width * 0.8666, height: height * (56 / 800), borderColor: nameError? 'red' : '#E5E5E5', borderWidth: 1, padding: height * (16 / 800)}}
                onFocus={() => setKeyboardActive(true)}
                keyboardAppearance='dark'
                placeholder={store?.addchildui?.child_name_placeholder}
                placeholderTextColor={'#B1B1B1'}
                onEndEditing={() => setKeyboardActive(false)}
                onChangeText={(text) => {
                        setOptions(prevOptions => ({
                            ...prevOptions,
                            name: text
                        }))
                        if (nameError) {
                            setNameError(false);
                        }
                    }
                }
                value={options.name}
            />
            <Text style={{fontWeight: '600', color: 'red', alignSelf: 'center', fontSize: height * (12 / 800), opacity: nameError? 1 : 0}}>
                {translations[store.language].childWithThisName}
            </Text>
        </Animated.View>
    )
}

export default ChildName;