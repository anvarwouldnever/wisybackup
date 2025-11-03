import { Text } from 'react-native'
import React, { useState } from 'react'
import Logo from '../components/Logo';
import { observer } from 'mobx-react-lite';
import Button from './Language/Button';
import Languages from './Language/Languages';
import { useScale } from '../hooks/utils/useScale';
import useLockPortrait from '../hooks/utils/useLockPortrait';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAudios } from './ChoosePlayer/hooks/getAudios';

const LanguageScreen = () => {

    const [chosenLang, setChosenLang] = useState<string>('en');

    const { s, vs, isTablet } = useScale();

    useLockPortrait();

    const { audio } = getAudios()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: vs(20), rowGap: vs(20) }}>
            
            <Logo />
            
            <Text style={{fontWeight: '400', fontSize: isTablet? vs(16) : vs(14), textAlign: 'center', color: "#555555", width: '100%', height: vs(24), alignSelf: 'center', justifyContent: 'center'}}>Select language to proceed</Text>
                
            <Languages setChosenLang={setChosenLang} chosenLang={chosenLang} />
                
            <Button chosenLang={chosenLang} />

        </SafeAreaView>
    )
}

export default observer(LanguageScreen);