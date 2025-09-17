import React, { useCallback, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import GamesList from "./Main/GamesList";
import Categories from "./Main/Categories";
import { useFocusEffect } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import MarketCollections from "./Main/Market/MarketCollections";
import MarketCategories from "./Main/Market/MarketCategories";
import HeaderCollection from "./Main/HeaderCollection";
import HeaderMenu from "./Main/HeaderMenu";
import WisyPanel from "./Main/WisyPanel";
import GoParent from "./Main/GoParent";
import Back from "./Main/Back";
import Stars from "./Main/Stars";
import { LinearGradient } from "expo-linear-gradient";
import ModalConfirm from "./Main/ModalConfirm";
import store from "../store/store";

const MainScreen = () => {

    const [activeCategory, setActiveCategory] = useState(0);
    const [activeMarket, setActiveMarket] = useState(0);
    const [marketCollections, setMarketCollections] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState({animation: null, cost: null, id: null});
    const [animationStart, setAnimationStart] = useState(false);
    const [modal, setModal] = useState(false);
    const [animation, setAnimation] = useState(null);
          
    const { height: windowHeight, width: windowWidth } = useWindowDimensions()

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }
            changeScreenOrientation();
        }, [])
    );

    const firstOpeningAction = () => {
        setAnimation(null);
        setAnimationStart(false);
        setMarketCollections(!null);
        store.resetSubCollection()
        store.setWisySpeaking(true)
    }

    return (
        <View style={{flex: 1}}>
            <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1}}>
                <WisyPanel animation={animation} setAnimation={setAnimation} setCurrentAnimation={setCurrentAnimation} modal={modal} marketCollections={marketCollections} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} animationStart={animationStart}/>
                {marketCollections != null &&
                    <MarketCollections animationStart={animationStart} setModal={setModal} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} activeMarket={activeMarket}/>
                }
                <Back />
                {store?.subCollections?.length > 0 && marketCollections == null? <HeaderCollection /> : <HeaderMenu setAnimation={setAnimation} marketCollections={marketCollections} setAnimationStart={setAnimationStart} setMarketCollections={setMarketCollections}/>}
                {/* {marketCollections != null && <MarketCategories currentAnimation={currentAnimation}/>} */}
                <View style={{top: windowHeight * (24 / 360), left: windowWidth * (653 / 800), position: 'absolute', flexDirection: 'row', gap: 7}}>
                    <Stars />
                    <GoParent setAnimationStart={setAnimationStart}/>
                </View>

                {marketCollections == null && <Categories activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>}

                {marketCollections == null && <GamesList activeCategory={activeCategory} firstOpeningAction={firstOpeningAction}/>}
                {modal && <ModalConfirm setCurrentAnimation={setCurrentAnimation} setAnimationStart={setAnimationStart} setModal={setModal} modal={modal} currentAnimation={currentAnimation} setAnimation={setAnimation} />}
            </LinearGradient>
        </View>
    )
}

export default observer(MainScreen);