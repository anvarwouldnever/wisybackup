import React, { useEffect, useState, useCallback } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, useWindowDimensions, FlatList } from "react-native";
import CalendarParentsWeek from "../calendars/CalendarParentsWeek";
import CalendarParentsDay from "../calendars/CalendarParentsDay";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from 'expo-screen-orientation';
import Modal from 'react-native-modal'
import { startOfWeek, endOfWeek, addDays, format, parse, startOfMonth, endOfMonth, addMonths, isToday, subDays } from "date-fns";
import api from '../api/api';
import store from "../store/store";
import CalendarParentsMonth from "../calendars/CalendarParentsMonth";
import InformationModal from "./ParentsSegments/InformationModal";
import Periods from "./ParentsSegments/Periods";
import NonAndMistakes from "./ParentsSegments/NonAndMistakes";
import TimeAndPuzzles from "./ParentsSegments/TimeAndPuzzles";
import Back from "./ParentsSegments/Back";
import ChosenPeriod from "./ParentsSegments/ChosenPeriod";
import RenderAttributes from "./ParentsSegments/RenderAttributes";

const ParentsSegments = ({ route }) => {

    const id = route?.params?.screen?.id
    const name = route?.params?.screen?.name
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
            changeScreenOrientation();
        }, [])
    );

    const [show, setShow] = useState(false);
    const [data, setData] = useState();
    const [modalData, setModalData] = useState()
    const [chosenMistakesOption, setChosenMistakesOption] = useState(true)
    const [informationModal, setInformationModal] = useState(false)
    const [chosenPeriod, setChosenPeriod] = useState('day');
    const [formattedDate, setFormatedDate] = useState(format(new Date(), 'dd.MM.yyyy'));
    const [weekRange, setWeekRange] = useState({
        startDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy'),
        endDate: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy'),
    });
    const [monthRange, setMonthRange] = useState({
        startDate: format(startOfMonth(new Date()), 'dd.MM.yyyy'),
        endDate: format(endOfMonth(new Date()), 'dd.MM.yyyy'),
    });

    const updateWeekRange = (direction) => {
        const currentStartDate = parse(weekRange.startDate, 'dd.MM.yyyy', new Date());
        const newStartDate = addDays(currentStartDate, direction * 7);
        const newEndDate = addDays(newStartDate, 6);

        setWeekRange({
            startDate: format(newStartDate, 'dd.MM.yyyy'),
            endDate: format(newEndDate, 'dd.MM.yyyy'),
        });
    };

    const updateMonthRange = (direction) => {
        const currentStartDate = parse(monthRange.startDate, 'dd.MM.yyyy', new Date()); 
        const newStartDate = addMonths(currentStartDate, direction);
        const newEndDate = endOfMonth(newStartDate); 
    
        setMonthRange({
            startDate: format(newStartDate, 'dd.MM.yyyy'),
            endDate: format(newEndDate, 'dd.MM.yyyy'), 
        });
    };

    const changeDate = (direction) => {
        if (chosenPeriod === 'day') {
            const newDate = addDays(parse(formattedDate, 'dd.MM.yyyy', new Date()), direction);
            setFormatedDate(format(newDate, 'dd.MM.yyyy'));
        } else if (chosenPeriod === 'week') {
            updateWeekRange(direction);
        } else if (chosenPeriod === 'month') {
            updateMonthRange(direction);
        }
    };
    
    useEffect(() => {
        const getData = async() => {
            try {
                if (chosenPeriod === 'day') {
                        if (isToday(new Date(formattedDate.split('.').reverse().join('-')))) {
                            const attributes = await api.getAttributeByChild({
                                attribute_id: id,
                                child_id: store.playingChildId.id,
                                token: store.token
                            });
                            setData(attributes);
                        } else {
                            const selectedDate = new Date(formattedDate.split('.').reverse().join('-'));
                            const fromDate = format(subDays(selectedDate, 1), 'dd.MM.yyyy');
                            const toDate = format(addDays(selectedDate, 1), 'dd.MM.yyyy');
                
                            const attributes = await api.getAttributeByChild({
                                attribute_id: id,
                                child_id: store.playingChildId.id,
                                from: fromDate,
                                to: toDate,
                                token: store.token
                            });
                            setData(attributes);
                        }
                    
                } else if (chosenPeriod === 'week') {
                    const attributes = await api.getAttributeByChild({attribute_id: id, child_id: store.playingChildId.id, from: weekRange.startDate, to: weekRange.endDate, token: store.token})
                    setData(attributes)
                } else if (chosenPeriod === 'month') {
                    const attributes = await api.getAttributeByChild({attribute_id: id, child_id: store.playingChildId.id, from: monthRange.startDate, to: monthRange.endDate, token: store.token})
                    setData(attributes)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [chosenPeriod, monthRange, weekRange, formattedDate])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white', alignItems: 'center', gap: windowHeight * (16 / 800)}}>
            <Back name={name}/>
            <Modal visible={show} animationType="fade" transparent>
                {chosenPeriod === 'day' && <CalendarParentsDay setShow={setShow} setFormattedDate={setFormatedDate} />}
                {chosenPeriod === 'week' && <CalendarParentsWeek setShow={setShow} setWeekRange={setWeekRange} />}
                {chosenPeriod ==='month' && <CalendarParentsMonth setShow={setShow} setMonthRange={setMonthRange} />}
            </Modal>
            <Periods chosenPeriod={chosenPeriod} setChosenPeriod={setChosenPeriod}/>
            <ChosenPeriod changeDate={changeDate} setShow={setShow} chosenPeriod={chosenPeriod} monthRange={monthRange} weekRange={weekRange} formattedDate={formattedDate}/>
                <View style={{width: windowWidth * (312 / 360), height: windowHeight * (606 / 800), gap: windowWidth * (24 / 360), alignItems: 'center'}}>
                    <TimeAndPuzzles data={data}/>
                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (232 / 800), alignItems: 'center', justifyContent: 'space-between'}}>
                        <NonAndMistakes chosenMistakesOption={chosenMistakesOption} setChosenMistakesOption={setChosenMistakesOption}/>
                        <View style={{width: windowWidth * (312 / 360), height: windowHeight * (370 / 800), marginTop: 20, alignItems: 'center'}}>
                        <FlatList
                            scrollEnabled
                            data={data?.data?.filter(item => chosenMistakesOption ? item?.mistakes > 0 : item?.mistakes === 0)}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => {
                                return <RenderAttributes item={item} setInformationModal={setInformationModal} setModalData={setModalData}/>
                            }}
                            contentContainerStyle={{
                                height: 'auto',
                                gap: 5
                            }}
                            style={{
                                width: windowWidth * (312 / 360),
                                height: '100%',
                            }}
                        />
                        </View>
                    </View>
                </View>
            {informationModal && <InformationModal modalData={modalData} setInformationModal={setInformationModal} informationModal={informationModal}/>}
        </SafeAreaView>
    )
}

export default ParentsSegments;