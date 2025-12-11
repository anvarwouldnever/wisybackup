import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'
import { Ionicons } from '@expo/vector-icons'
import translations from '../../../localization'
import store from '../../store/store'

const SearchInput = ({ searchInput, setSearchInput, onSearch, onClear }) => {

    const { s, vs } = useScale()

    const handleSearch = () => {
        Keyboard.dismiss()       // ⬅ прячем клавиатуру
        onSearch()
    }

    const handleClear = () => {
        setSearchInput('')       // очищаем поле
        onClear()                // сбрасываем query = ''
        Keyboard.dismiss()       // optional: прячем клаву
    }

    return (
        <View style={{ position: 'absolute', top: s(10), left: vs(170), width: 'auto', height: s(18), flexDirection: 'row', alignItems: 'center', columnGap: s(5), zIndex: 1000 }}>
            
            <View style={{ width: s(90), backgroundColor: 'white', flexDirection: 'row', height: '100%', columnGap: s(5), borderRadius: 100, paddingHorizontal: s(10), alignItems: 'center', justifyContent: searchInput?.length > 0 ? 'space-between' : 'flex-start' }}>
                
                <Ionicons name='search' size={s(10)} color={'#504297'} />
                
                <TextInput 
                    placeholder={translations?.[store.language]?.childName}
                    placeholderTextColor={'#504297'}
                    style={{ color: '#504297', fontSize: s(6), fontWeight: '600', width: '55%', height: '100%' }}
                    keyboardType='default'
                    keyboardAppearance='light'
                    value={searchInput}
                    onChangeText={(text) => setSearchInput(text)}
                />

                {searchInput?.length > 0 && (
                    <TouchableOpacity onPress={handleClear}>
                        <Ionicons name='close' size={s(10)} color={'#504297'} />
                    </TouchableOpacity>
                )}

            </View>

            <TouchableOpacity disabled={!searchInput?.trim()} onPress={handleSearch} style={{ opacity: !searchInput?.trim() ? 0.5 : 1, width: s(40), height: '100%', backgroundColor: '#504297', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                
                <Text style={{ color: 'white', fontSize: s(6), fontWeight: '600', }}>
                    {translations?.[store.language]?.search}
                </Text>

            </TouchableOpacity>

        </View>
    )
}

export default SearchInput