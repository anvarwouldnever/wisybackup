import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import Logo from '../components/Logo';
import { observer } from 'mobx-react-lite';
import Button from './Language/Button';
import Languages from './Language/Languages';
import { useScale } from '../hooks/useScale';
import useLockPortrait from '../hooks/useLockPortrait';

const LanguageScreen = () => {

    const [chosenLang, setChosenLang] = useState<string>('en');

    const { s, vs } = useScale()

    useLockPortrait()

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            
            <Logo />
            
            <View style={{ width: s(312), height: vs(618), alignSelf: 'center', marginTop: 30, justifyContent: 'space-between'}}>
                
                <Text style={{fontWeight: '400', fontSize: vs(14), textAlign: 'center', color: "#555555", width: s(312), height: vs(24), alignSelf: 'center', justifyContent: 'center'}}>Select language to proceed</Text>
                
                <Languages setChosenLang={setChosenLang} chosenLang={chosenLang} />
                
                <Button chosenLang={chosenLang} />

            </View>

        </SafeAreaView>
    )
}

export default observer(LanguageScreen);