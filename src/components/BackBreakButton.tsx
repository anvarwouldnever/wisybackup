import { View, Text, TouchableOpacity, useWindowDimensions, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import narrowleft from '../images/narrowleft-purple.png'

const BackButton = () => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
        const navigation = useNavigation()

            return (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor: 'white', width: windowWidth * (85 / 800), height: Platform.isPad? windowWidth * (40 / 800) : windowHeight * (40 / 360), borderRadius: 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: windowWidth * (8 / 800), position: 'absolute', left: 40, top: 30}}>
                    <Image source={narrowleft} style={{width: 24, height: 24, aspectRatio: 24 / 24}}/>
                    <Text style={{fontWeight: '600', fontSize: Platform.isPad? windowWidth * (12 / 800) : windowHeight * (12 / 360), lineHeight: windowHeight * (20 / 360), color: '#504297'}}>Exit</Text>
                </TouchableOpacity>
            )
        }

export default BackButton;