import { View, Text, useWindowDimensions } from "react-native";
import translations from "../../../localization";
import store from "../../store/store";

const TimeAndPuzzles = ({ data }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        // console.log(data)

        return (
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (120 / 800), justifyContent: 'space-between'}}>
                <Text style={{color: '#222222', fontSize: windowHeight * (16 / 800), lineHeight: windowHeight * (24 / 800), fontWeight: '600'}}>{translations[store.language]?.overview}</Text>
                <View style={{alignSelf: 'center', width: windowWidth * (312 / 360), height: windowHeight * (80 / 800), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{width: windowWidth * (148 / 360), padding: 16, height: windowHeight * (80 / 800), gap: 4, justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: 16}}>
                        <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>{translations[store.language]?.totalTime}</Text>
                        <Text style={{color: '#222222', fontWeight: '600', lineHeight: windowHeight * (24 / 800), fontSize: windowHeight * (16 / 800)}}>{data?.data ? Math.ceil(data.data.reduce((sum, item) => sum + (item.lead_time || 0), 0) / 60) : 0} min</Text>
                    </View>
                    <View style={{width: windowWidth * (148 / 360), padding: windowHeight * (16 / 800), height: windowHeight * (80 / 800), backgroundColor: '#F8F8F8', borderRadius: 16, gap: 4, justifyContent: 'center',}}>
                        <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>{translations[store.language]?.puzzlesSolved}</Text>
                        <Text style={{color: '#222222', fontWeight: '600', lineHeight: windowHeight * (24 / 800), fontSize: windowHeight * (16 / 800)}}>{data?.data?.length}</Text>
                    </View>
                </View>
            </View>
        )
    }
export default TimeAndPuzzles;