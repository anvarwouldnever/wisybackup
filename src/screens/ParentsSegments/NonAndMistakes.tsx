import { View, TouchableOpacity, Text, useWindowDimensions } from "react-native";
import translations from "../../../localization";
import store from "../../store/store";

const NonAndMistakes = ({ chosenMistakesOption, setChosenMistakesOption }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (52 / 800), gap: windowWidth * (8 / 360), backgroundColor: '#F8F8F8', borderRadius: 10, padding: windowHeight * (8 / 800), flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => setChosenMistakesOption(true)} style={{width: windowWidth * (144 / 360), height: windowHeight * (36 / 800), borderRadius: 4, backgroundColor: chosenMistakesOption? '#504297' : '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: chosenMistakesOption? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>{translations[store.language]?.withMistakes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setChosenMistakesOption(false)} style={{width: windowWidth * (144 / 360), backgroundColor: !chosenMistakesOption? '#504297' : '#F8F8F8', height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: chosenMistakesOption? '#555555' : '#FFFFFF', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>{translations[store.language]?.withoutMistakes}</Text>
                </TouchableOpacity>
            </View>
        )
    }

export default NonAndMistakes;