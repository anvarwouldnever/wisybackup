import { View, Text } from "react-native";
import translations from "../../../localization";
import store from "../../store/store";
import { useScale } from "../../hooks/utils/useScale";

const TimeAndPuzzles = ({ data }) => {

    const { s, vs } = useScale()

    return (
        <View style={{width: '100%', height: 'auto', justifyContent: 'center', rowGap: vs(16)}}>
            
            <Text style={{color: '#222222', fontSize: vs(16), fontWeight: '600'}}>{translations[store.language]?.overview}</Text>
            
            <View style={{alignSelf: 'center', width: '100%', height: vs(80), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                
                <View style={{ width: '49%', padding: vs(16), height: '100%', rowGap: vs(6), justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: vs(16)}}>
                    
                    <Text style={{color: '#555555', fontWeight: '400', fontSize: vs(12) }}>{translations[store.language]?.totalTime}</Text>
                    
                    <Text style={{color: '#222222', fontWeight: '600', fontSize: vs(16) }}>{data?.data ? Math.ceil(data.data.reduce((sum, item) => sum + (item.lead_time || 0), 0) / 60) : 0} min</Text>
                
                </View>

                <View style={{ width: '49%', padding: vs(16), height: '100%', backgroundColor: '#F8F8F8', borderRadius: vs(16), rowGap: vs(6), justifyContent: 'center',}}>
                    
                    <Text style={{color: '#555555', fontWeight: '400', fontSize: vs(12) }}>{translations[store.language]?.puzzlesSolved}</Text>
                    
                    <Text style={{color: '#222222', fontWeight: '600', fontSize: vs(16) }}>{data?.data?.length}</Text>
                
                </View>

            </View>

        </View>
    )
}
    
export default TimeAndPuzzles;