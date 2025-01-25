import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { format } from 'date-fns';

const CalendarParentsMonth = ({ setShow, setMonthRange }) => {
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { height, width } = useWindowDimensions();

    const cancel = () => {
        setShow(false);
    };

    const done = () => {
        const selectedMoment = moment(selectedDate);
        const startOfMonth = selectedMoment.clone().startOf('month').format('DD.MM.yyyy'); // Правильное форматирование
        const endOfMonth = selectedMoment.clone().endOf('month').format('DD.MM.yyyy'); // Правильное форматирование
    
        if (startOfMonth && endOfMonth) {
            const formattedMonthRange = {
                startDate: startOfMonth,
                endDate: endOfMonth,
            };
    
            setMonthRange(formattedMonthRange); // Устанавливаем в state диапазон месяца
        }
    
        setShow(false);
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
            <RNDateTimePicker
                value={selectedDate}
                onChange={(event, date) => {
                    if (date) {
                        setSelectedDate(date); // Устанавливаем выбранную дату
                    }
                }}
                themeVariant="light"
                style={{
                    marginTop: 1,
                    width: width * 0.8666 - 25,
                    maxWidth: 420,
                    height: height * (320 / 800),
                    backgroundColor: 'white',
                }}
                accentColor="#504297"
                display="spinner"
                mode="date"
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


{/* <RNDateTimePicker
                    value={new Date()}
                    themeVariant="light"
                    style={{marginTop: 1, width: width * 0.8666 - 25, maxWidth: 420, height: height * (320 / 800), backgroundColor: 'white'}}
                    accentColor="#504297"
                    display='spinner'
                /> */}
