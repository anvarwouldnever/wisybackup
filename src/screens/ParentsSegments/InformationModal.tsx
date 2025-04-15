import { View, TouchableOpacity, Text, Image, useWindowDimensions } from "react-native";
import store from "../../store/store";
import * as ScreenOrientation from 'expo-screen-orientation';
import Modal from 'react-native-modal'
import circleX from '../../images/circleX.png'
import { useNavigation } from "@react-navigation/native";

const InformationModal = ({ modalData, setInformationModal, informationModal }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();
        const navigation = useNavigation();

        console.log(modalData)

        const subCollection = store?.categories[0]?.collections[0]?.sub_collections?.find(
            (item) => item?.id === modalData?.id
        );
    
        if (!subCollection) {
            return null;
        }

        const taskIndex = subCollection?.tasks?.findIndex(
            (task) => task.id === modalData?.current_task_id
        );
    
        const filteredTasks = taskIndex !== -1 ? subCollection?.tasks?.slice(taskIndex) : [];
    
        const dataForGameScreen = {
            id: modalData.id,
            tasks: filteredTasks,
        };

        console.log(dataForGameScreen)
    
        return (
            <Modal backdropOpacity={0.3} onBackdropPress={() => setInformationModal(false)} style={{bottom: 0, alignItems: 'center', borderRadius: 24, position: 'absolute', width: '100%', height: windowHeight * (230 / 800), backgroundColor: 'white', alignSelf: 'center'}} isVisible={informationModal} animationIn={'slideInUp'} animationOut={'slideOutDown'}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <View style={{alignSelf: 'center', backgroundColor: '#D4D1D1', width: windowWidth * (48 / 360), height: windowHeight * (4 / 800)}}/>
                    <View style={{width: windowWidth * (312 / 360), height: windowHeight * (64 / 800)}}>
                        <View style={{width: '100%', height: windowHeight * (24 / 800), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                            <Text style={{fontWeight: '600', fontSize: 16, color: '#222222'}}>{modalData?.name}</Text>
                            <TouchableOpacity onPress={() => setInformationModal(false)}>
                                <Image source={circleX} style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800)}}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{color: '#555555', fontWeight: '500', fontSize: 12}}>{modalData?.mistakes} mistakes</Text>
                    </View>
                    <TouchableOpacity onPress={async() => {
                            setInformationModal(false)
                            navigation.navigate('GameScreen', {tasks: [dataForGameScreen], isFromAttributes: true})
                            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
                            }} 
                        style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), backgroundColor: '#504297', borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontWeight: '600', fontSize: 14, color: '#FFFFFF'}}>Open game</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

export default InformationModal;

// onPress={async() => {
//     setInformationModal(false)
//     navigation.navigate('GameScreen', {tasks: [dataForGameScreen], isFromAttributes: true})
//     await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
//     }} 