import { View, Platform, useWindowDimensions } from 'react-native'
import React from 'react'
import Button from './Button';

const RenderItem = ({ item, lock, answer, id }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <View style={{backgroundColor: 'white', width: Platform.isPad ? windowWidth * (120 / 800) : windowWidth * (120 / 800), height: Platform.isPad ? windowWidth * (120 / 800) : windowHeight * (120 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                <Button item={item} lock={lock} answer={answer} id={id} />
            </View>
        );
    };

export default RenderItem;
