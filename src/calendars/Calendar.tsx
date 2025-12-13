import React, { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { View, TouchableOpacity, Text } from "react-native"
import { useScale } from "../hooks/utils/useScale";

const Calendar = ({ setShow, setBirthday, birthday }) => {

    const { s, vs } = useScale()

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setBirthday(currentDate);
    };
    
    const done = () => {
        setShow(false);
    }

    const cancel = () => {
        setShow(false);
    }
    
    return (
            <View style={{width: '90%', maxWidth: 445, height: vs(375), alignItems: 'center', borderRadius: 20, backgroundColor: 'white', position: 'absolute', top: vs(200), alignSelf: 'center', flexDirection: 'column', justifyContent: 'space-between', shadowColor: 'black', shadowRadius: 400, shadowOffset: {width: 1, height: 1}, shadowOpacity: 1}}>
                
                <RNDateTimePicker
                    value={birthday ?? new Date()}
                    onChange={onChange}
                    themeVariant="light"
                    style={{marginTop: 1, width: '100%', maxWidth: 420, height: vs(320), backgroundColor: 'white'}}
                    accentColor="#504297"
                    display='inline'
                    mode='date'
                />

                <View style={{width: '90%', maxWidth: 460, paddingHorizontal: 16, height: vs(44), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                    
                    <TouchableOpacity onPress={() => cancel()} style={{ width: 'auto', height: vs(24), justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#504297', fontSize: 17, letterSpacing: 0.5, fontWeight: '400'}}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => done()} style={{ width: 'auto', height: vs(24), justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#504297', fontSize: 17, letterSpacing: 0.5, fontWeight: '600'}}>Done</Text>
                    </TouchableOpacity>

                </View>

            </View> 
    )
}

export default Calendar;