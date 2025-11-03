import { View, TouchableOpacity, Text } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import Modal from 'react-native-modal'
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { GetTasks } from "../../api/methods/game/tasks";
import { gameStore } from "../Games/store/gameStore";
import { useScale } from "../../hooks/utils/useScale";
import Ionicons from "@expo/vector-icons/Ionicons";

const InformationModal = ({ modalData, setInformationModal, informationModal, setIsFrozen }) => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartGame = async () => {
        if (isLoading || !modalData?.id) return;

        try {
            setIsFrozen(true)
            setIsLoading(true);

            const response = await GetTasks(modalData.id);

            await gameStore.setTasks([{
                tasks: response.data?.data,
                current_task_id_index: 0,
                id: modalData.id,
                order: modalData?.order_column,
                introAudio: modalData?.intro_speech_audio,
                introText: modalData?.intro_speech,
                tutorials: modalData?.tutorials,
            }]);

            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            
            setInformationModal(false);

            setTimeout(() => {
                navigation.navigate('GameScreen', { isFromAttributes: true });
            }, 200);

        } catch (error) {
            console.log("Ошибка при запуске игры:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const { s, vs, isTablet } = useScale()

    return (
        <Modal backdropOpacity={0.3} onBackdropPress={() => setInformationModal(false)} style={{ bottom: -vs(25), alignItems: 'center', position: 'absolute', width: '100%', alignSelf: 'center'}} isVisible={informationModal} animationIn={'slideInUp'} animationOut={'slideOutDown'}>
            
            <View style={{ alignItems: 'center', backgroundColor: 'white', width: '100%', padding: vs(20), rowGap: vs(35), borderRadius: vs(20), paddingBottom: vs(35) }}>
                
                <View style={{ alignSelf: 'center', backgroundColor: '#D4D1D1', width: vs(50), height: vs(5), borderRadius: vs(16) }} />
                
                <View style={{ width: '100%', height: 'auto', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    <View style={{ width: 'auto', height: 'auto', alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'center', rowGap: vs(7) }}>
                        
                        <Text style={{ fontWeight: '600', fontSize: isTablet ? vs(16) : vs(14), color: '#222222' }}>{modalData?.name}</Text>

                        <Text style={{ color: '#555555', fontWeight: '500', fontSize: isTablet ? vs(14) : vs(12) }}>{modalData?.mistakes} mistakes</Text>

                    </View>

                    <TouchableOpacity onPress={() => setInformationModal(false)}>
                        <Ionicons name='close-circle-outline' size={vs(24)} />
                    </TouchableOpacity>

                </View>

                <TouchableOpacity onPress={() => handleStartGame()} disabled={isLoading} style={{ width: '100%', opacity: isLoading ? 0.5 : 1, backgroundColor: '#504297', borderRadius: 100, height: vs(56), justifyContent: 'center', alignItems: 'center'}}>
                    
                    <Text style={{ fontWeight: '600', fontSize: isTablet ? vs(16) : vs(14), color: '#FFFFFF' }}>
                        {isLoading ? "Loading..." : "Open game"}
                    </Text>

                </TouchableOpacity>
            
            </View>

        </Modal>
    );
};

export default InformationModal;
