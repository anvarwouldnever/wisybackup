import { ActivityIndicator, View } from 'react-native'
import React, { useState } from 'react'
import { useScale } from '../../hooks/utils/useScale';
import Dots from './Slides/Dots';
import SlideList from './Slides/SlideList';
import { observer } from 'mobx-react-lite';

const Slides = ({ onboardings, loading }) => {

    const { vs } = useScale()

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    return (
        <View style={{justifyContent: 'center', alignItems: 'center', height: 'auto', width: '100%', gap: vs(25)}}>

            {loading ? 
                <View style={{width: '100%', height: vs(402), alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' color={'purple'} /> 
                </View>
            : 
                <SlideList loading={loading} currentIndex={currentIndex} onboardings={onboardings} setCurrentIndex={setCurrentIndex}  />
            }
        
            <Dots length={onboardings?.length} currentIndex={currentIndex} />

        </View>
    )
}

export default observer(Slides);