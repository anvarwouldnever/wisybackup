import React, { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { View, TouchableOpacity, Text } from "react-native";
import { useScale } from "../../../hooks/utils/useScale";

const Calendar = ({ setShow, formatDate }) => {

    const [date, setDate] = useState(new Date());

    const { s, vs, windowWidth } = useScale()

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(selectedDate);
    };
    
    const done = () => {
        formatDate(date)
        setShow(false)
    }

    const cancel = () => {
        setShow(false)
    }
    
    return (
        <View style={{width: windowWidth - vs(44), maxWidth: 445, height: vs(360), alignItems: 'center', borderRadius: 20, backgroundColor: 'white', position: 'absolute', top: vs(200), alignSelf: 'center', flexDirection: 'column', justifyContent: 'space-between', shadowColor: 'black', shadowRadius: 400, shadowOffset: {width: 1, height: 1}, shadowOpacity: 1}}>
            
            <RNDateTimePicker
                value={date} 
                onChange={onChange}
                themeVariant="light"
                style={{ width: windowWidth, height: vs(300), backgroundColor: 'white', borderRadius: 100 }}
                accentColor="#504297"
                display='compact'
                mode='date'
            />

            <View style={{width: s(314), maxWidth: 460, paddingHorizontal: 16, height: vs(44), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <TouchableOpacity onPress={() => cancel()} style={{width: s(53), height: vs(24), justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#504297', fontSize: 17, letterSpacing: 0.5, fontWeight: '400'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => done()} style={{width: s(43), height: vs(24), justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#504297', fontSize: 17, letterSpacing: 0.5, fontWeight: '600'}}>Done</Text>
                </TouchableOpacity>
            </View>

        </View> 
    )
}

export default Calendar;