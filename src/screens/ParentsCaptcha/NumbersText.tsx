import { Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useScale } from '../../hooks/useScale';
import store from '../../store/store';
import { useNavigation } from '@react-navigation/native';

const NumbersText = ({ answer, setError }) => {

    const numberToText = (num, lang) => {
        const numberMap = {
            en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
            lv: ['nulle', 'viens', 'divi', 'trīs', 'četri', 'pieci', 'seši', 'septiņi', 'astoņi', 'deviņi'],
            es: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'],
            fr: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'],
            ru: ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
        };
    
        return numberMap[lang] ? numberMap[lang][num] : numberMap['en'][num]; // По умолчанию использовать английский, если язык не найден
    };

    const { s, vs } = useScale()

    const navigation = useNavigation()

    const [generatedNumbers, setGeneratedNumbers] = useState<number[]>(Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)));

    useEffect(() => {
        if (answer.length === 4 && JSON.stringify(answer) === JSON.stringify(generatedNumbers)) {
            navigation.navigate('ParentsScreen')
        } else if (answer.length === 4 && JSON.stringify(answer) != JSON.stringify(generatedNumbers)) {
            setError(true)
        }
    }, [answer, generatedNumbers]);

    return (
        <Text style={{ fontWeight: '600', fontSize: vs(14) }}>
            {generatedNumbers.map(num => numberToText(num, store.language)).join(' ')}
        </Text>
    )
}

export default NumbersText