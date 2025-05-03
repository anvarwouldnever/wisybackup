import React, { useCallback, useState, useEffect } from "react";
import { View, Dimensions, useWindowDimensions } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";
import ModalConfirm from "./GamesScreen/ModalConfirm";
import store from "../store/store";

const GamesScreen = () => {

    const [activeCategory, setActiveCategory] = useState(0);
    const [activeMarket, setActiveMarket] = useState(0);
    const [marketCollections, setMarketCollections] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState({animation: null, cost: null, id: null});
    const [animationStart, setAnimationStart] = useState(false);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');
                                    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions()

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }
            changeScreenOrientation();
        }, [])
    );

    return (
        <View style={{flex: 1}}>
            <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1}}>
                <WisyPanel setCurrentAnimation={setCurrentAnimation} modal={modal} marketCollections={marketCollections} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} animationStart={animationStart}/>
                {marketCollections != null &&
                    <MarketCollections setModal={setModal} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} activeMarket={activeMarket}/>
                }
                <Back />
                {store?.subCollections?.length > 0 && marketCollections == null? <HeaderCollection name={name}/> : <HeaderMenu marketCollections={marketCollections} setAnimationStart={setAnimationStart} setMarketCollections={setMarketCollections}/>}
                {/* {marketCollections != null && <MarketCategories currentAnimation={currentAnimation}/>} */}
                <View style={{top: windowHeight * (24 / 360), left: windowWidth * (653 / 800), position: 'absolute', flexDirection: 'row', gap: 7}}>
                    <Stars />
                    <GoParent setAnimationStart={setAnimationStart}/>
                </View>

                {marketCollections == null && <GameCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>}

                {marketCollections == null && <GamesCollections activeCategory={activeCategory} setName={setName}/>}
                {modal && <ModalConfirm setAnimationStart={setAnimationStart} setModal={setModal} modal={modal} currentAnimation={currentAnimation}/>}
            </LinearGradient>
        </View>
    )
}

export default observer(GamesScreen);