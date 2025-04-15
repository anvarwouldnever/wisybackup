import React, { useState, useCallback, useEffect } from "react";
import { Text, Image, View, SafeAreaView, useWindowDimensions, TouchableOpacity, Platform, FlatList, ActivityIndicator } from "react-native";
import ParentsCancel from "../components/ParentsCancel";
import ParentsComponents from "../components/ParentsComponent";
import BottomTabs from "../components/BottomTabs";
import ParentsSettings from "../components/ParentsSettings";
import store from "../store/store";
import Child from "../components/Child";
import DropDownModal from "../components/DropDownModal";
import { observer } from "mobx-react-lite";
import LanguageComponent from "../components/LanguageComponent";
import narrowLeft from '../images/narrowLeftBlack.png'
import Animated from "react-native-reanimated";
import translations from "../../localization";

const ParentsScreen = () => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const initialScreen = store?.attributes?.[0]
    const [screen, setScreen] = useState(initialScreen);
    const [dropDown, setDropDown] = useState(null);

    const handleScreenChange = useCallback((newScreen) => setScreen(newScreen), []);

    useEffect(() => {
        store.loadDataFromStorageChildren();
    }, [])

    const LanguageReturn = () => {
        return (
            <Animated.View style={{width: windowWidth * (312 / 360), height: windowHeight * (28 / 800), alignItems: 'center', flexDirection: 'row', gap: windowWidth * (8 / 360)}}>
                <TouchableOpacity onPress={() => setScreen('Settings')} style={{justifyContent: 'center', alignItems: 'center', width: 'auto', height: 'auto'}}>
                    <Image style={{width: windowWidth * (24 / 360), height: windowHeight * (24 / 800)}} source={narrowLeft}/>
                </TouchableOpacity>
                <Text style={{color: '#222222', fontWeight: '600', fontSize: windowHeight * (20 / 800)}}>{translations?.[store.language]?.language}</Text>
            </Animated.View>
        )
    }

    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', gap: 15, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android'? 40 : 0}}>
            {screen == 'Lang'? '' : <ParentsCancel />}
            {screen == 'Lang'? <LanguageReturn /> : screen !== 'Settings' && !dropDown? <Child setDropDown={setDropDown} dropDown={dropDown}/> : screen === 'Settings'? null : <View style={{width: windowWidth * (312 / 360), padding: windowWidth * (16 / 360), height: windowHeight * (80 / 800)}}/>}
            {screen !== 'Settings' && dropDown && <DropDownModal setDropDown={setDropDown} dropDown={dropDown}/>}
            {screen == 'Settings'?  <ParentsSettings setScreen={setScreen}/> : screen == 'Lang'? <LanguageComponent setScreen={setScreen}/> : <ParentsComponents screen={screen}/>}
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800)}} />
            <View style={{width: windowWidth * (312 / 360), height: windowHeight * (56 / 800), alignItems: 'center', position: 'absolute', bottom: Platform.OS === 'ios'? windowHeight * (40 / 932) : windowHeight * (15 / 932), alignSelf: 'center'}}>
                {store.attributes && <BottomTabs screen={screen} setScreen={handleScreenChange} />}
            </View>
        </SafeAreaView>
    )
}

export default observer(ParentsScreen);

{/* {screen === 'Settings' && <SubscriptionState />} */}

// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import ChildAge from "../components/ChildAge";
// import ChildGender from "../components/ChildGender";
// import ChildEngagementTime from "../components/ChildEngagementTime";
// import ChildName from "../components/ChildName";
// import HomeIcon from '../images/Cat.png'
// import CartIcon from '../images/Dog.png'
// import OrdersIcon from '../images/Girafe.png'
// import UserIcon from '../images/dino.png'
// import { Text, Image, Dimensions } from "react-native";

// const windows = Dimensions.get('window')
// const SCREEN_WIDTH = windows.width
// const SCREEN_HEIGHT = windows.height

// const Tab = createBottomTabNavigator();

// const ParentsScreen = () => {
//     return (
//         <Tab.Navigator screenOptions={({route}) => ({headerShown: false, tabBarShowLabel: false, tabBarStyle: {backgroundColor: '#F8F8F8', borderRadius: 100, position: 'absolute', bottom: 50, height: 56, width: 188, borderTopWidth: 0, shadowColor: 'gray', shadowOpacity: 0.4, shadowRadius: 5, shadowOffset: {width: 1, height: 1}}, tabBarItemStyle: {flexDirection: 'column', width: 'auto', height: 52}, tabBarIcon: ({ focused, color, size }) => {
//             let icon;
//                 if (route.name === 'Главная') {
//                     icon = focused ? HomeIcon : HomeIcon;
//                 } else if (route.name === 'Чат') {
//                     icon = focused ? CartIcon : CartIcon;
//                 } else if (route.name === 'Избранное') {
//                     icon = focused ? OrdersIcon : OrdersIcon;
//                 } else if (route.name === 'Аккаунт') {
//                     icon = focused ? UserIcon : UserIcon;
//                 }

//       return <Image source={icon} style={{width: 24, height: 24, tintColor: focused ? '#6246EA' : '#7D8588', marginTop: 6}} />
//         }
//           })} >
//             <Tab.Screen name="Главная" component={ChildAge} />
//             <Tab.Screen name="Чат" component={ChildEngagementTime} />
//             <Tab.Screen name="Избранное" component={ChildGender} />
//             <Tab.Screen name="Аккаунт" component={ChildName} />
//         </Tab.Navigator>
//     )   
// }

// export default ParentsScreen;