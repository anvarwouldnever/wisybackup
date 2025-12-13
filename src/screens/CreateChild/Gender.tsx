import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'

const Gender = ({ gender, setGender }) => {

    const { vs } = useScale()

    return (
        <View style={{ height: 'auto', width: '100%', gap: vs(16) }}>
            
            <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(22) : vs(20), fontWeight: '600', color: '#222222', paddingHorizontal: vs(20), lineHeight: Platform.isPad ? vs(30) : vs(28) }}>
                What is your child’s gender?
            </Text>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setGender(0)} style={{ height: vs(56), width: '100%', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: gender === 0 ? '#504297' : '#E5E5E5', backgroundColor: gender === 0 ? '#504297' : 'white' }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(16) : vs(14), fontWeight: '600', color: gender === 0 ? 'white' : '#222222' }}>
                    Boy
                </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setGender(1)} style={{ height: vs(56), width: '100%', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: gender === 1 ? '#504297' : '#E5E5E5', backgroundColor: gender === 1 ? '#504297' : 'white' }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(16) : vs(14), fontWeight: '600', color: gender === 1 ? 'white' : '#222222' }}>
                    Girl
                </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setGender(2)} style={{ height: vs(56), width: '100%', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: gender === 2 ? '#504297' : '#E5E5E5', backgroundColor: gender === 2 ? '#504297' : 'white' }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(16) : vs(14), fontWeight: '600', color: gender === 2 ? 'white' : '#222222' }}>
                    Prefer not to say 
                </Text>
            </TouchableOpacity>
    
        </View>
    )
}

export default Gender;