import React, { useState } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundMusic from './ChoosePlayer/BackgroundMusic';
import Children from './ChoosePlayer/Children';
import store from '../store/store';
import { observer } from 'mobx-react-lite';
import { useScale } from '../hooks/useScale';
import useLockLandscape from '../hooks/useLockLandscape'
import Ionicons from '@expo/vector-icons/Ionicons';

const ChoosePlayerScreen = () => {

    const navigation = useNavigation();
    const [chosenPlayerIndex, setChosenPlayerIndex] = useState(null);
    const [chosenPlayer, setChosenPlayer] = useState();

    const { s, vs } = useScale()

    useLockLandscape()

    return (
        <ImageBackground source={require('../images/choosePlayer.png')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            
            <BackgroundMusic />
        
            <Children
                setChosenPlayerIndex={setChosenPlayerIndex}
                chosenPlayerIndex={chosenPlayerIndex}
                setChosenPlayer={setChosenPlayer}
            />

            {chosenPlayerIndex != null && (
                <TouchableOpacity onPress={() => { navigation.navigate('GamesScreen'); store.setPlayingChildId(chosenPlayer)}} style={{ borderRadius: 100, flexDirection: 'row', columnGap: vs(10), justifyContent: 'center', alignItems: 'center', backgroundColor: '#504297', width: s(65), height: s(25), bottom: s(10), right: s(10), position: 'absolute'}}>
                    
                    <Text style={{ fontWeight: '600', fontSize: s(7), color: 'white'}}>
                        Let's play
                    </Text>

                    <Ionicons name='arrow-forward' size={s(8)} color={'white'} />

                </TouchableOpacity>
            )}
        
        </ImageBackground>
    );
};

export default observer(ChoosePlayerScreen);