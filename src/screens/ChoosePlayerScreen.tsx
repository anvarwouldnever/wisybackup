import React, { useState } from 'react';
import { Text, TouchableOpacity, ImageBackground, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundMusic from './ChoosePlayer/BackgroundMusic';
import Children from './ChoosePlayer/Children';
import store from '../store/store';
import { observer } from 'mobx-react-lite';
import { useScale } from '../hooks/utils/useScale';
import useLockLandscape from '../hooks/utils/useLockLandscape';
import Ionicons from '@expo/vector-icons/Ionicons';
import SearchInput from './ChoosePlayer/SearchInput';
import translations from '../../localization';
import { getChildren } from './ChoosePlayer/hooks/getChildren';
import { gameStore } from './Games/store/gameStore';

const ChoosePlayerScreen = () => {

    const navigation = useNavigation();
    const [chosenPlayerIndex, setChosenPlayerIndex] = useState(null);
    const [chosenPlayer, setChosenPlayer] = useState<any>();
    const [isFrozen, setIsFrozen] = useState<boolean>(false)

    const [searchInput, setSearchInput] = useState<string>('');
    const [query, setQuery] = useState<string>('');

    const { s, vs } = useScale();

    const { children, loading } = getChildren();

    const filteredChildren = React.useMemo(() => {
        if (!query || query.trim() === '') return children;
        return children?.filter(child =>
            child?.name?.toLowerCase().includes(query.toLowerCase())
        );
    }, [children, query]);

    const onPress = () => {
        if (chosenPlayer?.id != store?.playingChildId?.id) {
            store.setDoneWelcomeSpeech(false)
            gameStore.resetSubCollection()
            gameStore.resetCategories()
        }
        navigation.navigate('GamesScreen'); 
        store.setPlayingChildId(chosenPlayer)
    }

    useLockLandscape();

    if (isFrozen) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
        )
    }

    return (
        <ImageBackground source={require('../images/choosePlayer.png')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            
            <BackgroundMusic />

            <SearchInput onClear={() => setQuery('')} onSearch={() => setQuery(searchInput)}  searchInput={searchInput} setSearchInput={setSearchInput} />
        
            {query && filteredChildren?.length === 0 ? (
                <Text style={{ color: '#504297', fontSize: s(6), fontWeight: '700', textAlign: 'center' }}>
                    {translations?.[store.language]?.nothingFound}
                </Text>
            ) : (
                <Children
                    setIsFrozen={setIsFrozen}
                    setChosenPlayerIndex={setChosenPlayerIndex}
                    chosenPlayerIndex={chosenPlayerIndex}
                    setChosenPlayer={setChosenPlayer}
                    children={filteredChildren}
                    loading={loading}
                />
            )}

            {chosenPlayerIndex != null && (

                <TouchableOpacity onPress={() => onPress()} style={{ borderRadius: 100, flexDirection: 'row', columnGap: vs(10), justifyContent: 'center', alignItems: 'center', backgroundColor: '#504297', width: s(65), height: s(25), bottom: s(10), right: s(10), position: 'absolute'}}>
                    
                    <Text style={{ fontWeight: '600', fontSize: s(7), color: 'white'}}>
                        {translations?.[store.language]?.letsPlay}
                    </Text>

                    <Ionicons name='arrow-forward' size={s(8)} color={'white'} />

                </TouchableOpacity>
                
            )}
        
        </ImageBackground>
    );
};

export default observer(ChoosePlayerScreen);