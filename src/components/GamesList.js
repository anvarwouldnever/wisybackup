import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, useWindowDimensions, Text, Platform, TouchableOpacity, Image, View } from "react-native";
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
import md5 from 'react-native-md5';
import LottieView from "lottie-react-native";
import loadingAnim from '../../assets/6Vcbuw6I0c (1).json';
import { playSoundWithoutStopping } from "../hooks/usePlayWithoutStoppingBackgrounds";

const GamesCollections = ({ setSubCollections, subCollections, setName, activeCategory }) => {

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

    const collections = store.categories[activeCategory]?.collections
    const availableSubCollections = collections? collections[collectionIndex]?.available_sub_collections : [];

    const handleGameCompletion = useCallback((id, starId, earnedStars) => {
        const subCollection = subCollections.find(sub => sub?.id === starId);
        if (subCollection) {
            subCollection.stars.earned += earnedStars;
        }
    
        store.completeGame(activeCategory, id, starId, earnedStars, collectionIndex);
    }, [subCollections, activeCategory, collectionIndex, store]);
    
    const handleTaskCompletion = useCallback((id, nextTaskId) => {
        const collection = subCollections.find(item => item.id === id);
    
        if (collection) {
            collection.current_task_id = nextTaskId !== null ? nextTaskId : collection.tasks[0]?.id;
        }
    
        store.completeTask(activeCategory, collectionIndex, id, nextTaskId);
    }, [subCollections, activeCategory, collectionIndex, store]);

    const renderCollections = ({ item, index }) => {
        // Вычисления для платформы
        const isPad = Platform.isPad;
        const windowWidthFactor = isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360);
        const windowHeightFactor = isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360);
        const textFontSize = isPad ? windowWidth * (20 / 1194) : windowHeight * (12 / 360);
        const imageWidth = isPad ? windowWidth * (256 / 1194) : windowWidth * (135 / 800);
        const imageHeight = isPad ? windowWidth * (224 / 1194) : windowHeight * (82 / 360);
        const bottomSpacing = isPad ? windowHeight * (76 / 834) : windowHeight * (35 / 360);
    
        const arr = () => {
            const { sub_collections, breaks } = item;
            let updatedSubCollections = [...sub_collections];
    
            const sortedBreaks = [...breaks]
                .filter(b => !b.is_hidden)
                .sort((a, b) => b.order - a.order);
    
            sortedBreaks.forEach(breakItem => {
                const insertIndex = updatedSubCollections.findIndex(
                    el => el.order_column >= breakItem.order
                );
    
                const targetId = insertIndex !== -1 ? updatedSubCollections[insertIndex].id : breakItem.id;
    
                updatedSubCollections = [
                    ...updatedSubCollections.slice(0, insertIndex + 1),
                    { ...breakItem, isBreak: true, id: targetId },
                    ...updatedSubCollections.slice(insertIndex + 1),
                ];
            });
    
            return updatedSubCollections.map(sub => ({
                ...sub,
                breaks: item.breaks, // Добавляем breaks внутрь каждого sub
            }));
        };
    
        return (
            <Animated.View entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))} style={{ width: 'auto', height: 'auto' }}>
                <TouchableOpacity 
                    onPress={() => {
                        setCollectionIndex(index);
                        const subs = arr();
                        setSubCollections(subs);
                        setName(item.name);
                        func();
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
                            <Image 
                                source={lock} 
                                style={{
                                    width: windowWidth * (24 / 800), 
                                    height: windowHeight * (24 / 360)
                                }} 
                                resizeMode='contain' 
                            />
                        </BlurView>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };
    
    const renderSubCollections = ({ item, onComplete, onCompleteTask }) => {

        const { image } = item;
        const isSvg = typeof image === 'string' && image.endsWith('.svg');

        const task = availableSubCollections?.includes(item.id) ? item.id : null;

        const prepareTasksArray = useCallback((itemId) => {
            const tasksArray = subCollections
                .filter(item => item.tasks?.length > 0)
                .map(item => {
                    const currentTaskIndex = item.tasks.findIndex(task => task.id === item.current_task_id);
        
                    const tasks = item.tasks.map((task, index) => ({
                        ...task,
                        next_task_id: item.tasks[index + 1]?.id || null,
                    }));
        
                    return {
                        tasks,
                        current_task_id_index: currentTaskIndex !== -1 ? currentTaskIndex : 0,
                        id: item.id,
                        order: item?.order_column,
                        introAudio: item?.intro_speech_audio,
                        introText: item?.intro_speech,
                        tutorials: item?.tutorials,
                    };
                });
        
            const clickedIndex = tasksArray.findIndex(obj => obj.id === itemId);
            return tasksArray.slice(clickedIndex);
        }, [subCollections]);           

        return (
                <Animated.View entering={FadeInRight.delay(200).duration(400).easing(Easing.out(Easing.cubic))} style={{ width: 'auto', height: 'auto' }}>
                <TouchableOpacity
                    // (task != null && (item.tasks?.length > 0 || item?.isBreak))? 
                    onPress={true? () => {
                            const filteredTasksArray = prepareTasksArray(item.id);
                            navigation.navigate('GameScreen', { tasks: filteredTasksArray, breaks: item?.breaks, isFromBreak: item?.isBreak, onComplete: (id, starId, earnedStars) => onComplete(id, starId, earnedStars), onCompleteTask: (id, newTaskId) => onCompleteTask(id, newTaskId)});
                        } 
                        : () => func3()}
                    style={{
                        backgroundColor: '#D8F6FF33', 
                        borderRadius: 12, 
                        width: Platform.isPad? windowWidth * (306 / 1194) : windowHeight * (136 / 360), 
                        height: Platform.isPad? windowHeight * (402 / 834) : windowHeight * (160 / 360), 
                        marginRight: 20,  
                        borderWidth: 1, 
                        borderColor: '#FFFFFF1F',
                        flexDirection: 'column'
                    }}
                >
                    {
                        (task != null && item?.tasks?.length > 0) &&
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: Platform.isPad? 8 : 8 }}>
                            {[...Array(item?.stars?.total)].map((_, index) => {
                                const starImage = index < item?.stars?.earned ? filledStar : emptyStar;
                                return (
                                    <Image
                                        key={index}
                                        source={starImage}
                                        style={{
                                            width: Platform.isPad? windowWidth * (22 / 800) : windowWidth * (16 / 800),
                                            height: Platform.isPad? windowHeight * (22 / 360) : windowHeight * (16 / 360),
                                            marginHorizontal: 2,
                                            resizeMode: 'contain'
                                        }}
                                    />
                                );
                            })}
                        </View>
                    }
                    <View 
                        style={{
                            width: '100%', 
                            position: 'absolute', 
                            borderColor: 'white', 
                            borderWidth: 1, 
                            opacity: 0.12, 
                            top: Platform.isPad? windowHeight * (60 / 800) : 35
                        }} 
                    />
                    {isSvg ? (
                        <SvgUri 
                            uri={image} 
                            width={Platform.isPad? windowWidth * (256 / 1194) : windowWidth * (135 / 800)} 
                            height={Platform.isPad? windowWidth * (224 / 1194) : windowHeight * (82 / 360)} 
                            style={{
                                alignSelf: 'center', 
                                position: 'absolute', 
                                top: Platform.isPad? windowHeight * (90 / 800) : windowHeight * (35 / 360),
                                resizeMode: 'contain'
                            }}
                        />
                    ) : (
                        <Image 
                            source={{ uri: image }} 
                            style={{ 
                                width: Platform.isPad? windowWidth * (256 / 1194) : windowWidth * (135 / 800), height: Platform.isPad? windowWidth * (224 / 1194) : windowHeight * (82 / 360), alignSelf: 'center', resizeMode: 'contain' , position: 'absolute', aspectRatio: 1 / 1, top: Platform.isPad? windowHeight * (90 / 800) : windowHeight * (35 / 360), 
                            }}
                            resizeMode='contain'
                        />
                    )}
                    <View 
                        style={{
                            width: '100%', 
                            position: 'absolute', 
                            borderColor: 'white', 
                            borderWidth: 1, 
                            opacity: 0.12, 
                            bottom: Platform.isPad? windowHeight * (30 / 360) : 40
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
                            borderRadius: 10
                        }}
                    >
                        {item?.attributes && item?.attributes?.length > 0 && item?.attributes.slice(0, 4).map((item, index) => {
                            const isSvg = typeof item?.image === 'string' && item?.image.endsWith('.svg');
                            // console.log(item.image)

                            // console.log(store.attributes[0].attributes)

                            return isSvg ? (
                                <SvgUri
                                    key={index}
                                    uri={item.image}
                                    width={windowWidth * (24 / 800)}
                                    height={windowHeight * (24 / 360)}
                                    style={{ marginHorizontal: 5, backgroundColor: item.group.color, borderRadius: 5 }}
                                />
                            ) : (
                                <Image
                                    key={index}
                                    source={{ uri: item.image }}
                                    style={{
                                        resizeMode: 'contain',
                                        width: windowWidth * (24 / 800),
                                        height: windowHeight * (24 / 360),
                                        marginHorizontal: 5,
                                        backgroundColor: item.group.color
                                    }}
                                />
                            );
                        })}
                    </View>
                    {(task === null || item?.tasks?.length === 0) && <BlurView intensity={10} tint="light" style={{flex: 1, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={lock} style={{width: windowWidth * (24 / 800), height: windowHeight * (24 / 360)}} resizeMode='contain' />
                        </BlurView>}
                </TouchableOpacity>
            </Animated.View>
        )
    };

    const MemoizedRenderCollections = React.memo(renderCollections);
    const MemoizedRenderSubCollections = React.memo(renderSubCollections, (prevProps, nextProps) => {
        return prevProps.item.id === nextProps.item.id;
    });

    const renderItem = (props) =>
        subCollections
            ? <MemoizedRenderSubCollections {...props} onComplete={handleGameCompletion} onCompleteTask={handleTaskCompletion} />
            : <MemoizedRenderCollections {...props} />;

    return (
        <View style={{
            width: windowWidth * (480 / 800), 
            height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360), 
            position: 'absolute', 
            top: Platform.isPad ? windowHeight * (224 / 834) : windowHeight * (104 / 360), 
            left: windowWidth * (320 / 800),
            justifyContent: 'center',
        }}>
            {store.loadingCats?
                <LottieView
                    loop={true}
                    autoPlay
                    source={loadingAnim}
                    style={{width: windowWidth * (50 / 800), height: windowHeight * (50 / 360), position: 'absolute', alignSelf: 'center'}}
                />
                :
                <FlatList
                    horizontal
                    extraData={[store.categories, subCollections]}
                    data={subCollections || collections}
                    renderItem={renderItem}
                    keyExtractor={(item) => md5.hex_md5(`${item?.id}_${item?.image}`)}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    removeClippedSubviews
                    
                />
            }
        </View>
    );
}

export default observer(GamesCollections);