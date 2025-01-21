import React, { useEffect, useState, useCallback } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View, useWindowDimensions, ActivityIndicator } from "react-native";
import narrowleft from '../images/tablerleft.png'
import narrowright from '../images/narrowright.png'
import calendar from '../images/tabler_calendar-month.png'
import tablerleft from '../images/tabler_arrow-left.png'
import circleX from '../images/circleX.png'
import numbers from '../images/Numbers.png'
import CalendarParentsWeek from "../calendars/CalendarParentsWeek";
import CalendarParentsDay from "../calendars/CalendarParentsDay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import ChosenPeriodText from "./ParentsSegments/ChosenPeriodText";
import Back from "./ParentsSegments/Back";
import ArrowLeft from "./ParentsSegments/ArrowLeft";
import ChosenPeriod from "./ParentsSegments/ChosenPeriod";

const ParentsSegments = ({ route }) => {

    const id = route.params.screen.id
    const name = route.params.screen.name
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
        const currentStartDate = parse(monthRange.startDate, 'dd.MM.yyyy', new Date()); // парсим startDate в объект Date
        const newStartDate = addMonths(currentStartDate, direction); // сдвигаем на 1 месяц в зависимости от direction
        const newEndDate = endOfMonth(newStartDate); // находим конец нового месяца
    
        setMonthRange({
            startDate: format(newStartDate, 'dd.MM.yyyy'), // форматируем начало месяца
            endDate: format(newEndDate, 'dd.MM.yyyy'), // форматируем конец месяца
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
                            });
                            setData(attributes);
                        } else {
                            const selectedDate = new Date(formattedDate.split('.').reverse().join('-'));
                            const fromDate = format(subDays(selectedDate, 1), 'dd.MM.yyyy'); // День назад
                            const toDate = format(addDays(selectedDate, 1), 'dd.MM.yyyy'); // День вперед
                
                            const attributes = await api.getAttributeByChild({
                                attribute_id: id,
                                child_id: store.playingChildId.id,
                                from: fromDate,
                                to: toDate,
                            });
                            setData(attributes);
                        }
                    
                } else if (chosenPeriod === 'week') {
                    const attributes = await api.getAttributeByChild({attribute_id: id, child_id: store.playingChildId.id, from: weekRange.startDate, to: weekRange.endDate})
                    setData(attributes)
                } else if (chosenPeriod === 'month') {
                    const attributes = await api.getAttributeByChild({attribute_id: id, child_id: store.playingChildId.id, from: monthRange.startDate, to: monthRange.endDate})
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
                {chosenPeriod === 'month' && <CalendarParentsMonth setShow={setShow} setMonthRange={setMonthRange} />}
            </Modal>
            <Periods chosenPeriod={chosenPeriod} setChosenPeriod={setChosenPeriod}/>
            <ChosenPeriod changeDate={changeDate} setShow={setShow} chosenPeriod={chosenPeriod} monthRange={monthRange} weekRange={weekRange} formattedDate={formattedDate}/>
            {/* {thinking? 
                <ActivityIndicator style={{position: 'absolute', alignSelf: 'center', top: 500}} size='large' color={'#504297'}/> 
                :  */}
                <View style={{width: windowWidth * (312 / 360), height: windowHeight * (606 / 800), gap: windowWidth * (24 / 360), alignItems: 'center'}}>
                    <TimeAndPuzzles data={data}/>
                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (232 / 800), alignItems: 'center', justifyContent: 'space-between'}}>
                        <NonAndMistakes chosenMistakesOption={chosenMistakesOption} setChosenMistakesOption={setChosenMistakesOption}/>
                        <View style={{width: windowWidth * (312 / 360), height: windowHeight * (164 / 800), gap: 12, alignItems: 'center'}}>
                        {data?.data &&
                            data?.data
                                .filter(item => chosenMistakesOption ? item.mistakes > 0 : item.mistakes === 0)
                                .map((item, index) =>  {
                                    
                                    // console.log(item)
                                    return (
                                    <TouchableOpacity
                                        key={index} 
                                        onPress={() => {
                                            setModalData(item);
                                            setInformationModal(prev => !prev)
                                        }} 
                                        style={{
                                            width: windowWidth * (312 / 360), 
                                            height: windowHeight * (76 / 800), 
                                            backgroundColor: '#F8F8F8', 
                                            borderRadius: 10, 
                                            padding: windowWidth * (16 / 360), 
                                            gap: windowWidth * (16 / 360), 
                                            alignItems: 'center', 
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Image 
                                            source={numbers} 
                                            style={{
                                                width: windowHeight * (40 / 800), 
                                                height: windowHeight * (40 / 800), 
                                                aspectRatio: 40 / 40
                                            }}
                                        />
                                        <View 
                                            style={{
                                                width: windowWidth * (184 / 360), 
                                                height: windowHeight * (44 / 800), 
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <Text 
                                                style={{
                                                    color: '#222222', 
                                                    fontWeight: '600', 
                                                    fontSize: windowHeight * (14 / 800), 
                                                    lineHeight: windowHeight * (20 / 800)
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text 
                                                style={{
                                                    color: '#222222', 
                                                    fontWeight: '400', 
                                                    fontSize: windowHeight * (12 / 800), 
                                                    lineHeight: windowHeight * (20 / 800)
                                                }}
                                            >
                                                {item.mistakes} mistakes
                                            </Text>
                                        </View>
                                        <Image 
                                            source={narrowright} 
                                            style={{
                                                width: windowHeight * (24 / 800), 
                                                height: windowHeight * (24 / 800)
                                            }}
                                        />
                                    </TouchableOpacity>
                                )})}
                            </View>
                        </View>
                </View>
            <InformationModal modalData={modalData} setInformationModal={setInformationModal} informationModal={informationModal}/>
        </SafeAreaView>
    )
}

export default ParentsSegments;

{/* <TouchableOpacity onPress={() => setInformationModal(prev => !prev)} style={{width: windowWidth * (312 / 360), height: windowHeight * (76 / 800), backgroundColor: '#F8F8F8', borderRadius: 10, padding: windowWidth * (16 / 360), gap: windowWidth * (16 / 360), alignItems: 'center', flexDirection: 'row'}}>
                                <Image source={numbers} style={{width: windowHeight * (40 / 800), height: windowHeight * (40 / 800), aspectRatio: 40 / 40}}/>
                                <View style={{width: windowWidth * (184 / 360), height: windowHeight * (44 / 800), justifyContent: 'space-between'}}>
                                    <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (20 / 800)}}>Counting 10</Text>
                                    <Text style={{color: '#222222', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>2 mistakes</Text>
                                </View>
                                <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800)}}/>
                            </TouchableOpacity> */}


                            // <TouchableOpacity style={{width: windowWidth * (312 / 360), height: windowHeight * (76 / 800), backgroundColor: '#F8F8F8', borderRadius: 10, padding: windowWidth * (16 / 360), gap: windowWidth * (16 / 360), alignItems: 'center', flexDirection: 'row'}}>
                            //     <Image source={numbers} style={{width: windowHeight * (40 / 800), height: windowHeight * (40 / 800), aspectRatio: 40 / 40}}/>
                            //     <View style={{width: windowWidth * (184 / 360), height: windowHeight * (44 / 800), justifyContent: 'space-between'}}>
                            //         <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (20 / 800)}}>Counting 10</Text>
                            //         <Text style={{color: '#222222', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>0 mistakes</Text>
                            //     </View>
                            //     <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                            // </TouchableOpacity>