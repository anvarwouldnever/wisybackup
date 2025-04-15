import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import { format } from "date-fns";
import store from "../store/store";
import { observer } from "mobx-react-lite";
import translations from "../../localization";

const CalendarParentsMonth = ({ setShow, setMonthRange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { height, width } = useWindowDimensions();
    const [markedDates, setMarkedDates] = useState({});

    const cancel = () => {
        setShow(false);
    };

    useEffect(() => {
        const today = moment();
        selectMonth({ month: today.month() + 1, year: today.year() });
    }, []);

    const done = () => {
        if (Platform.OS === "ios") {
            const startOfMonth = moment(selectedDate).startOf("month").format("DD.MM.yyyy");
            const endOfMonth = moment(selectedDate).endOf("month").format("DD.MM.yyyy");
            setMonthRange({ startDate: startOfMonth, endDate: endOfMonth });
        } else {
            const selectedDates = Object.keys(markedDates);
            const firstDay = selectedDates[0];
            const lastDay = selectedDates[selectedDates.length - 1];
            setMonthRange({
                startDate: format(new Date(firstDay), "dd.MM.yyyy"),
                endDate: format(new Date(lastDay), "dd.MM.yyyy"),
            });
        }
        setShow(false);
    };

    const selectMonth = (month) => {
        const startOfMonth = moment(`${month.year}-${month.month}-01`);
        const endOfMonth = startOfMonth.clone().endOf("month");
        const newMarkedDates = {};
    
        for (let m = startOfMonth.clone(); m.isSameOrBefore(endOfMonth); m.add(1, "days")) {
            const key = m.format("YYYY-MM-DD");
            newMarkedDates[key] = {
                color: "#504297",
                textColor: "white",
                startingDay: key === startOfMonth.format("YYYY-MM-DD"),
                endingDay: key === endOfMonth.format("YYYY-MM-DD"),
            };
        }
        setMarkedDates(newMarkedDates);
    };

    return (
        <View
            style={{
                width: width * (314 / 360),
                maxWidth: 445,
                alignItems: "center",
                borderRadius: 20,
                backgroundColor: "white",
                position: "absolute",
                alignSelf: "center",
                flexDirection: "column",
                justifyContent: "space-between",
                shadowColor: "black",
                shadowRadius: 400,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 1,
                elevation: 100,
            }}
        >
            {Platform.OS === "ios" ? (
                <RNDateTimePicker
                    value={selectedDate}
                    onChange={(event, date) => date && setSelectedDate(date)}
                    themeVariant="light"
                    display="spinner"
                    mode="date"
                    accentColor="#504297"
                />
            ) : (
                <Calendar
                    style={{ width: width * (314 / 360), borderRadius: 10 }}
                    theme={{
                        textDayStyle: { color: "white" }, // Делаем текст невидимым
                    }}
                    markedDates={markedDates}
                    markingType="period"
                    hideDayNames={true}
                    onMonthChange={selectMonth}
                />
            )}

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
                            fontSize: height * (17 / 800),
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
                            fontSize: height * (17 / 800),
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

export default observer(CalendarParentsMonth);