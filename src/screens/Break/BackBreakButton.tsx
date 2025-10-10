import { Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import store from '../../store/store';
import { stopCurrentSound } from '../../hooks/newPlaySound';
import { useScale } from '../../hooks/useScale';
import translations from '../../../localization';

const BackButton = () => {

    const navigation = useNavigation()

    const { s, vs } = useScale()

    const onPress = () => {
        stopCurrentSound()
        store.setBreakPlayingMusic(false);
        store.setPlayingMusic(true);
        navigation.goBack() 
    }
    
    return (
        <TouchableOpacity onPress={() => onPress()} style={{backgroundColor: 'white', width: 'auto', height: 'auto', columnGap: s(4), paddingHorizontal: s(10), paddingVertical: s(5), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', position: 'absolute', left: s(15), top: s(12)}}>
            
            <Image source={require('../../images/narrowleft-purple.png')} style={{width: s(10), height: s(10)}}/>

            <Text style={{fontWeight: '600', fontSize: s(6), color: '#504297'}}>{translations?.[store.language]?.exit}</Text>

        </TouchableOpacity>
    )
}

export default BackButton;