import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Tutorial from './Tutorial';

const TutorialOverlay = ({ tutorials }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <View style={{ width: windowWidth * (600 / 800), height: windowHeight * (272 / 360), position: 'absolute', alignSelf: 'center', top: '6%' }}>
            <Tutorial tutorials={tutorials} />
        </View>
    );
};

export default TutorialOverlay;