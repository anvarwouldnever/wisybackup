import React, { useCallback, useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
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
    const [wisySpeaking, setWisySpeaking] = useState(false);

    const { height: windowHeight, width: windowWidth } = Dimensions.get('screen');

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }
            changeScreenOrientation();
        }, [])
    );

    return (
        <View style={{flex: 1, backgroundColor: 'black'}}>
            <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1}}>
                <WisyPanel wisySpeaking={wisySpeaking} setWisySpeaking={setWisySpeaking} setText={setText} text={text} setCurrentAnimation={setCurrentAnimation} modal={modal} marketCollections={marketCollections} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} animationStart={animationStart}/>
                {marketCollections != null &&
                    <MarketCollections wisySpeaking={wisySpeaking} setWisySpeaking={setWisySpeaking} setModal={setModal} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} activeMarket={activeMarket}/>
                }
                <Back />
                {subCollections != null && marketCollections == null? <HeaderCollection wisySpeaking={wisySpeaking} setWisySpeaking={setWisySpeaking} setText={setText} setSubCollections={setSubCollections} name={name}/> : <HeaderMenu wisySpeaking={wisySpeaking} setWisySpeaking={setWisySpeaking} subCollections={subCollections} marketCollections={marketCollections} setAnimationStart={setAnimationStart} setMarketCollections={setMarketCollections}/>}
                {/* {marketCollections != null && <MarketCategories currentAnimation={currentAnimation}/>} */}
                <View style={{top: windowHeight * (24 / 360), left: windowWidth * (653 / 800), position: 'absolute', flexDirection: 'row', gap: 7}}>
                    <Stars />
                    <GoParent setAnimationStart={setAnimationStart} setSubCollections={setSubCollections}/>
                </View>

                {marketCollections == null && <GameCategories wisySpeaking={wisySpeaking} setWisySpeaking={setWisySpeaking} setText={setText} activeCategory={activeCategory} setActiveCategory={setActiveCategory} setSubCollections={setSubCollections}/>}

                {marketCollections == null && <GamesCollections wisySpeaking={wisySpeaking} setWisySpeaking={setWisySpeaking} setText={setText} activeCategory={activeCategory} subCollections={subCollections} setSubCollections={setSubCollections} setName={setName}/>}
                {modal && <ModalConfirm setAnimationStart={setAnimationStart} setModal={setModal} modal={modal} currentAnimation={currentAnimation}/>}
            </LinearGradient>
        </View>
    )
}

export default observer(GamesScreen);