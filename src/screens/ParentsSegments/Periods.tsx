import { View, TouchableOpacity, Text ,useWindowDimensions } from "react-native";


const Periods = ({ chosenPeriod, setChosenPeriod }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (52 / 800), paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, padding: 8, backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => setChosenPeriod('day')} style={{width: windowWidth * (93 / 360), height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: chosenPeriod === 'day'? '#504297' : ''}}>
                    <Text style={{color: chosenPeriod === 'day'? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>Day</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setChosenPeriod('week')} style={{width: windowWidth * (93 / 360), height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: chosenPeriod === 'week'? '#504297' : ''}}>
                    <Text style={{color: chosenPeriod === 'week'? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setChosenPeriod('month')} style={{width: windowWidth * (93 / 360), height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: chosenPeriod === 'month'? '#504297' : ''}}>
                    <Text style={{color: chosenPeriod === 'month'? '#FFFFFF' : '#555555', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>Month</Text>
                </TouchableOpacity>
            </View>
        )
    }
export default Periods;