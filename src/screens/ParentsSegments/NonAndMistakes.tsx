import { View, TouchableOpacity, Text } from "react-native";
import { useScale } from "../../hooks/utils/useScale";

const NonAndMistakes = ({ chosenMistakesOption, setChosenMistakesOption, labels }) => {

    const { s, vs } = useScale()

    return (
        <View style={{width: '100%', height: vs(60), backgroundColor: '#F8F8F8', borderRadius: vs(12), padding: vs(10), flexDirection: 'row', justifyContent: 'space-between'}}>
            
            <TouchableOpacity onPress={() => setChosenMistakesOption(true)} style={{ width: '49%', height: '100%', borderRadius: vs(10), backgroundColor: chosenMistakesOption? '#504297' : '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
                
                <Text style={{color: chosenMistakesOption? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: vs(12)}}>{labels?.withMistakes}</Text>
            
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setChosenMistakesOption(false)} style={{ width: '49%', height: '100%', backgroundColor: !chosenMistakesOption? '#504297' : '#F8F8F8', borderRadius: vs(10), justifyContent: 'center', alignItems: 'center'}}>
                
                <Text style={{color: chosenMistakesOption? '#555555' : '#FFFFFF', fontWeight: '600', fontSize: vs(12)}}>{labels?.withoutMistakes}</Text>
            
            </TouchableOpacity>

        </View>
    )
}

export default NonAndMistakes;