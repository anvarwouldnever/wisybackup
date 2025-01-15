import React, { useState } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import narrowleft from '../images/tablerleft.png'
import narrowright from '../images/narrowright.png'
import calendar from '../images/tabler_calendar-month.png'
import tablerleft from '../images/tabler_arrow-left.png'
import circleX from '../images/circleX.png'
import numbers from '../images/Numbers.png'
import { useNavigation } from "@react-navigation/native";
import Calendar from "../components/Calendar";
import { format } from "date-fns";
import Modal from 'react-native-modal'

const ParentsSegments = () => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    const [show, setShow] = useState(false);
    const [formattedDate, setFormatedDate] = useState('')
    const [informationModal, setInformationModal] = useState(false)

    const formatDate = (someDate) => {
        const formattedDate = format(someDate, 'dd MMMM yyyy');
        setFormatedDate(formattedDate);
    }

    const InformationModal = () => {
        return (
            <Modal backdropOpacity={0.3} onBackdropPress={() => setInformationModal(false)} style={{bottom: 0, alignItems: 'center', borderRadius: 24, position: 'absolute', width: '100%', height: windowHeight * (230 / 800), backgroundColor: 'white', alignSelf: 'center'}} isVisible={informationModal} animationIn={'slideInUp'} animationOut={'slideOutDown'}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <View style={{alignSelf: 'center', backgroundColor: '#D4D1D1', width: windowWidth * (48 / 360), height: windowHeight * (4 / 800)}}/>
                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (64 / 800)}}>
                        <View style={{width: '100%', height: windowHeight * (24 / 800), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                            <Text style={{fontWeight: '600', fontSize: 16, color: '#222222'}}>Counting to 10</Text>
                            <TouchableOpacity onPress={() => setInformationModal(false)}>
                                <Image source={circleX} style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800)}}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color: '#555555', fontWeight: '500', fontSize: 12}}>2 mistakes</Text>
                    </View>
                    <TouchableOpacity style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#504297', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontWeight: '600', fontSize: 14, color: '#FFFFFF'}}>Open game</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white', alignItems: 'center', gap: windowHeight * (16 / 800)}}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{width: windowWidth * (312 / 360), height: windowHeight * (28 / 800), flexDirection: 'row', alignItems: 'center'}}>
                <Image source={tablerleft} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800)}}/>
                <Text style={{fontWeight: '600', fontSize: windowHeight * (20 / 800), marginLeft: windowWidth * (5 / 360)}}>Mathematics</Text>
            </TouchableOpacity>
            <Modal visible={show} animationType='fade' transparent={true}>
                <Calendar setShow={setShow} formatDate={formatDate}/>
            </Modal>
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (52 / 800), paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, padding: 8, backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{width: windowWidth * (93 / 360), height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#504297'}}>
                    <Text style={{color: '#FFFFFF', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>Day</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width: windowWidth * (93 / 360), height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800)}}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width: windowWidth * (93 / 360), height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800)}}>Month</Text>
                </TouchableOpacity>
            </View>
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (24 / 800), flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: windowWidth * (109 / 360), height: windowHeight * (24 / 800), flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <Image source={narrowleft} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                    <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (14 / 800)}}>{formattedDate === ''? 'Today' : formattedDate}</Text>
                    <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                </View>
                <TouchableOpacity onPress={() => setShow(true)}>
                    <Image source={calendar} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                </TouchableOpacity>
            </View>
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (606 / 800), gap: windowWidth * (24 / 360), alignItems: 'center'}}>
                <View style={{width: windowWidth * (312 / 360), height: windowHeight * (120 / 800), justifyContent: 'space-between'}}>
                    <Text style={{color: '#222222', fontSize: windowHeight * (16 / 800), lineHeight: windowHeight * (24 / 800), fontWeight: '600'}}>Overview</Text>
                    <View style={{alignSelf: 'center', width: windowWidth * (312 / 360), height: windowHeight * (80 / 800), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{width: windowWidth * (148 / 360), padding: 16, height: windowHeight * (80 / 800), gap: 4, justifyContent: 'center', backgroundColor: '#F8F8F8', borderRadius: 16}}>
                            <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>Total time</Text>
                            <Text style={{color: '#222222', fontWeight: '600', lineHeight: windowHeight * (24 / 800), fontSize: windowHeight * (16 / 800)}}>3 min</Text>
                        </View>
                        <View style={{width: windowWidth * (148 / 360), padding: windowHeight * (16 / 800), height: windowHeight * (80 / 800), backgroundColor: '#F8F8F8', borderRadius: 16, gap: 4, justifyContent: 'center',}}>
                            <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>Puzzles solved</Text>
                            <Text style={{color: '#222222', fontWeight: '600', lineHeight: windowHeight * (24 / 800), fontSize: windowHeight * (16 / 800)}}>5</Text>
                        </View>
                    </View>
                </View>
                <View style={{width: windowWidth * (312 / 360), height: windowHeight * (232 / 800), alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (52 / 800), gap: windowWidth * (8 / 360), backgroundColor: '#F8F8F8', borderRadius: 10, padding: windowHeight * (8 / 800), flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={{width: windowWidth * (144 / 360), height: windowHeight * (36 / 800), borderRadius: 4, backgroundColor: '#504297', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#FFFFFF', fontWeight: '600', fontSize: windowHeight * (12 / 800)}}>With mistakes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: windowWidth * (144 / 360), height: windowHeight * (36 / 800), borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800)}}>Without mistakes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (164 / 800), gap: 12, alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => setInformationModal(prev => !prev)} style={{width: windowWidth * (312 / 360), height: windowHeight * (76 / 800), backgroundColor: '#F8F8F8', borderRadius: 10, padding: windowWidth * (16 / 360), gap: windowWidth * (16 / 360), alignItems: 'center', flexDirection: 'row'}}>
                            <Image source={numbers} style={{width: windowHeight * (40 / 800), height: windowHeight * (40 / 800), aspectRatio: 40 / 40}}/>
                            <View style={{width: windowWidth * (184 / 360), height: windowHeight * (44 / 800), justifyContent: 'space-between'}}>
                                <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (20 / 800)}}>Counting 10</Text>
                                <Text style={{color: '#222222', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>2 mistakes</Text>
                            </View>
                            <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800)}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: windowWidth * (312 / 360), height: windowHeight * (76 / 800), backgroundColor: '#F8F8F8', borderRadius: 10, padding: windowWidth * (16 / 360), gap: windowWidth * (16 / 360), alignItems: 'center', flexDirection: 'row'}}>
                            <Image source={numbers} style={{width: windowHeight * (40 / 800), height: windowHeight * (40 / 800), aspectRatio: 40 / 40}}/>
                            <View style={{width: windowWidth * (184 / 360), height: windowHeight * (44 / 800), justifyContent: 'space-between'}}>
                                <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (14 / 800), lineHeight: windowHeight * (20 / 800)}}>Counting 10</Text>
                                <Text style={{color: '#222222', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>0 mistakes</Text>
                            </View>
                            <Image source={narrowright} style={{width: windowHeight * (24 / 800), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
                <InformationModal />
        </SafeAreaView>
    )
}

export default ParentsSegments