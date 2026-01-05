import { ActivityIndicator, View } from 'react-native'
import React, { useState } from 'react'
import Logo from '../components/Logo';
import { LinearGradient } from 'expo-linear-gradient';
import { useScale } from '../hooks/utils/useScale';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInLeft, FadeInRight, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Buttons from './CreateChild/Buttons';
import Name from './CreateChild/Name';
import Avatars from './CreateChild/Avatars';
import Progress from './CreateChild/Progress';
import Age from './CreateChild/Age';
import Gender from './CreateChild/Gender';
import EngagementTime from './CreateChild/EngagementTime';
import { AddChild } from '../api/methods/children/children';
import { useNavigation } from '@react-navigation/native';
import useLockPortrait from '../hooks/utils/useLockPortrait';
import { getSettings } from './CreateChild/hooks/getSignUpSettings';
import { getChildren } from './ChoosePlayer/hooks/getChildren';
import store from '../store/store';
import { getAvatars } from './CreateChild/hooks/getAvatars';
import { getLabels } from './Welcome/hooks/getLabels';

const ChildParamsScreen = () => {

    useLockPortrait()

    const { settings } = getSettings()
    const { children } = getChildren()
    const { avatars } = getAvatars()

    const { labels } = getLabels()

    const { vs, windowWidth } = useScale();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation()

    const [name, setName] = useState<string>(null);
    const [avatarIndex, setAvatarIndex] = useState<number>(0);
    const [avatarId, setAvatarId] = useState<number | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [gender, setGender] = useState<number>(null)
    const [engagementTime, setEngagementTime] = useState<number>(null)

    const [stage, setStage] = useState<number>(1)
    const [prevStage, setPrevStage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [nameExists, setNameExists] = useState<boolean>(false)
    const [isFrozen, setIsFrozen] = useState<boolean>(false)

    const inputHeight = useSharedValue(vs(460));

    const animatedStyle = useAnimatedStyle(() => ({
        height: inputHeight.value
    }));

    const getEnteringAnimation = () => {
        return stage > prevStage ? FadeInRight.duration(400) : FadeInLeft.duration(400);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    const createChild = async() => {
        try {
            setLoading(true)
            const response = await AddChild(name, avatarId.toString(), formatDate(birthday), gender, engagementTime)
            if (response?.data?.data?.user_id) {
                await store.setNewChildren(response?.data?.data?.id)
                navigation.replace('LoaderScreen')
            }
        } catch (error) {
            console.log(error?.response?.data?.message || error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const checkName = () => {
        const newName = name.trim().toLowerCase();
        const nameExists = children.some(child => child.name.trim().toLowerCase() === newName);
        return nameExists
    };

    if (isFrozen) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }} />
        )
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingTop: insets?.top, gap: vs(44) }}>
            
            <Logo />
            
            <LinearGradient colors={['#ACA5F6', '#3E269D']} style={{flex: 1, alignItems: 'center', width: '100%', gap: vs(44)}}>
                
                <Animated.View style={[animatedStyle, { width: '100%', alignItems: 'center', backgroundColor: 'white', borderBottomLeftRadius: vs(24), borderBottomRightRadius: vs(24), paddingHorizontal: vs(24), gap: vs(44) }]}>

                    <Progress stage={stage} />
                    
                    { stage === 1 ?
                        
                        <Animated.View key={stage} entering={getEnteringAnimation()} style={{ width: '100%' }}>
                            <Name labels={labels} nameExists={nameExists} setNameExists={setNameExists} settings={settings} name={name} inputHeight={inputHeight} setName={setName} />
                        </Animated.View>

                    : stage === 2 ?
                        
                        <Animated.View key={stage} entering={getEnteringAnimation()} style={{ width: windowWidth }}>
                            <Avatars labels={labels} avatarIndex={avatarIndex} setAvatarIndex={setAvatarIndex} setAvatarId={setAvatarId}/>
                        </Animated.View>

                    : stage === 3 ? 
                        
                        <Animated.View key={stage} entering={getEnteringAnimation()} style={{ width: '100%' }}>
                            <Age labels={labels} formatDate={formatDate} birthday={birthday} setBirthday={setBirthday}  />
                        </Animated.View>

                    : stage === 4 ?

                        <Animated.View key={stage} entering={getEnteringAnimation()} style={{ width: '100%' }}>
                            <Gender labels={labels} gender={gender} setGender={setGender} />
                        </Animated.View>
                    
                    : stage === 5 ?

                        <Animated.View key={stage} entering={getEnteringAnimation()} style={{ width: '100%' }}>
                            <EngagementTime labels={labels} engagementTime={engagementTime} setEngagementTime={setEngagementTime} />
                        </Animated.View> : null

                    }      

                </Animated.View>

                <Buttons labels={labels} avatar={avatarId} inputHeight={inputHeight} checkName={checkName} setNameExists={setNameExists} birthday={birthday} engagementTime={engagementTime} gender={gender} name={name} loading={loading} createChild={createChild} stage={stage} setPrevStage={setPrevStage} setStage={setStage} setIsFrozen={setIsFrozen} />

            </LinearGradient>

            {loading && <ActivityIndicator size={'large'} style={{position: 'absolute', alignSelf: 'center'}} color={'#B1B1B1'} />}
        
        </View>
    )
}

export default ChildParamsScreen;