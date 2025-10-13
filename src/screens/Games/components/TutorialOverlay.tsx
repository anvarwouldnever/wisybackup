import React from 'react';
import { View } from 'react-native';
import Tutorial from './Tutorial';

const TutorialOverlay = ({ tutorials }) => {

    return (
        <View style={{ width: 'auto', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
            <Tutorial tutorials={tutorials} />
        </View>
    );
};

export default TutorialOverlay;