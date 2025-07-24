import React from 'react'; import { TouchableOpacity, Text, useWindowDimensions, Platform } from 'react-native';

const HandrittenSendButton = ({ onPress, disabled = false }) => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions(); 
    const buttonHeight = Platform.isPad ? windowWidth * (50 / 800) : windowHeight * (50 / 360);

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={{ width: windowWidth * (120 / 800), height: buttonHeight, backgroundColor: '#FF69B4', borderRadius: 100, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', position: 'absolute', bottom: 0, right: 0, opacity: disabled ? 0.5 : 1 }}>
            <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>Send</Text>
        </TouchableOpacity>
    );
};

export default HandrittenSendButton;
