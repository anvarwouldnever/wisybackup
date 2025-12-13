import { View, Text, Platform, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { useScale } from '../../hooks/utils/useScale';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import CalendarAndroid from '../../calendars/CalendarAndroid';
import Calendar from '../../calendars/Calendar';
import translations from '../../../localization';
import store from '../../store/store';

const Age = ({ setBirthday, settings, birthday, formatDate }) => {

    const { vs } = useScale()

    const title = settings?.child_age_placeholder

    const [show, setShow] = useState(false);

    return (
        <View style={{ height: vs(376), justifyContent: 'space-between' }}>

            <View style={{ height: 'auto', width:'100%', gap: vs(16), alignItems: 'center', justifyContent: 'center' }}>
                
                <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(22) : vs(20), fontWeight: '600' }}>
                    {translations[store.language].howOldIsYourChild}
                </Text>

                {
                    <Modal visible={show} animationType='fade' transparent={true}>
                        <Calendar birthday={birthday} setShow={setShow} setBirthday={setBirthday}/>
                    </Modal> 
                }

                <TouchableOpacity onPress={() => setShow(true)} style={{justifyContent: 'center', opacity: show? 0 : 1, alignItems: 'center', width: '100%', borderRadius: 100, padding: 16, height: vs(56), borderWidth: 1, borderColor: '#E5E5E5'}}>
                    <Text style={{fontWeight: '600', fontSize: vs(14), textAlign: 'center', color: birthday === '' ? '#B1B1B1' : '#222222'}}>
                        {birthday ? formatDate(birthday) : title}
                    </Text>
                </TouchableOpacity>

            </View>

            <Text style={{ width: '100%', textAlign: 'center', color: '#555555', fontSize: Platform.isPad ? vs(14) : vs(12), fontWeight: '500', lineHeight: Platform.isPad ? vs(22) : vs(20), paddingHorizontal: vs(20) }}>
                We need the age for generating appropriate games and date to celebrate with Wisy the Birthday
            </Text>
        
        </View>
    )
}

export default Age;