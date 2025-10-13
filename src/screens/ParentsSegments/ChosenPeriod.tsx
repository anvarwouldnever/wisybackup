import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ChosenPeriodText from './ChosenPeriodText';
import { useScale } from '../../hooks/useScale';
import Ionicons from '@expo/vector-icons/Ionicons';

const ChosenPeriod = ({ changeDate, setShow, chosenPeriod, monthRange, weekRange, formattedDate }) => {

    const handlePrevDate = useCallback(() => changeDate(-1), [changeDate]);
    const handleNextDate = useCallback(() => changeDate(1), [changeDate]);
    const handleShowCalendar = useCallback(() => setShow(true), [setShow]);

    const { s, vs } = useScale()

    return (
        <View style={{ width: '100%', height: 'auto', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <View style={{ width: 'auto', height: 'auto', flexDirection: 'row', columnGap: vs(5), alignItems: 'center' }}>
                
                <TouchableOpacity onPress={() => handlePrevDate()}>
                    
                    <Ionicons name='chevron-back' size={vs(24)} />
                
                </TouchableOpacity>
                    
                <ChosenPeriodText chosenPeriod={chosenPeriod} monthRange={monthRange} weekRange={weekRange} formattedDate={formattedDate} />
                
                <TouchableOpacity onPress={() => handleNextDate()}>
                    
                    <Ionicons name='chevron-forward' size={vs(24)} />
                
                </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={() => handleShowCalendar()}>
                
                <Ionicons name='calendar-number-outline' size={vs(24)} color={'#504297'} />
            
            </TouchableOpacity>

        </View>
    );
};

export default ChosenPeriod;
