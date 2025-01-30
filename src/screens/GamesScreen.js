import React, { useCallback, useState, useEffect } from "react";
import { View, ImageBackground, useWindowDimensions, Platform, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import bgimage from '../images/BGimage.png';
import * as ScreenOrientation from 'expo-screen-orientation';
import GamesCollections from "../components/GamesList";
import GameCategories from "../components/GameOptions";
import { useFocusEffect } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import MarketCollections from "../components/Market/MarketCollections";
import MarketCategories from "../components/Market/MarketCategories";
import HeaderCollection from "./GamesScreen/HeaderCollection";
import HeaderMenu from "./GamesScreen/HeaderMenu";
import WisyPanel from "./GamesScreen/WisyPanel";
import GoParent from "./GamesScreen/GoParent";
import Back from "./GamesScreen/Back";
import Stars from "./GamesScreen/Stars";
import Modal from 'react-native-modal';
import star from '../images/tabler_star-filled.png';
import x from '../images/xConfirmModal.png';
import galka from '../images/galkaConfirmModal.png'
import store from "../store/store";
import api from "../api/api";

const GamesScreen = () => {

    const [activeCategory, setActiveCategory] = useState(0);
    const [subCollections, setSubCollections] = useState(null);
    const [activeMarket, setActiveMarket] = useState(0);
    const [marketCollections, setMarketCollections] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState({animation: null, cost: null, id: null});
    const [animationStart, setAnimationStart] = useState(false);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const purchaseItem = async() => {
        try {
            const purchase = await api.purchaseItem({child_id: store.playingChildId.id, item_id: currentAnimation?.id, token: store.token})
            if (purchase.is_error) {
                setModal(false);
                setAnimationStart(false);
                setCurrentAnimation(null)
            } else {
                setModal(false);
                setAnimationStart(true);
                store.setPlayingChildStars(-currentAnimation?.cost);

            }
        } catch (error) {
            console.log(error)
        }
    }

    const ModalConfirm = () => {
        return (
            <Modal backdropOpacity={0.1} onBackdropPress={() => setModal(false)} isVisible={modal} style={{width: windowWidth * (268 / 800), height: Platform.isPad? windowWidth * (216 / 800) : windowHeight * (216 / 360), backgroundColor: 'white', borderRadius: 10, position: 'absolute', top: windowHeight * (40 / 360), left: windowWidth * (394 / 800), alignItems: 'center'}}>
                <Text style={{fontWeight: '600', color: '#000000', fontSize: 24, textAlign: 'center', position: 'absolute', alignSelf: 'center', top: windowHeight * (30 / 360)}}>Please Confirm</Text>
                <View style={{width: windowWidth * (63 / 800), height: windowHeight * (38 / 360), flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', alignSelf: 'center', top: windowHeight * (60 / 360)}}>
                    <Image source={star} style={{width: windowWidth * (38 / 800), height: windowHeight * (38 / 360)}}/>
                    <Text style={{color: '#000000', fontSize: windowHeight * (32 / 360), fontWeight: '600', textAlign: 'center', textAlignVertical: 'center'}}>
                        {currentAnimation?.cost}
                    </Text>
                </View>
                <View style={{width: windowWidth * (129 / 800), height: windowHeight * (53 / 360), position: 'absolute', alignSelf: 'center', bottom: windowHeight * (25 / 360), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => setModal(false)} style={{backgroundColor: '#E94343', width: windowWidth * (53 / 800), height: windowHeight * (53 / 360), borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={x} style={{width: windowWidth * (36 / 800), height: windowHeight * (32 / 360), resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => purchaseItem()} style={{backgroundColor: '#28B752', width: windowWidth * (53 / 800), height: windowHeight * (53 / 360), borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={galka} style={{width: windowWidth * (36 / 800), height: windowHeight * (32 / 360), resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    // useEffect(() => {
    //     if (store.market) return;
    //     console.log('ran')
    //     const loadMarketData = async () => {
    //       if (!store.connectionState) return;
      
    //       try {
    //         const categories = await api.getMarketCategories(store.token);
            
    //         const marketItems = await Promise.all(categories.map(async (category) => {
    //           try {
    //             const response = await api.getMarketItems({ id: category.id });
                
    //             const parsedItems = await Promise.all(response.map(async (item) => {
    //               if (item.animation) {
    //                 try {
    //                   const animationResponse = await fetch(item.animation);
    //                   const animationJson = await animationResponse.json();
    //                   return { ...item, animation: animationJson };
    //                 } catch (error) {
    //                   console.log(`Ошибка парсинга анимации для item ${item.id}:`, error);
    //                   return { ...item, animation: null };
    //                 }
    //               }
    //               return item;
    //             }));
      
    //             return { id: category.id, items: parsedItems };
    //           } catch (error) {
    //             console.log(`Ошибка загрузки элементов для категории ${category.id}:`, error);
    //             return { id: category.id, items: [] };
    //           }
    //         }));
      
    //         const updatedMarket = categories.map(category => {
    //           const categoryItems = marketItems.find(item => item.id === category.id);
    //           return categoryItems ? { ...category, items: categoryItems.items } : category;
    //         });
      
    //         store.setMarket(updatedMarket);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
      
    //     loadMarketData();
    //   }, []);

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }
            changeScreenOrientation();
        }, [])
    );

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <ImageBackground source={bgimage} style={{flex: 1}}>
                <WisyPanel setCurrentAnimation={setCurrentAnimation} modal={modal} marketCollections={marketCollections} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} animationStart={animationStart}/>
                {marketCollections != null &&
                    <MarketCollections setModal={setModal} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} activeMarket={activeMarket}/>
                }
                <Back />
                {subCollections != null && marketCollections == null? <HeaderCollection setSubCollections={setSubCollections} name={name}/> : <HeaderMenu subCollections={subCollections} marketCollections={marketCollections} setAnimationStart={setAnimationStart} setMarketCollections={setMarketCollections}/>}
                {/* {marketCollections != null && <MarketCategories currentAnimation={currentAnimation}/>} */}
                <Stars />
                <GoParent setAnimationStart={setAnimationStart} setSubCollections={setSubCollections}/>

                {marketCollections == null && <GameCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} setSubCollections={setSubCollections}/>}

                {marketCollections == null && <GamesCollections activeCategory={activeCategory} subCollections={subCollections} setSubCollections={setSubCollections} setName={setName}/>}
                {modal && <ModalConfirm />}
            </ImageBackground>
        </View>
    )
}

export default observer(GamesScreen);