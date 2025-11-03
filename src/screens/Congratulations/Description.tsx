import { View, Text } from 'react-native'
import React from 'react'
import { useScale } from '../../hooks/utils/useScale'
import store from '../../store/store'

const Description = ({ stars }) => {

    const { s, vs } = useScale()

    return (
        <View style={{width: '100%', height: 'auto', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', rowGap: s(5), position: 'absolute', top: 0, bottom: 0}}>
            <Text style={{fontSize: s(8), fontWeight: '600', color: '#222222', alignSelf: 'center'}}>
                {stars?.length == 0 && store?.language === 'lv'? 'Mēģini vēlreiz' : stars?.length == 1 && store?.language === 'en'? 'Try Again' : stars?.length == 1 && store?.language === 'lv'? 'Tu vari labāk' : stars?.length == 1 && store?.language === 'en'? 'You Can Do Better' : stars?.length == 2 && store.language === 'lv'? "Mēģini vēlreiz" : stars?.length == 2 && store.language === 'en'? 'So Close' : stars?.length == 3 && store.language === 'lv'? 'Perfekti' : stars?.length == 3 && store.language === 'en'? 'Perfect' : 'Congratulations!'}
            </Text>

            <Text style={{fontSize: s(7), fontWeight: '400', color: '#222222', alignSelf: 'center', textAlign: 'center'}}>
                {stars?.length == 0 && store?.language === 'lv'? 'Tu ieguvi 0 zvaigznes. Turpini trenēties!' : stars?.length == 0 && store?.language === 'en'? 'You earned 0 stars. Keep practicing' : stars?.length == 1 && store.language === 'lv'? 'Tu ieguvi tikai 1 zvaigzni. Zinu, ka vari labāk!' : stars?.length == 1 && store.language === 'en'? 'You only earned 1 star. I know you can do better!' : stars?.length == 2 && store.language === 'lv'? 'Tu ieguvi 2 zvaigznes! Vēl mazliet piepūles!' : stars?.length == 2 && store.language === 'en'? 'You earned 2 stars! Just a little more effort!' : stars?.length == 3 && store.language === 'lv'? 'Tu ieguvi 3 zvaigznes, turpini tāpat!' : stars?.length == 3 && store.language === 'en'? 'You earned 3 stars, keep it up!' : 'Congratulations!'}
            </Text>
        </View>
    )
}

export default Description