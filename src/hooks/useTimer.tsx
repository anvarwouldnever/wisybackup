import { useRef, useEffect } from 'react';
import { AppState } from 'react-native';

const useTimer = () => {
    const timeRef = useRef(0);
    const intervalRef = useRef(null);
    const appStateRef = useRef(AppState.currentState);

    const start = () => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                timeRef.current += 1; 
            }, 1000);
        }
    };

    const stop = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const reset = () => {
        stop();
        timeRef.current = 0;
    };

    const getTime = () => {
        return timeRef.current;
    };

    useEffect(() => {
        const handleAppStateChange = (nextAppState: any) => {
            if (appStateRef.current.match(/active/) && nextAppState === 'background') {
                console.log('stopped')
                stop();
            } else if (appStateRef.current.match(/background/) && nextAppState === 'active') {
                console.log('renewed')
                start();
            }
            appStateRef.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
            clearInterval(intervalRef.current);
        };
    }, []);

    return { start, stop, reset, getTime };
};

export default useTimer;
