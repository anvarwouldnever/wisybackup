import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FlatList, useWindowDimensions, Platform, View, ActivityIndicator } from "react-native";
import store from "../../store/store";
import { observer } from "mobx-react-lite";
import api from "../../api/api";
import { playSound } from "../../hooks/usePlayBase64Audio";
import LottieView from "lottie-react-native";
import loadingAnim from '../../../assets/6Vcbuw6I0c (1).json';
import md5 from 'react-native-md5';
import Collections from "./GamesList/Collections";
import SubCollections from "./GamesList/SubCollections";

const GamesList = ({ activeCategory, firstOpeningAction }) => {
    
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const [wasAnimated, setWasAnimated] = useState(false);

    const hasTriggered = useRef(false);

    const playSpeech = useCallback(async (speechKey) => {
        if (store.isFirstOpening) return
        try {
            await playSound.stop();
            store.setWisySpeaking(true);
            
            const sound = await api.getSpeech(speechKey, store.language);
            if (sound.length > 0) {
                const randomIndex = Math.floor(Math.random() * sound.length);
                store.setWisyMenuText(sound[randomIndex]?.text);
                await playSound(sound[randomIndex]?.audio);
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
            const currentCategory = store.categories.find(item => item.id === activeCategory);
            const currentCollection = currentCategory?.collections.find(col => col.id === store.collectionId);

            const collectionId = currentCollection?.id;
            const categoryId = currentCategory?.id;

            if (collectionId && categoryId) {
                hasTriggered.current = true;

                store.getAndProcessSubCollections({ collectionId, categoryId })
                    .finally(() => {
                        hasTriggered.current = false;
                    });
            }
        }
    }, [activeCategory, store.collectionId]);

    const handleGameCompletion = (id, starId, earnedStars) => {
        console.log('run handleGameCompletion')
        const subCollection = store.subCollections.find(sub => sub?.id === starId);
        if (subCollection) {
            subCollection.stars.earned += earnedStars;
        }

        console.log(id, store.collectionId)
    
        store.completeGame(activeCategory, id, starId, earnedStars, store.collectionId);
    };
    
    const handleTaskCompletion = useCallback((id, nextTaskId) => {
        console.log('run handleTaskCompletion')
        const collection = store.subCollections.find(item => item.id === id);
    
        if (collection) {
            collection.current_task_id = nextTaskId !== null ? nextTaskId : collection.tasks[0]?.id;
        }
    
        store.completeTask(activeCategory, store.collectionId, id, nextTaskId);
    }, [activeCategory, store.collectionId]);

    const collections = store.categories.find(item => item.id === activeCategory)?.collections;
    const availableSubCollections = collections?.find(col => col?.id === store.collectionId)?.available_sub_collections || [];

    useEffect(() => {
        if (store.isFirstOpening && collections?.length > 0) {
            const firstItem = collections[0];
            store.enqueueGetAndProcessSubCollections({collectionId: firstItem?.id, categoryId: firstItem?.category?.id});
            store.setCollectionId(firstItem.id);
            store.setCollectionName(firstItem.name);
        }
    }, [store.isFirstOpening, collections]);

    const listData = store.subCollections?.length > 0 ? store?.subCollections : collections;
    
    const renderItem = useMemo(() => {
        return ({ item, index }) => {
            if (item?.isLoader) {
                return (
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                        <ActivityIndicator size="small" color="#888" />
                    </View>
                );
            }
    
            const shouldRenderSub = store?.subCollections?.length > 0;
    
            return shouldRenderSub ? (
                <SubCollections firstOpeningAction={firstOpeningAction} item={item} index={index} onComplete={handleGameCompletion} onCompleteTask={handleTaskCompletion} availableSubCollections={availableSubCollections} setWasAnimated={setWasAnimated} activeCategory={activeCategory} wasAnimated={wasAnimated} playSpeech={playSpeech}/>
            ) : (
                <Collections item={item} index={index} playSpeech={playSpeech} />
            );
        };
    }, [ store.subCollections?.length, store.isFirstOpening ? store.wisySpeaking : null, store.isFirstOpening, availableSubCollections, wasAnimated ]);
    
    return (
        <View style={{ width: windowWidth * (480 / 800), height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (180 / 360), position: 'absolute', top: Platform.isPad ? windowHeight * (224 / 834) : windowHeight * (104 / 360), left: windowWidth * (320 / 800), justifyContent: 'center', overflow: 'visible'}}>
            {store.isSubCollectionsLoading || store.isCollectionLoading? 
                <LottieView
                        loop={true}
                        autoPlay
                        source={loadingAnim}
                        style={{width: windowWidth * (50 / 800), height: windowHeight * (50 / 360), position: 'absolute', alignSelf: 'center'}}
                />
            :
                <FlatList
                    horizontal
                    data={listData}
                    extraData={[store.categories, store.subCollections?.length]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => md5.hex_md5(`${item?.id}_${item?.image}`)}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    removeClippedSubviews
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                />
            }
        </View>
    );
}

export default observer(GamesList);