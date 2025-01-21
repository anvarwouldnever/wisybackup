import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import ArrowLeft from './ArrowLeft';
import ChosenPeriodText from './ChosenPeriodText';
import narrowright from '../../images/narrowright.png'
import calendar from '../../images/tabler_calendar-month.png'

const ChosenPeriod = ({ changeDate, setShow, chosenPeriod, monthRange, weekRange, formattedDate }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const handlePrevDate = useCallback(() => changeDate(-1), [changeDate]);
    const handleNextDate = useCallback(() => changeDate(1), [changeDate]);
    const handleShowCalendar = useCallback(() => setShow(true), [setShow]);

    return (
        <View style={{ width: windowWidth * (312 / 360), height: windowHeight * (24 / 800), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: 'auto', height: windowHeight * (52 / 800), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handlePrevDate()}>
                    <ArrowLeft />
                </TouchableOpacity>
                    <ChosenPeriodText chosenPeriod={chosenPeriod} monthRange={monthRange} weekRange={weekRange} formattedDate={formattedDate} />
                <TouchableOpacity onPress={() => handleNextDate()}>
                    <Image source={narrowright} style={{ width: windowHeight * (24 / 800), height: windowHeight * (24 / 800) }} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity  onPress={() => handleShowCalendar()}>
                <Image source={calendar} style={{ width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24 }} />
            </TouchableOpacity>
        </View>
    );
};

export default ChosenPeriod;
