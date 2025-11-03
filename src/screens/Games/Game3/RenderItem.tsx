import { View, Platform, useWindowDimensions } from 'react-native'
import React from 'react'
import Button from './Button';
import { useScale } from '../../../hooks/utils/useScale';

const RenderItem = ({ item, lock, answer, id }) => {

        const { s, vs } = useScale()

        return (
            <View style={{backgroundColor: 'white', width: 'auto', height: 'auto', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                <Button item={item} lock={lock} answer={answer} id={id} />
            </View>
        );
    };

export default RenderItem;
