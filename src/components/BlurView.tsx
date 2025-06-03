import { View, Text, Image, useWindowDimensions, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur'
import lock from '../images/zamok.png';
import store from '../store/store';
import Ionicons from '@expo/vector-icons/Ionicons';

const Blur = ({ itemId, categoryId, collectionId, isLocked }) => {

    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    // const category = store.categories.find(cat => cat.id === categoryId);
    // const collection = category?.collections?.find(col => col.id === collectionId);
    // const availableSubCollections = collection?.available_sub_collections || [];

    // const isLocked = !availableSubCollections.includes(itemId);

    if (!isLocked) return null;

    return (
        <BlurView
            intensity={10}
            tint="light"
            style={{
                ...StyleSheet.absoluteFillObject,
                width: Platform.isPad ? windowWidth * (306 / 1194) : windowHeight * (136 / 360),
                height: Platform.isPad ? windowHeight * (402 / 834) : windowHeight * (160 / 360),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                overflow: 'hidden'
            }}
        >
            <Ionicons name='lock-closed' size={24} color={'#504297'}/>
        </BlurView>
    )
}

export default Blur