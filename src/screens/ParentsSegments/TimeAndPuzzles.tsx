import { View, Text, useWindowDimensions } from "react-native";

const TimeAndPuzzles = ({ data }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        return (
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (120 / 800), justifyContent: 'space-between'}}>
                <Text style={{color: '#222222', fontSize: windowHeight * (16 / 800), lineHeight: windowHeight * (24 / 800), fontWeight: '600'}}>Overview</Text>
                <View style={{alignSelf: 'center', width: windowWidth * (312 / 360), height: windowHeight * (80 / 800), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{width: windowWidth * (148 / 360), padding: 16, height: windowHeight * (80 / 800), gap: 4, justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: 16}}>
                        <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>Total time</Text>
                        <Text style={{color: '#222222', fontWeight: '600', lineHeight: windowHeight * (24 / 800), fontSize: windowHeight * (16 / 800)}}>{data?.data? data.data.reduce((sum, item) => sum + (item.lead_time || 0), 0) : 0} min</Text>
                    </View>
                    <View style={{width: windowWidth * (148 / 360), padding: windowHeight * (16 / 800), height: windowHeight * (80 / 800), backgroundColor: '#F8F8F8', borderRadius: 16, gap: 4, justifyContent: 'center',}}>
                        <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>Puzzles solved</Text>
                        <Text style={{color: '#222222', fontWeight: '600', lineHeight: windowHeight * (24 / 800), fontSize: windowHeight * (16 / 800)}}>{data?.data?.length}</Text>
                    </View>
                </View>
            </View>
        )
    }
export default TimeAndPuzzles;