import { View, Text, TextInput, Platform, Keyboard } from 'react-native'
import React, { useEffect } from 'react'
import { withTiming } from 'react-native-reanimated'
import { useScale } from '../../hooks/utils/useScale'
import translations from '../../../localization'
import store from '../../store/store'

const Name = ({ inputHeight, setName, name, settings, nameExists, setNameExists, labels }) => {

    const { vs } = useScale()

    const handleFocus = () => {
        inputHeight.value = withTiming(vs(200), { duration: 200 })
    }

    const handleBlur = () => {
        Keyboard.dismiss()
        inputHeight.value = withTiming(vs(460), { duration: 300 })
    }

    useEffect(() => {
        return () => {
            handleBlur()
        }
    }, [])

    return (
        <View style={{ width: '100%', height: 'auto', gap: vs(16), alignItems: 'center', justifyContent: 'center'}}>

            <Text style={{ height: vs(28), fontSize: Platform.isPad ? vs(22) : vs(20), fontWeight: '600', textAlign: 'center' }}>{labels?.child_name}</Text>

            <TextInput 
                style={{ width: '100%', height: vs(56), alignSelf: 'center', borderWidth: 1, borderRadius: 100, paddingHorizontal: vs(16), borderColor: '#E5E5E5', fontSize: Platform.isPad ? vs(16) : vs(14), color :'#222222', fontWeight: '600', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                value={name}
                onChangeText={(text: string) => {setName(text); if (nameExists) setNameExists(false)}}
                placeholder={settings?.child_name_placeholder}
                onFocus={() => handleFocus()}
                onBlur={() => handleBlur()}
                placeholderTextColor={'#B1B1B1'}
                keyboardAppearance='dark'
            />

            <Text style={{fontWeight: '600', color: 'red', alignSelf: 'center', fontSize: vs(12), opacity: nameExists ? 1 : 0}}>
                {labels?.noChildrenWithName}
            </Text>

        </View>
    )
}

export default Name