import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useScale } from '../hooks/utils/useScale';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation'

const NoNetworkScreen = ({ onRetry }: { onRetry: () => void }) => {
    
    const { vs, isTablet } = useScale()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const lock = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };

        lock();
    }, [])

    const handleRetry = async () => {
        setLoading(true)
        try {
            await new Promise(res => setTimeout(res, 1000));
            onRetry()
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: vs(20) }}>
            
            <Ionicons 
                name="cloud-offline-outline" 
                size={isTablet ? vs(80) : vs(60)} 
                color="#6A5AE0" 
                style={{ marginBottom: vs(20) }} 
            />

            <Text 
                style={{ 
                    fontSize: isTablet ? vs(20) : vs(18), 
                    marginBottom: vs(20), 
                    textAlign: 'center',
                    fontWeight: '500'
                }}
            >
                No connection
            </Text>
            
            {loading ? (
                <View style={{ width: vs(250), height: vs(48), justifyContent: 'center'}}>
                    <ActivityIndicator size={'large'} color="#6A5AE0" />
                </View>
            ) : (
                <TouchableOpacity 
                    onPress={handleRetry} 
                    style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        backgroundColor: "#6A5AE0",
                        borderRadius: vs(8),
                        width: vs(250),
                        height: vs(48),
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons 
                        name="refresh" 
                        size={25} 
                        color="#fff" 
                        style={{ marginRight: vs(8) }} 
                    />
                    <Text style={{ color: "#fff", fontSize: isTablet? vs(18) : vs(16), fontWeight: '500' }}>
                        Try again
                    </Text>
                </TouchableOpacity>
            )}

        </View>
    )
}

export default NoNetworkScreen