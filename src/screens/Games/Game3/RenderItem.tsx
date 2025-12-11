import { View } from 'react-native'
import React from 'react'
import Button from './Button';

const RenderItem = ({ item, lock, answer, id, clicked }) => {

    return (
        <View style={{backgroundColor: 'white', width: 'auto', height: 'auto', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
            <Button clicked={clicked} item={item} lock={lock} answer={answer} id={id} />
        </View>
    );
};

export default RenderItem;
