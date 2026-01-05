import { View, Text, Platform, TouchableOpacity, Keyboard } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useScale } from '../../hooks/utils/useScale';
import { navigationRef } from '../../navigation/utils/navigate';
import * as ScreenOrientation from "expo-screen-orientation";
import translations from '../../../localization';
import store from '../../store/store';
import { withTiming } from 'react-native-reanimated';

const Buttons = ({ createChild, loading, stage, name, avatar, birthday, gender, setStage, engagementTime, setPrevStage, setIsFrozen, checkName, setNameExists, inputHeight, labels }) => {

    const { s, vs } = useScale()

    const move =
        (stage === 1 && (!name || name.trim().length === 0)) ||
        (stage === 2 && !(typeof avatar === 'number' && avatar >= 0)) ||
        (stage === 3 && !birthday) ||
        (stage === 4 && gender === null) ||
        (stage === 5 && engagementTime === null);

    const changeStage = async(newStage: number) => {
        if (loading) return;

        if (newStage < stage && stage === 1) {
            setIsFrozen(true)

            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            setTimeout(() => {
                navigationRef.navigate('ChoosePlayerScreen'); 
            }, 150);
            return;
        }
        
        if (stage === 1) {
            const nameExists = checkName()
            if (nameExists) {
                return setNameExists(true)
            }
            Keyboard.dismiss()
            inputHeight.value = withTiming(vs(460), { duration: 600 })
            setTimeout(() => {
                setPrevStage(stage);
                setStage(newStage);
            }, 200);
            return
        }
      
        if (newStage < stage) {
            if (newStage < 1) return;
            setPrevStage(stage);
            setStage(newStage);
            return;
        }
      
        if (move) return;
      
        if (newStage === 6) {
            createChild();
            return;
        }
      
        if (newStage > 5) return;
      
        setPrevStage(stage);
        setStage(newStage);
    };

    return (
        <View style={{ width: '100%', height: vs(56), paddingHorizontal: vs(24), flexDirection: 'row', justifyContent: 'space-between'}}>
                    
            <TouchableOpacity disabled={loading} onPress={() => changeStage(stage - 1)} style={{ backgroundColor: '#F8F8F833', height: '100%', width: vs(56), borderRadius: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFFFFF1A' }}>
                <Ionicons name='arrow-back' size={vs(24)} color={'white'} />
            </TouchableOpacity>

            <TouchableOpacity disabled={loading || move} onPress={() => changeStage(stage + 1)} style={{ opacity: move ? 0.5 : 1, width: s(121), height: '100%', backgroundColor: 'white', borderRadius: 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: vs(8)}}>
                <Text style={{ fontSize: Platform.isPad ? vs(16) : vs(14), fontWeight: '600', color: '#504297' }}>{labels?.continue}</Text>
                <Ionicons size={vs(24)} name='arrow-forward' color={'#504297'} />
            </TouchableOpacity>

        </View>
    )
}

export default Buttons;