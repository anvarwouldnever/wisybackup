import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FlatList, useWindowDimensions, Text, Platform, TouchableOpacity, Image, View, ActivityIndicator, StyleSheet } from "react-native";
import store from "../store/store";
import { SvgUri } from "react-native-svg";
import Animated, { FadeInRight, Easing } from "react-native-reanimated";
import star from '../images/tabler_star-filled.png';
import { BlurView } from 'expo-blur';
import lock from '../images/zamok.png';
import filledStar from '../images/filledStar.png';
import emptyStar from '../images/emptyStar.png';
import { observer } from "mobx-react-lite";
import api from "../api/api";
import { playSound } from "../hooks/usePlayBase64Audio";
import LottieView from "lottie-react-native";
import loadingAnim from '../../assets/6Vcbuw6I0c (1).json';
import md5 from 'react-native-md5';
import Blur from "./BlurView";
import Ionicons from '@expo/vector-icons/Ionicons';

const GamesCollections = ({ setName, activeCategory }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const [collectionIndex, setCollectionIndex] = useState(0);
    const navigation = useNavigation();

    const playSpeech = useCallback(async (speechKey) => {
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
    
    const func = () => {
        if (store.wisySpeaking) return
        playSpeech('enter_subcollections_screen');
    }

    const func3 = () => {
        if (store.wisySpeaking) return
        playSpeech('locked_subcollection_attempt')
    }

    const hasTriggered = useRef(false);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (hasTriggered.current) return;

        const visibleLoadingItem = viewableItems.find(({ item }) => item?.isLoading);

        if (visibleLoadingItem) {
            const currentCategory = store.categories.find(item => item.id === activeCategory);
            const currentCollection = currentCategory?.collections.find(col => col.id === collectionIndex);

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
    }, [activeCategory, collectionIndex]);

    // console.log(store.subCollections.map(({ intro_speech_audio, ...rest }) => rest));

    const handleGameCompletion = (id, starId, earnedStars) => {
        const subCollection = store.subCollections.find(sub => sub?.id === starId);
        if (subCollection) {
            subCollection.stars.earned += earnedStars;
        }
    
        store.completeGame(activeCategory, id, starId, earnedStars, collectionIndex);
    };
    
    const handleTaskCompletion = useCallback((id, nextTaskId) => {
        const collection = store.subCollections.find(item => item.id === id);
    
        if (collection) {
            collection.current_task_id = nextTaskId !== null ? nextTaskId : collection.tasks[0]?.id;
        }
    
        store.completeTask(activeCategory, collectionIndex, id, nextTaskId);
    }, [activeCategory, collectionIndex]);

    const getSubCollections = async(collectionId, categoryId) => {
        try {
            await store.enqueueGetAndProcessSubCollections({ collectionId: collectionId, categoryId: categoryId })
        } catch (error) {
            console.log(error)
        }
    };
     
    const renderCollections = ({ item, index }) => {
        const isPad = Platform.isPad;
        const windowWidthFactor = isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360);
        const windowHeightFactor = isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360);
        const textFontSize = isPad ? windowWidth * (20 / 1194) : windowHeight * (12 / 360);
        const imageWidth = isPad ? windowWidth * (256 / 1194) : windowWidth * (135 / 800);
        const imageHeight = isPad ? windowWidth * (224 / 1194) : windowHeight * (82 / 360);
        const bottomSpacing = isPad ? windowHeight * (76 / 834) : windowHeight * (35 / 360);
    
        return (
            <Animated.View entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))} style={{ width: 'auto', height: 'auto' }}>
                <TouchableOpacity 
                    onPress={() => {
                        try {
                            getSubCollections(item?.id, item?.category?.id);
                            setCollectionIndex(item.id);
                            setName(item.name);
                            func();
                        } catch (error) {
                            console.log('Ошибка в onPress:', error);
                        }
                    }}
                    style={{
                        backgroundColor: 'white', 
                        borderRadius: 12, 
                        width: windowWidthFactor, 
                        height: windowHeightFactor, 
                        marginRight: 20, 
                        borderWidth: 1, 
                        borderColor: '#FFFFFF1F'
                    }}
                >
                    <Text style={{
                        fontWeight: '600', 
                        fontSize: textFontSize, 
                        textAlign: 'center', 
                        width: '100%', 
                        height: 'auto', 
                        color: 'black', 
                        position: 'absolute', 
                        top: isPad ? windowHeight * (12 / 360) : 12
                    }}>
                        {item.name}
                    </Text>
                    <View style={{ width: '100%', position: 'absolute', borderColor: 'white', borderWidth: 1, opacity: 0.12, top: 35 }} />
                    <Image 
                        source={{ uri: item.image.url }} 
                        style={{
                            width: imageWidth, 
                            height: imageHeight, 
                            alignSelf: 'center', 
                            position: 'absolute', 
                            top: isPad ? windowHeight * (70 / 800) : windowHeight * (35 / 360), 
                            resizeMode: 'contain'
                        }} 
                        resizeMode='contain' 
                        resizeMethod='scale' 
                    />
                    <View style={{ width: '100%', position: 'absolute', borderColor: 'white', borderWidth: 1, opacity: 0.12, bottom: 40 }} />
                    <View 
                        style={{
                            width: '100%', 
                            height: bottomSpacing, 
                            bottom: 0, 
                            position: 'absolute', 
                            alignItems: 'center', 
                            flexDirection: 'row', 
                            alignSelf: 'center', 
                            justifyContent: 'center'
                        }}
                    >
                        <View 
                            style={{
                                width: windowWidth * (53 / 800), 
                                height: windowHeight * (20 / 360), 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between'
                            }}
                        >
                            <Image 
                                source={star} 
                                style={{
                                    width: windowWidth * (14 / 800), 
                                    height: windowHeight * (14 / 360)
                                }} 
                                resizeMode='contain' 
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{
                                    fontWeight: '600', 
                                    fontSize: windowWidth * (12 / 800), 
                                    color: 'black'
                                }}>
                                    {item.stars.earned} 
                                </Text>
                                <Text style={{
                                    fontWeight: '600', 
                                    fontSize: windowWidth * (12 / 800), 
                                    color: '#B4B4B4'
                                }}>
                                    / {item.stars.total}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {index > 1 && (
                        <BlurView 
                            intensity={10} 
                            tint="light" 
                            style={{
                                flex: 1, 
                                borderRadius: 12, 
                                overflow: 'hidden', 
                                justifyContent: 'center', 
                                alignItems: 'center'
                            }}
                        >
                            <Ionicons name='lock-closed' size={24} color={'#504297'}/>
                        </BlurView>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const collections = store.categories.find(item => item.id === activeCategory)?.collections
    const availableSubCollections = collections?.find(col => col.id === collectionIndex)?.available_sub_collections || [];

    const currentCategory = store.categories.find(item => item.id === activeCategory)
    const categoryId = currentCategory?.id
    const collectionId = currentCategory?.collections?.find(col => col.id === collectionIndex)?.id

    const RenderAttributes = ({ attributes }) => {
        return (
          <View style={{
            width: '100%',
            height: windowHeight * (35 / 360),
            bottom: 0,
            position: 'absolute',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'center',
            borderRadius: 10
          }}>
            {attributes && attributes.length > 0 && attributes.slice(0, 4).map((attribute, index) => {
              const isSvg = typeof attribute?.image === 'string' && attribute?.image.endsWith('.svg');
              return isSvg ? (
                <SvgUri
                  key={index}
                  uri={attribute.image}
                  width={windowWidth * (24 / 800)}
                  height={windowHeight * (24 / 360)}
                  style={{ marginHorizontal: 5, backgroundColor: attribute.group.color, borderRadius: 5 }}
                />
              ) : (
                <Image
                  key={index}
                  source={{ uri: attribute.image }}
                  style={{
                    resizeMode: 'contain',
                    width: windowWidth * (24 / 800),
                    height: windowHeight * (24 / 360),
                    marginHorizontal: 5,
                    backgroundColor: attribute.group.color
                  }}
                />
              );
            })}
          </View>
        );
    };
      
    const RenderStars = ({ earned, total }) => {
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: Platform.isPad ? 8 : 8 }}>
            {[...Array(total)].map((_, index) => {
              const starImage = index < earned ? filledStar : emptyStar;
              return (
                <Image
                  key={index}
                  source={starImage}
                  style={{
                    width: Platform.isPad ? windowWidth * (22 / 800) : windowWidth * (16 / 800),
                    height: Platform.isPad ? windowHeight * (22 / 360) : windowHeight * (16 / 360),
                    marginHorizontal: 2,
                    resizeMode: 'contain'
                  }}
                />
              );
            })}
          </View>
        );
    };

    const renderSubCollections = ({ item, onComplete, onCompleteTask }) => {

        if (item?.isLoading) {
            return (
                <View
                    style={{
                        backgroundColor: '#D8F6FF33',
                        borderRadius: 12,
                        width: Platform.isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360),
                        height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360),
                        marginRight: 20,
                        borderWidth: 1,
                        borderColor: '#FFFFFF1F',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size='large' color="#504297" />
                </View>
            );
        }

        return (
            <Animated.View
                entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))}
                style={{ width: 'auto', height: 'auto'}}
                >
                <View style={{ position: 'relative'}}>
                    <TouchableOpacity
                        onPress={() => {
                            store.prepareTasksArray(item.id);
                            navigation.navigate('GameScreen', {
                            breaks: item?.breaks,
                            isFromBreak: item?.isBreak,
                            categoryId,
                            collectionId,
                            onComplete,
                            onCompleteTask,
                            });
                        }}
                        style={{
                            backgroundColor: '#D8F6FF33',
                            borderRadius: 12,
                            width: Platform.isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360),
                            height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360),
                            marginRight: 20,
                            borderWidth: 1,
                            borderColor: '#FFFFFF1F',
                            flexDirection: 'column',
                            overflow: 'hidden', // чтобы блюр не вылазил за края
                        }}
                    >
                    {!item?.isBreak && <RenderStars earned={item?.stars?.earned} total={item?.stars?.total} />}
                    <View
                        style={{
                        width: '100%',
                        position: 'absolute',
                        borderColor: 'white',
                        borderWidth: 1,
                        opacity: 0.12,
                        top: Platform.isPad ? windowHeight * (60 / 800) : 35,
                        }}
                    />
                    {typeof item?.image === 'string' && !item.image.endsWith('.svg') ? (
                        <Image
                            source={{ uri: item?.image }}
                            style={{
                                width: Platform.isPad ? windowWidth * (256 / 1194) : windowWidth * (135 / 800),
                                height: Platform.isPad ? windowWidth * (224 / 1194) : windowHeight * (82 / 360),
                                alignSelf: 'center',
                                resizeMode: 'contain',
                                position: 'absolute',
                                top: Platform.isPad ? windowHeight * (90 / 800) : windowHeight * (35 / 360),
                            }}
                        />
                    ) : (
                        <SvgUri
                            uri={item?.image}
                            width={Platform.isPad ? windowWidth * (256 / 1194) : windowWidth * (135 / 800)}
                            height={Platform.isPad ? windowWidth * (224 / 1194) : windowHeight * (82 / 360)}
                            style={{
                                alignSelf: 'center',
                                position: 'absolute',
                                top: Platform.isPad ? windowHeight * (90 / 800) : windowHeight * (35 / 360),
                            }}
                        />
                    )}
                    <View
                        style={{
                        width: '100%',
                        position: 'absolute',
                        borderColor: 'white',
                        borderWidth: 1,
                        opacity: 0.12,
                        bottom: Platform.isPad ? windowHeight * (30 / 360) : 40,
                        }}
                    />
                    <View
                        style={{
                        width: '100%',
                        height: windowHeight * (35 / 360),
                        bottom: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        }}
                    >
                        <RenderAttributes attributes={item?.attributes} />
                    </View>
                    </TouchableOpacity>

                    {/* Blur накладывается поверх, если надо */}
                    <Blur itemId={item?.id} categoryId={categoryId} collectionId={collectionId} />
                </View>
            </Animated.View>
        )
    }

    const listData = store.subCollections.length > 0
    ? store.subCollections
    : collections;

    const MemoizedRenderCollections = renderCollections;
    const MemoizedRenderSubCollections = renderSubCollections;
    
    const renderItem = useMemo(() => ({ item, index }) => {
        if (item.isLoader) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                    <ActivityIndicator size="small" color="#888" />
                </View>
            );
        }
    
        if (store.subCollections.length > 0) {
            return (
                <MemoizedRenderSubCollections
                    item={item}
                    index={index}
                    onComplete={handleGameCompletion}
                    onCompleteTask={handleTaskCompletion}
                />
            );
        }
    
        return <MemoizedRenderCollections item={item} index={index} />;
    }, [store.subCollections.length, availableSubCollections]);
    
    return (
        <View style={{
            width: windowWidth * (480 / 800),
            height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360),
            position: 'absolute',
            top: Platform.isPad ? windowHeight * (224 / 834) : windowHeight * (104 / 360),
            left: windowWidth * (320 / 800),
            justifyContent: 'center',
        }}>
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
                extraData={[store.categories, store.subCollections.length]}
                renderItem={renderItem}
                keyExtractor={(item) => md5.hex_md5(`${item?.id}_${item?.image}`)}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                removeClippedSubviews
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
            />}
        </View>
    );
}

export default observer(GamesCollections);