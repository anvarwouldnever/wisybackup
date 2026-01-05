import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import CalendarParentsWeek from "../calendars/CalendarParentsWeek";
import CalendarParentsDay from "../calendars/CalendarParentsDay";
import Modal from 'react-native-modal'
import { startOfWeek, endOfWeek, addDays, format, parse, startOfMonth, endOfMonth, addMonths, isToday, subDays } from "date-fns";
import store from "../store/store";
import CalendarParentsMonth from "../calendars/CalendarParentsMonth";
import InformationModal from "./ParentsSegments/InformationModal";
import Periods from "./ParentsSegments/Periods";
import NonAndMistakes from "./ParentsSegments/NonAndMistakes";
import TimeAndPuzzles from "./ParentsSegments/TimeAndPuzzles";
import Back from "./ParentsSegments/Back";
import ChosenPeriod from "./ParentsSegments/ChosenPeriod";
import RenderAttributes from "./ParentsSegments/RenderAttributes";
import { GetChildAttributes } from "../api/methods/attributes/attributes";
import { useScale } from "../hooks/utils/useScale";
import { SafeAreaView } from "react-native-safe-area-context";
import useLockPortrait from "../hooks/utils/useLockPortrait";
import { useFocusEffect } from "@react-navigation/native";
import { getLabels } from "./Welcome/hooks/getLabels";

const ParentsSegmentsScreen = ({ route }) => {

    const id = route?.params?.screen?.id;
    const name = route?.params?.screen?.name;

    const { s, vs } = useScale();
    const { labels } = getLabels()

    useLockPortrait()

    useFocusEffect(
        useCallback(() => {
            setIsFrozen(false);
        }, [])
    );

    const [show, setShow] = useState(false);
    const [data, setData] = useState();
    const [modalData, setModalData] = useState()
    const [chosenMistakesOption, setChosenMistakesOption] = useState(true)
    const [informationModal, setInformationModal] = useState(false)
    const [isFrozen, setIsFrozen] = useState(false)
    const [chosenPeriod, setChosenPeriod] = useState('day');
    const [formattedDate, setFormatedDate] = useState(format(new Date(), 'dd.MM.yyyy'));
    const [weekRange, setWeekRange] = useState({ startDate: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy'), endDate: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'dd.MM.yyyy') });
    const [monthRange, setMonthRange] = useState({ startDate: format(startOfMonth(new Date()), 'dd.MM.yyyy'), endDate: format(endOfMonth(new Date()), 'dd.MM.yyyy')});

    const updateWeekRange = (direction) => {
        const currentStartDate = parse(weekRange?.startDate, 'dd.MM.yyyy', new Date());
        const newStartDate = addDays(currentStartDate, direction * 7);
        const newEndDate = addDays(newStartDate, 6);

        setWeekRange({
            startDate: format(newStartDate, 'dd.MM.yyyy'),
            endDate: format(newEndDate, 'dd.MM.yyyy'),
        });
    };

    const updateMonthRange = (direction) => {
        const currentStartDate = parse(monthRange?.startDate, 'dd.MM.yyyy', new Date()); 
        const newStartDate = addMonths(currentStartDate, direction);
        const newEndDate = endOfMonth(newStartDate); 
    
        setMonthRange({
            startDate: format(newStartDate, 'dd.MM.yyyy'),
            endDate: format(newEndDate, 'dd.MM.yyyy'), 
        });
    };

    const changeDate = (direction) => {
        const today = new Date();
    
        if (chosenPeriod === 'day') {
            const currentDate = parse(formattedDate, 'dd.MM.yyyy', new Date());
            const newDate = addDays(currentDate, direction);
    
            if (newDate > today) return;
    
            setFormatedDate(format(newDate, 'dd.MM.yyyy'));
        } else if (chosenPeriod === 'week') {
            const currentStartDate = parse(weekRange?.startDate, 'dd.MM.yyyy', new Date());
            const newStartDate = addDays(currentStartDate, direction * 7);
    
            // Проверяем НАЧАЛО новой недели
            if (newStartDate > today) return;
    
            updateWeekRange(direction);
        } else if (chosenPeriod === 'month') {
            const currentStartDate = parse(monthRange?.startDate, 'dd.MM.yyyy', new Date());
            const newStartDate = addMonths(currentStartDate, direction);
    
            // Проверяем НАЧАЛО нового месяца
            if (newStartDate > today) return;
    
            updateMonthRange(direction);
        }
    };    
    
    useEffect(() => {
        const getData = async() => {
            try {
                if (chosenPeriod === 'day') {
                    if (isToday(new Date(formattedDate.split('.').reverse().join('-')))) {
                        const attributes = await GetChildAttributes(id, store.playingChildId?.id); 
                       
                        setData(attributes?.data);
                    } else {
                        const selectedDate = new Date(formattedDate.split('.').reverse().join('-'));
                        
                        const date = format(selectedDate, 'dd.MM.yyyy');
                        
                        const attributes = await GetChildAttributes(id, store.playingChildId.id, date, date);
                        
                        setData(attributes?.data);
                    }
                } else if (chosenPeriod === 'week') {
                    const attributes = await GetChildAttributes(id, store.playingChildId?.id, weekRange?.startDate, weekRange?.endDate)
                    
                    setData(attributes.data)
                } else if (chosenPeriod === 'month') {
                    const attributes = await GetChildAttributes(id, store.playingChildId?.id, monthRange?.startDate, monthRange?.endDate)
                    
                    setData(attributes?.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [chosenPeriod, monthRange, weekRange, formattedDate])

    if (isFrozen) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color={'purple'} size={'large'} style={{position: 'absolute', alignSelf: 'center'}}/>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', rowGap: vs(20), paddingHorizontal: vs(20), paddingVertical: vs(10)}}>
            
            <Back name={name}/>
            
            <Modal isVisible={show} animationIn='fadeIn' animationInTiming={1} animationOutTiming={1}>
                
                {chosenPeriod === 'day' && <CalendarParentsDay setShow={setShow} setFormattedDate={setFormatedDate} />}

                {chosenPeriod === 'week' && <CalendarParentsWeek setShow={setShow} setWeekRange={setWeekRange} />}

                {chosenPeriod ==='month' && <CalendarParentsMonth setShow={setShow} setMonthRange={setMonthRange} />}

            </Modal>

            <Periods labels={labels} chosenPeriod={chosenPeriod} setChosenPeriod={setChosenPeriod}/>

            <ChosenPeriod changeDate={changeDate} setShow={setShow} chosenPeriod={chosenPeriod} monthRange={monthRange} weekRange={weekRange} formattedDate={formattedDate}/>
                
            <View style={{width: '100%', height: 'auto', rowGap: vs(12), alignItems: 'center' }}>
                    
                <TimeAndPuzzles labels={labels} data={data}/>
                
                <View style={{ width: '100%', height: 'auto', alignItems: 'center', justifyContent: 'center', rowGap: vs(16) }}>
                        
                    <NonAndMistakes labels={labels} chosenMistakesOption={chosenMistakesOption} setChosenMistakesOption={setChosenMistakesOption}/>
                    
                    <FlatList
                        scrollEnabled
                        data={data?.data?.filter(item => chosenMistakesOption ? item?.mistakes > 0 : item?.mistakes === 0)}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return <RenderAttributes item={item} setInformationModal={setInformationModal} setModalData={setModalData}/>
                        }}
                        contentContainerStyle={{ height: 'auto', rowGap: vs(12) }}
                        style={{ width: '100%', height: vs(330) }}
                    />
            
                </View>

            </View>

            {informationModal && 
                <InformationModal labels={labels} modalData={modalData} setInformationModal={setInformationModal} informationModal={informationModal} setIsFrozen={setIsFrozen}/>
            }

        </SafeAreaView>
    )
}

export default ParentsSegmentsScreen;