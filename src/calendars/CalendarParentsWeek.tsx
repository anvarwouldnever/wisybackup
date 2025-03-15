import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { format } from 'date-fns';
import store from '../store/store';
import { observer } from 'mobx-react-lite';
import translations from '../../localization';

const CalendarParentsWeek = ({ setShow, setWeekRange }) => {

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
      
      // Локаль для английского языка
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
      
      // Устанавливаем дефолтный язык как латышский (или английский)
      LocaleConfig.defaultLocale = store.language;

    const [markedDates, setMarkedDates] = useState({});
    const { height, width } = useWindowDimensions();

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
        <View
            style={{
                width: width * (314 / 360),
                maxWidth: 445,
                height: 'auto',
                alignItems: 'center',
                borderRadius: 20,
                backgroundColor: 'white',
                position: 'absolute',
                top: height * (230 / 932),
                alignSelf: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                shadowColor: 'black',
                shadowRadius: 400,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 1,
            }}
        >
            <Calendar
                onDayPress={(day) => {
                    highlightWeek(day.dateString); // Вызываем функцию подсветки недели
                }}
                style={{
                    width: width * (314 / 360),
                    height: 'auto',
                    alignSelf: 'center',
                    borderRadius: 10,
                }}
                theme={{
                    textSectionTitleColor: '#504297',
                    arrowColor: '#504297',
                    indicatorColor: '#504297',
                }}
                markedDates={markedDates}
                markingType="period"
            />
            <View
                style={{
                    width: width * (314 / 360),
                    maxWidth: 460,
                    paddingHorizontal: 16,
                    height: height * (44 / 800),
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                }}
            >
                <TouchableOpacity
                    onPress={cancel}
                    style={{
                        width: width * (53 / 360),
                        height: height * (24 / 800),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#504297',
                            fontSize: 17,
                            letterSpacing: 0.5,
                            fontWeight: '400',
                        }}
                    >
                        {translations?.[store.language]?.cancel}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={done}
                    style={{
                        width: width * (43 / 360),
                        height: height * (24 / 800),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#504297',
                            fontSize: 17,
                            letterSpacing: 0.5,
                            fontWeight: '600',
                        }}
                    >
                        {translations?.[store.language]?.done}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default observer(CalendarParentsWeek);