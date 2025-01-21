import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const CalendarParentsDay = ({ setShow, setFormattedDate }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const { height, width } = useWindowDimensions();

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
                    setSelectedDate(day); // Сохранить выбранную дату
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
                    selectedDayBackgroundColor: 'black',
                }}
                markedDates={{
                    [selectedDate?.dateString]: {
                        selected: true,
                        marked: true,
                        selectedColor: '#504297',
                    },
                }}
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

export default CalendarParentsDay;
