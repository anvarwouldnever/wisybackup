import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'

const EngagementTime = ({ engagementTime, setEngagementTime }) => {

    const { s, vs } = useScale()

    return (
        <View style={{ height: 'auto', width: '100%', gap: vs(16) }}>
                   
            <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(22) : vs(20), fontWeight: '600', color: '#222222', paddingHorizontal: vs(20), lineHeight: Platform.isPad ? vs(30) : vs(28) }}>
                What's your child's typical engagement time?
            </Text>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setEngagementTime(30)} style={{ height: vs(56), width: '100%', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: engagementTime === 30 ? '#504297' : '#E5E5E5', backgroundColor: engagementTime === 30 ? '#504297' : 'white'  }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(16) : vs(14), fontWeight: '600', color: engagementTime === 30 ? 'white' : '#222222' }}>
                    30 min
                </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setEngagementTime(45)} style={{ height: vs(56), width: '100%', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: engagementTime === 45 ? '#504297' : '#E5E5E5', backgroundColor: engagementTime === 45 ? '#504297' : 'white' }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(16) : vs(14), fontWeight: '600', color:  engagementTime === 45 ? 'white' : '#222222' }}>
                    45 min
                </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setEngagementTime(60)} style={{ height: vs(56), width: '100%', borderRadius: 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: engagementTime === 60 ? '#504297' : '#E5E5E5', backgroundColor: engagementTime === 60 ? '#504297' : 'white' }}>
                <Text style={{ width: '100%', textAlign: 'center', fontSize: Platform.isPad? vs(16) : vs(14), fontWeight: '600', color: engagementTime === 60 ? 'white' : '#222222' }}>
                    1 hour
                </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: Platform.isPad ? vs(14) : vs(12), fontWeight: '500', color: '#555555', lineHeight: vs(20), textAlign: 'center', paddingHorizontal: Platform.isPad ? vs(22) : vs(20), marginTop: vs(48)}}>
                Wisy will monitor the child's performance and suggest taking breaks as needed
            </Text>

        </View>
    )
}

export default EngagementTime;