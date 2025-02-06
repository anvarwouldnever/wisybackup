import clock from '../images/CLOCK.png'
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { useEffect } from 'react';

const TimerLayout = ({ formatTime, seconds, setSeconds, animation }) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    useEffect(() => {
        if (!animation || seconds === null || seconds === undefined || isNaN(seconds)) return;

        if (seconds > 0) {
            const interval = setInterval(() => {
                setSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [seconds, animation]);

    return (
        <View
            style={{
                width: windowWidth * (86 / 800),
                height: windowHeight * (40 / 360),
                gap: 4,
                flexDirection: 'row',
                position: 'absolute',
                right: windowWidth * (20 / 800),
                top: 30,
                padding: 8,
                backgroundColor: '#C4DF84',
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Image
                source={clock}
                style={{
                    width: windowWidth * (24 / 800),
                    height: windowHeight * (24 / 360),
                    resizeMode: 'contain',
                }}
            />
            {typeof seconds === 'number' && !isNaN(seconds) && (
                <Text style={{ color: '#222222', fontWeight: '600', fontSize: 20 }}>
                    {formatTime(seconds)}
                </Text>
            )}
        </View>
    );
};

export default TimerLayout;
