import React, { useCallback, useState } from "react";
import { View } from "react-native";
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
import Stars from "./Main/Stars";
import { LinearGradient } from "expo-linear-gradient";
import ModalConfirm from "./Main/ModalConfirm";
import store from "../store/store";
import { gameStore } from "./Games/store/gameStore";
import { useScale } from "../hooks/useScale";

const MainScreen = () => {
    
    const [activeMarket, setActiveMarket] = useState(0);
    const [marketCollections, setMarketCollections] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState({animation: null, cost: null, id: null});
    const [animationStart, setAnimationStart] = useState(false);
    const [modal, setModal] = useState(false);
    const [animation, setAnimation] = useState(null);

    useFocusEffect(
        useCallback(() => {
            async function changeScreenOrientation() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            }
            changeScreenOrientation();
        }, [])
    );

    const { s, vs, isTablet } = useScale()

    const firstOpeningAction = () => {
        setAnimation(null);
        setAnimationStart(false);
        setMarketCollections(!null);
        gameStore.resetSubCollection()
        store.setWisySpeaking(true)
    }

    return (
        <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1}}>
                
            <WisyPanel animation={animation} setAnimation={setAnimation} setCurrentAnimation={setCurrentAnimation} modal={modal} marketCollections={marketCollections} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} animationStart={animationStart}/>
            
            {marketCollections != null &&
                <MarketCollections animationStart={animationStart} setModal={setModal} setAnimationStart={setAnimationStart} currentAnimation={currentAnimation} setCurrentAnimation={setCurrentAnimation} activeMarket={activeMarket}/>
            }
            
            <View style={{top: vs(50), right: 0, position: 'absolute', width: '62%', justifyContent: 'space-between', flexDirection: 'row', height: s(26), paddingRight: s(10)}}>
                
                {gameStore?.subCollections?.length > 0 && marketCollections == null? 
                    <HeaderCollection /> 
                : 
                    <HeaderMenu setAnimation={setAnimation} marketCollections={marketCollections} setAnimationStart={setAnimationStart} setMarketCollections={setMarketCollections}/>
                }
                
                <View style={{ columnGap: vs(12), flexDirection: 'row', alignItems: 'center' }}>
                    
                    <Stars />

                    <GoParent setAnimationStart={setAnimationStart}/>

                </View>

            </View>

            {marketCollections == null && 
                <Categories />
            }

            {marketCollections == null && 
                <GamesList firstOpeningAction={firstOpeningAction}/>
            }
            
            { modal && 
                <ModalConfirm setCurrentAnimation={setCurrentAnimation} setAnimationStart={setAnimationStart} setModal={setModal} modal={modal} currentAnimation={currentAnimation} setAnimation={setAnimation} />
            }
        
        </LinearGradient>
    )
}

export default observer(MainScreen);