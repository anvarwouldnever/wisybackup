import React, { useState } from "react";
import { View } from "react-native";
import GamesList from "./Main/GamesList";
import Categories from "./Main/Categories";
import { observer } from "mobx-react-lite";
import MarketCollections from "./Main/Market/MarketCollections";
import HeaderCollection from "./Main/HeaderCollection";
import HeaderMenu from "./Main/HeaderMenu";
import WisyPanel from "./Main/WisyPanel";
import GoParent from "./Main/GoParent";
import Stars from "./Main/Stars";
import { LinearGradient } from "expo-linear-gradient";
import ModalConfirm from "./Main/ModalConfirm";
import store from "../store/store";
import { gameStore } from "./Games/store/gameStore";
import { useScale } from "../hooks/utils/useScale";
import useLockLandscape from "../hooks/utils/useLockLandscape";
import { getLabels } from "./Welcome/hooks/getLabels";

const MainScreen = () => {

    const [activeMarket, setActiveMarket] = useState(0);
    const [marketCollections, setMarketCollections] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState({ animation: null, cost: null, id: null});
    const [animationStart, setAnimationStart] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [animation, setAnimation] = useState(null);
    const [isFrozen, setIsFrozen] = useState<boolean>(false);

    const { s, vs, isTablet } = useScale();                                              

    const firstOpeningAction = () => {
        setAnimation(null);
        setAnimationStart(false);
        setMarketCollections(!null);
        gameStore.resetSubCollection();
        store.setWisySpeaking(true);
    }

    const { labels } = getLabels();

    // console.log(labels)

    useLockLandscape();

    if (isFrozen) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
        )
    }

    // console.log(store.playingChildId)

    return (
        <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{ flex: 1 }}>

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

                    <GoParent setIsFrozen={setIsFrozen} setAnimationStart={setAnimationStart}/>

                </View>

            </View>

            {marketCollections == null && 
                <Categories />
            }

            {marketCollections == null && 
                <GamesList firstOpeningAction={firstOpeningAction}/>
            }

            { modal && 
                <ModalConfirm labels={labels} setCurrentAnimation={setCurrentAnimation} setAnimationStart={setAnimationStart} setModal={setModal} modal={modal} currentAnimation={currentAnimation} />
            }
        
        </LinearGradient>
    )
}

export default observer(MainScreen);

