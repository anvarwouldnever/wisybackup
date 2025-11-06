import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { gameStore } from "../Games/store/gameStore";
import { observer } from "mobx-react-lite";
import { playSound } from "../../hooks/usePlaySound";
import LottieView from "lottie-react-native";
import loadingAnim from '../../../assets/loading.json';
import md5 from 'react-native-md5';
import Collections from "./GamesList/Collections";
import SubCollections from "./GamesList/SubCollections";
import store from "../../store/store";
import { GetSpeeches } from "../../api/methods/speeches/speech";
import { useScale } from "../../hooks/utils/useScale";

const GamesList = ({ firstOpeningAction }) => {

    const { s, vs } = useScale()

    const [wasAnimated, setWasAnimated] = useState(false);

    const hasTriggered = useRef(false);

    const playSpeech = useCallback(async (speechKey) => {
        if (store.isFirstOpening) return
        if (store.wisySpeaking) return
        try {
            await playSound.stop();
            store.setWisySpeaking(true);
            
            const response = await GetSpeeches(speechKey);
            if (response.data?.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data?.data.length);
                store.setWisyMenuText(response.data?.data[randomIndex]?.text);
                await playSound(response.data?.data[randomIndex]?.audio);
            }
        } catch (error) {
            console.log(error);
        } finally {
            store.setWisySpeaking(false);
        }
    }, [store.setWisyMenuText, store.setWisySpeaking]);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (hasTriggered.current) return;

        const visibleLoadingItem = viewableItems.find(({ item }) => item?.isLoading);

        if (visibleLoadingItem) {
            const currentCategory = gameStore.categories.find(item => item.id === gameStore.categoryId);
            const currentCollection = currentCategory?.collections.find(col => col.id === gameStore.collectionId);

            const collectionId = currentCollection?.id;
            const categoryId = currentCategory?.id;

            if (collectionId && categoryId) {
                hasTriggered.current = true;

                gameStore.getAndProcessSubCollections({ collectionId, categoryId })
                    .finally(() => {
                        hasTriggered.current = false;
                    });
            }
        }
    }, [gameStore.categoryId, gameStore.collectionId]);

    const handleGameCompletion = (id, starId, earnedStars) => {
        console.log('run handleGameCompletion')
        const subCollection = gameStore.subCollections.find(sub => sub?.id === starId);
        if (subCollection) {
            subCollection.stars.earned += earnedStars;
        }

        console.log(id, gameStore.collectionId)
    
        gameStore.completeGame(gameStore.categoryId, id, starId, earnedStars, gameStore.collectionId);
    };
    
    const handleTaskCompletion = useCallback((id, nextTaskId) => {
        console.log('run handleTaskCompletion')
        const collection = gameStore.subCollections.find(item => item.id === id);
    
        if (collection) {
            collection.current_task_id = nextTaskId !== null ? nextTaskId : collection.tasks[0]?.id;
        }
    
        gameStore.completeTask(gameStore.categoryId, gameStore.collectionId, id, nextTaskId);
    }, [gameStore.categoryId, gameStore.collectionId]);

    const collections = gameStore.categories?.find(item => item?.id === gameStore.categoryId)?.collections;
    const availableSubCollections = collections?.find(col => col?.id === gameStore.collectionId)?.available_sub_collections || [];

    useEffect(() => {
        if (store.isFirstOpening && collections?.length > 0) {
            const firstItem = collections[0];
            gameStore.enqueueGetAndProcessSubCollections({collectionId: firstItem?.id, categoryId: firstItem?.category?.id});
            gameStore.setCollectionId(firstItem.id);
            gameStore.setCollectionName(firstItem.name);
        }
    }, [store.isFirstOpening, collections]);

    const listData = gameStore.subCollections?.length > 0 ? gameStore.subCollections : collections;

    const renderItem = useMemo(() => {
        return ({ item, index }) => {
            if (item?.isLoader) {
                return (
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                        <ActivityIndicator size="small" color="#888" />
                    </View>
                );
            }
    
            const shouldRenderSub = gameStore?.subCollections?.length > 0;
    
            return shouldRenderSub ? (
                <SubCollections firstOpeningAction={firstOpeningAction} item={item} index={index} onComplete={handleGameCompletion} onCompleteTask={handleTaskCompletion} availableSubCollections={availableSubCollections} setWasAnimated={setWasAnimated} wasAnimated={wasAnimated} playSpeech={playSpeech}/>
            ) : (
                <Collections item={item} index={index} playSpeech={playSpeech} />
            );
        };
    }, [ gameStore.subCollections?.length, store.isFirstOpening ? store.wisySpeaking : null, store.isFirstOpening, availableSubCollections, wasAnimated ]);
    
    return (
        <View style={{ width: '62%', height: 'auto', position: 'absolute', top: vs(230), right: 0, justifyContent: 'center', overflow: 'visible'}}>
            {gameStore.isSubCollectionsLoading || gameStore.isCollectionLoading? 
                <LottieView
                    loop={true}
                    autoPlay
                    source={loadingAnim}
                    style={{width: s(25), height: s(30), top: vs(110), position: 'absolute', alignSelf: 'center'}}
                />
            :
                <FlatList
                    horizontal
                    data={listData}
                    extraData={[gameStore.categories, gameStore.subCollections?.length]}
                    renderItem={renderItem}
                    keyExtractor={(item) => md5.hex_md5(`${item?.id}_${item?.image}`)}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    removeClippedSubviews
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                    contentContainerStyle={{ columnGap: vs(20), paddingRight: s(20) }}
                />
            }
        </View>
    );
}

export default observer(GamesList);