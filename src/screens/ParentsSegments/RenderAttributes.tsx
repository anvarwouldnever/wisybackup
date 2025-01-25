import { TouchableOpacity, View, Image, Text, useWindowDimensions,  } from "react-native";
import numbers from '../../images/Numbers.png'
import narrowright from '../../images/narrowright.png'

const RenderAttributes = ({ item, setModalData, setInformationModal }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    return (
        <TouchableOpacity onPress={() => {
            setModalData(item);
            setInformationModal(true);
        }} style={{ width: windowWidth * (312 / 360), height: windowHeight * (76 / 800), backgroundColor: '#F8F8F8', borderRadius: 10, padding: windowWidth * (16 / 360), gap: windowWidth * (16 / 360), alignItems: 'center', flexDirection: 'row', marginBottom: windowHeight * (8 / 800)}}>
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
    )
} 

export default RenderAttributes;