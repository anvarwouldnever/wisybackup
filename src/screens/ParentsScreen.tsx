import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View, Platform } from "react-native";
import BottomTabs from "./Parents/BottomTabs";
import Child from "./Parents/Child";
import DropDownModal from "./Parents/DropDownModal";
import LanguageComponent from "./Parents/LanguageComponent";
import LanguageReturn from "./Parents/LanguageReturn";
import ParentsCancel from "./Parents/ParentsCancel";
import ParentsComponent from "./Parents/ParentsComponent";
import ParentsSettings from "./Parents/ParentsSettings";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScale } from "../hooks/utils/useScale";
import { getAttributes } from "./Parents/hooks/getAttributes";

const ParentsScreen = () => {

    const { attributes, loading, error } = getAttributes()

    const [index, setIndex] = useState<string | number>(0);
    const [dropDown, setDropDown] = useState(null);

    const name = attributes?.[index]?.name;

    const { s, vs } = useScale()

    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', rowGap: vs(15), paddingHorizontal: vs(20), backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android'? 40 : 0}}>
            
            {index !== 'Lang' && 
                <ParentsCancel />
            }

            {index == 'Lang' ? 
                <LanguageReturn setScreen={setIndex} /> 
            : index !== 'Settings'? 
                <Child setDropDown={setDropDown} dropDown={dropDown}/> 
            : index === 'Settings' &&
                null
            }
            
            {index !== 'Settings' && dropDown && 
                <DropDownModal setDropDown={setDropDown} dropDown={dropDown}/>
            }
            
            {index == 'Settings' ? 
                <ParentsSettings setScreen={setIndex}/> 
            : index == 'Lang'? 
                <LanguageComponent setScreen={setIndex}/> 
            : 
                <ParentsComponent attributes={attributes?.[index]} loading={loading} activeIndex={index} name={name} />
            }
            
            <View style={{width: '100%', height: 'auto', alignItems: 'center', position: 'absolute', bottom: vs(35), alignSelf: 'center'}}>
                {!loading && <BottomTabs attributes={attributes} setScreen={setIndex} activeIndex={index} />}
            </View>

        </SafeAreaView>
    )
}

export default observer(ParentsScreen);