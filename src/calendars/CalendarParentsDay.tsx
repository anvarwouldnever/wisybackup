import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import store from '../store/store';
import translations from '../../localization';
import { observer } from 'mobx-react-lite';
import { useScale } from '../hooks/utils/useScale';

const CalendarParentsDay = ({ setShow, setFormattedDate }) => {

    LocaleConfig.locales['lv'] = {
        monthNames: [
            'Janvāris',
            'Februāris',
            'Marts',
            'Aprīlis',
            'Maijs',
            'Jūnijs',
            'Jūlijs',
            'Augusts',
            'Septembris',
            'Oktobris',
            'Novembris',
            'Decembris'
        ],
        monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'Mai.', 'Jūn.', 'Jūl.', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dec.'],
        dayNames: ['Svētdiena', 'Pirmdiena', 'Otrdiena', 'Trešdiena', 'Ceturtdiena', 'Piektdiena', 'Sestdiena'],
        dayNamesShort: ['Sv.', 'Pr.', 'Ot.', 'Tr.', 'Ce.', 'Pk.', 'Sv.'],
        today: "Šodien"
    };

    LocaleConfig.locales['en'] = {
        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
        today: "Today"
    };

    LocaleConfig.defaultLocale = store.language;

    const [selectedDate, setSelectedDate] = useState(null);

    const cancel = () => {
        setShow(false)
    };

    const done = () => {
        if (selectedDate) {
            const formattedDate = moment(selectedDate.dateString).format('DD.MM.YYYY');
            setFormattedDate(formattedDate);
        }
        setShow(false);
    };

    const { s, vs } = useScale();

    return (
        <View style={{ width: vs(314), height: 'auto', padding: vs(14), rowGap: vs(16), alignItems: 'center', borderRadius: 20, backgroundColor: 'white', position: 'absolute', alignSelf: 'center', flexDirection: 'column', shadowColor: 'black', shadowRadius: 400, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, elevation: 100 }}>
            
            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day);
                }}
                style={{ width: vs(310), height: 'auto', alignSelf: 'center', rowGap: vs(16) }}
                theme={{ textSectionTitleColor: '#504297', arrowColor: '#504297', indicatorColor: '#504297', todayTextColor: '#504297', textDayFontSize: vs(16), textDayHeaderFontSize: vs(10), textMonthFontSize: vs(14), todayButtonFontSize: vs(16) }}
                markedDates={{
                    [selectedDate?.dateString]: {
                        selected: true,
                        selectedColor: '#504297',
                    },
                }}
                locale={store.language}
                monthFormat={'MMMM yyyy'}
            />

            <View style={{ width: '100%', height: 'auto', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                
                <TouchableOpacity onPress={cancel} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    
                    <Text style={{ color: '#504297', fontSize: vs(16), fontWeight: '400' }}>
                        {translations?.[store.language]?.cancel}
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity onPress={done} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    
                    <Text style={{ color: '#504297', fontSize: vs(16), fontWeight: '600' }}>
                        {translations?.[store.language]?.done}
                    </Text>

                </TouchableOpacity>

            </View>

        </View>
    );
};

export default observer(CalendarParentsDay);
