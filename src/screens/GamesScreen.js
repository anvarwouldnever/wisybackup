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
import { LinearGradient } from "expo-linear-gradient";
import ModalConfirm from "./GamesScreen/ModalConfirm";

const GamesScreen = () => {

    const [activeCategory, setActiveCategory] = useState(0);
    const [subCollections, setSubCollections] = useState(null);
    const [activeMarket, setActiveMarket] = useState(0);
    const [marketCollections, setMarketCollections] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState({animation: null, cost: null, id: null});
    const [animationStart, setAnimationStart] = useState(false);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');
    const [text, setText] = useState(null);

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
            <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1}}>
                <WisyPanel setText={setText} text={text} setCurrentAnimation={setCurrentAnimation} modal={modal} marketCollections={marketCollections} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} animationStart={animationStart}/>
                {marketCollections != null &&
                    <MarketCollections setModal={setModal} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} activeMarket={activeMarket}/>
                }
                <Back />
                {subCollections != null && marketCollections == null? <HeaderCollection setText={setText} setSubCollections={setSubCollections} name={name}/> : <HeaderMenu subCollections={subCollections} marketCollections={marketCollections} setAnimationStart={setAnimationStart} setMarketCollections={setMarketCollections}/>}
                {/* {marketCollections != null && <MarketCategories currentAnimation={currentAnimation}/>} */}
                <Stars />
                <GoParent setAnimationStart={setAnimationStart} setSubCollections={setSubCollections}/>

                {marketCollections == null && <GameCategories setText={setText} activeCategory={activeCategory} setActiveCategory={setActiveCategory} setSubCollections={setSubCollections}/>}

                {marketCollections == null && <GamesCollections setText={setText} activeCategory={activeCategory} subCollections={subCollections} setSubCollections={setSubCollections} setName={setName}/>}
                {modal && <ModalConfirm setAnimationStart={setAnimationStart} setModal={setModal} modal={modal} currentAnimation={currentAnimation}/>}
            </LinearGradient>
        </View>
    )
}

export default observer(GamesScreen);