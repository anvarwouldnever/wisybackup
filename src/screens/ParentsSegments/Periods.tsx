import { View, TouchableOpacity, Text } from "react-native";
import { useScale } from "../../hooks/utils/useScale";

const Periods = ({ chosenPeriod, setChosenPeriod, labels }) => {

    const { s, vs } = useScale()

    return (
        <View style={{width: '100%', height: vs(60), padding: vs(10), borderRadius: vs(12), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <TouchableOpacity onPress={() => setChosenPeriod('day')} style={{width: '33%', height: '100%', borderRadius: vs(10), justifyContent: 'center', alignItems: 'center', backgroundColor: chosenPeriod === 'day'? '#504297' : '#F8F8F8'}}>
                
                <Text style={{color: chosenPeriod === 'day'? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: vs(12)}}>{labels?.day}</Text>
            
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setChosenPeriod('week')} style={{width: '33%', height: '100%', borderRadius: vs(10), justifyContent: 'center', alignItems: 'center', backgroundColor: chosenPeriod === 'week'? '#504297' : '#F8F8F8'}}>
               
                <Text style={{color: chosenPeriod === 'week'? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: vs(12)}}>{labels?.week}</Text>
            
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setChosenPeriod('month')} style={{width: '33%', height: '100%', borderRadius: vs(10), justifyContent: 'center', alignItems: 'center', backgroundColor: chosenPeriod === 'month'? '#504297' : '#F8F8F8'}}>
                
                <Text style={{color: chosenPeriod === 'month'? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: vs(12)}}>{labels?.month}</Text>
            
            </TouchableOpacity>

        </View>
    )
}

export default Periods;