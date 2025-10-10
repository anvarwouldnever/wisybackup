import { View, Text, Image } from 'react-native';
import { useEffect } from 'react';
import { useScale } from '../../hooks/useScale';

const TimerLayout = ({ formatTime, seconds, setSeconds, animation }) => {

    useEffect(() => {
        if (!animation || seconds === null || seconds === undefined || isNaN(seconds)) return;

        if (seconds > 0) {
            const interval = setInterval(() => {
                setSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [seconds, animation]);

    const { s, vs } = useScale()

    return (
        <View style={{ width: 'auto', height: s(20), flexDirection: 'row', position: 'absolute', right: s(15), top: s(10), backgroundColor: '#C4DF84', borderRadius: 100, alignItems: 'center', justifyContent: 'center', columnGap: s(3)}}>
            
            <Image source={require('../../images/CLOCK.png')} style={{ width: s(12), height: s(12), resizeMode: 'contain'}}/>
            
            {typeof seconds === 'number' && !isNaN(seconds) && (
                <Text style={{ color: '#222222', fontWeight: '600', fontSize: s(8) }}>
                    {formatTime(seconds)}
                </Text>
            )}

        </View>
    );
};

export default TimerLayout;
