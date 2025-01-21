import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { format } from 'date-fns';

const CalendarParentsMonth = ({ setShow, setMonthRange }) => {
    const [markedDates, setMarkedDates] = useState({});
    const { height, width } = useWindowDimensions();

    const cancel = () => {
        setShow(false);
    };

    const done = () => {
        if (Object.keys(markedDates).length === 0) {
            console.log('No month selected');
            setShow(false);
            return;
        }

        const selectedDates = Object.keys(markedDates);
        const firstDay = selectedDates[0];
        const lastDay = selectedDates[selectedDates.length - 1];

        if (firstDay && lastDay) {
            const formattedMonthRange = {
                startDate: format(new Date(firstDay), 'dd.MM.yyyy'),
                endDate: format(new Date(lastDay), 'dd.MM.yyyy'),
            };

            console.log('Selected month:', formattedMonthRange);
            setMonthRange(formattedMonthRange); // Устанавливаем в state диапазон месяца
        }

        setShow(false);
    };

    const highlightMonth = (dateString) => {
        const selectedDate = moment(dateString);
        const startOfMonth = selectedDate.clone().startOf('month'); // Первый день месяца
        const endOfMonth = selectedDate.clone().endOf('month'); // Последний день месяца

        const newMarkedDates = {};

        for (let m = startOfMonth.clone(); m.isSameOrBefore(endOfMonth); m.add(1, 'days')) {
            const key = m.format('YYYY-MM-DD');
            newMarkedDates[key] = {
                color: '#504297',
                textColor: 'white',
                startingDay: key === startOfMonth.format('YYYY-MM-DD'),
                endingDay: key === endOfMonth.format('YYYY-MM-DD'),
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
                    highlightMonth(day.dateString); // Вызываем функцию подсветки месяца
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
                        Cancel
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
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CalendarParentsMonth;
