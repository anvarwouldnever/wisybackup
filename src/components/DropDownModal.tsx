import { View, FlatList, useWindowDimensions, TouchableOpacity, Image, Text } from "react-native";
import store from "../store/store";
import dog from '../images/Dog.png';
import narrowdown from '../images/narrowdown.png';
import narrowup from '../images/narrowup.png';
import Modal from 'react-native-modal'

const DropDownModal = ({ setDropDown, dropDown }) => {

        const { height: windowHeight, width: windowWidth } = useWindowDimensions();

        const renderChild = ({ item, index }) => {
                
                const last = store.children.length - 1;
                
                return (
                    <TouchableOpacity onPress={() => {
                        index != 0 && store.setPlayingChildId(item)
                        setDropDown(false)
                    }} key={index} style={{width: windowWidth * (312 / 360), padding: windowWidth * (16 / 360), height: windowHeight * (80 / 800), justifyContent: 'space-between', borderBottomLeftRadius: index == last? 12 : 0, borderBottomRightRadius: index == last? 12 : 0, borderTopRightRadius: index == 0? 12 : 0, borderTopLeftRadius: index == 0? 12 : 0, backgroundColor: index === 0? '#F8F8F8' : '#FFFFFF', flexDirection: 'row', gap: windowWidth * (12 / 360), alignItems: 'center', borderBottomWidth: 1, borderColor: '#EAEAEA'}}>
                        <Image source={dog} style={{width: windowHeight * (48 / 800), height: windowWidth * (48 / 800), aspectRatio: 48 / 48}}/>
                        <View style={{width: windowWidth * (184 / 360), height: windowHeight * (44 / 800), alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'}}>
                            <View style={{width: windowWidth * (184 / 360), height: windowHeight * (20 / 800), flexDirection: 'row'}}>
                                <Text style={{fontWeight: '600', color: '#000000', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800)}}>{item.name}</Text>
                                <Text style={{color: '#555555', fontWeight: '400', fontSize: windowHeight * (12 / 800), lineHeight: windowHeight * (20 / 800), marginLeft: 5}}>/ age 6</Text>
                            </View>
                            <View style={{width: windowWidth * (184 / 360), flexDirection: 'row', height: windowHeight * (20 / 800)}}>
                                <Text style={{fontWeight: '600', color: '#222222', lineHeight: windowHeight * (20 / 800), fontSize: windowHeight * (12 / 800)}}>63</Text>
                                <Text style={{fontWeight: '400', fontSize: windowHeight * (12 / 800), color: '#555555', lineHeight: windowHeight * (20 / 800), marginLeft: 5}}>completed tasks</Text>
                            </View>
                        </View>
                        {index === 0? <TouchableOpacity onPress={() => setDropDown(prev => !prev)} style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={dropDown? narrowup : narrowdown} style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), aspectRatio: 24 / 24}}/>
                        </TouchableOpacity> : <TouchableOpacity style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800), justifyContent: 'center', alignItems: 'center'}} />}
                    </TouchableOpacity>
                )
            }

        return (
            <Modal backdropColor="black" backdropOpacity={0.3} hasBackdrop={true} onBackdropPress={() => setDropDown(prev => !prev)} style={{height: 'auto', alignSelf: 'center', width: windowWidth * (312 / 360), position: 'absolute', top: windowHeight * (76 / 800)}} isVisible={dropDown} animationIn={'fadeIn'} >
                <View style={{height: windowHeight * (233 / 800), borderRadius: 12, overflow: 'hidden'}}>
                    <FlatList 
                        data={store.children.slice().sort((a, b) => {
                            if (a.id === store.playingChildId.id) return -1;
                            if (b.id === store.playingChildId.id) return 1;
                            return 0;
                        })}
                        renderItem={renderChild}
                        scrollEnabled={store.children.length >= 3? true : false}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{backgroundColor: 'transparent'}}
                    />
                </View>
            </Modal>
        )
    }

export default DropDownModal;