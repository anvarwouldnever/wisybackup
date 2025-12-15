import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'
import { useNavigation } from '@react-navigation/native'

const Buttons = () => {

    const { vs } = useScale()

    const navigation = useNavigation()

    return (
        <View style={{ width: '100%', height: 'auto', justifyContent: 'center', alignItems: 'center', gap: vs(12)}}>
            
            <TouchableOpacity onPress={() => navigation.navigate('Sign')} style={{width: '100%', height: vs(56), borderRadius: 100, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#504297', borderColor: '#504297'}}>
                <Text style={{fontSize: Platform.isPad? vs(16) : vs(14), color: 'white', fontWeight: '600'}}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Sign')} style={{width: '100%', height: vs(56), borderRadius: 100, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderColor: '#E5E5E5'}}>
                <Text style={{fontSize: Platform.isPad? vs(16) : vs(14), color: '#504297', fontWeight: '600'}}>Log in</Text>
            </TouchableOpacity>

        </View>
    )
}

export default Buttons