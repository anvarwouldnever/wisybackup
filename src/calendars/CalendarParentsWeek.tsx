import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { format } from 'date-fns';
import store from '../store/store';
import { observer } from 'mobx-react-lite';
import translations from '../../localization';
import { useScale } from '../hooks/utils/useScale';

const CalendarParentsWeek = ({ setShow, setWeekRange }) => {

    LocaleConfig.defaultLocale = store.language;

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

    const [markedDates, setMarkedDates] = useState({});

    const { s, vs } = useScale()

    const cancel = () => {
        setShow(false);
    };

    const done = () => {
        if (Object.keys(markedDates).length === 0) {
            console.log('No week selected');
            setShow(false);
            return;
        }

        const selectedDates = Object.keys(markedDates);
        const monday = selectedDates.find((date) => markedDates[date]?.startingDay);
        const sunday = selectedDates.find((date) => markedDates[date]?.endingDay);

        if (monday && sunday) {
            const formattedWeekRange = {
                startDate: format(new Date(monday), 'dd.MM.yyyy'),
                endDate: format(new Date(sunday), 'dd.MM.yyyy'),
            };

            console.log('Selected week:', formattedWeekRange);
            setWeekRange(formattedWeekRange); // Устанавливаем в state диапазон недели
        }

        setShow(false);
    };
    

    const highlightWeek = (dateString) => {
        const selectedDate = moment(dateString); // Преобразуем строку даты в объект moment
        const startOfWeek = selectedDate.clone().startOf('isoWeek'); // Первый день недели (понедельник)
        const endOfWeek = selectedDate.clone().endOf('isoWeek'); // Последний день недели (воскресенье)
    
        const newMarkedDates = {};
    
        for (let m = startOfWeek.clone(); m.isSameOrBefore(endOfWeek); m.add(1, 'days')) {
            const key = m.format('YYYY-MM-DD');
            newMarkedDates[key] = {
                color: '#504297',
                textColor: 'white',
                startingDay: key === startOfWeek.format('YYYY-MM-DD'),
                endingDay: key === endOfWeek.format('YYYY-MM-DD'),
            };
        }
    
        setMarkedDates(newMarkedDates);
    };    

    return (
        <View style={{ width: vs(314), height: 'auto', padding: vs(14), rowGap: vs(16), alignItems: 'center', borderRadius: 20, backgroundColor: 'white', position: 'absolute', alignSelf: 'center', flexDirection: 'column', shadowColor: 'black', shadowRadius: 400, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, elevation: 100 }}>
            
            <Calendar
                onDayPress={(day) => highlightWeek(day.dateString)}
                style={{ width: vs(310), height: 'auto', alignSelf: 'center' }}
                theme={{ textSectionTitleColor: '#504297', arrowColor: '#504297', indicatorColor: '#504297', todayTextColor: '#504297', textDayFontSize: vs(16), textDayHeaderFontSize: vs(10), textMonthFontSize: vs(14), todayButtonFontSize: vs(16) }}
                markedDates={markedDates}
                markingType="period"
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

export default observer(CalendarParentsWeek);