import LottieView from "lottie-react-native";
import { useRef, useEffect } from "react";
import { Platform } from "react-native";
import star0 from '../../lotties/0.json'
import star1 from '../../lotties/1.json'
import star2 from '../../lotties/2.json'
import star3 from '../../lotties/3.json'
import { useScale } from "../../hooks/useScale";


const StarsLottie = ({ stars }) => {

    const { s, vs } = useScale()
    const lottieRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
        lottieRef.current?.play(0, 60);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LottieView
            ref={lottieRef}
            source={stars.length === 1? star1 : stars.length === 2? star2 : stars.length === 3? star3 : star0}
            style={{ width: '100%', height: '100%', alignItems: 'center', alignSelf: 'center', transform: [{ scale: Platform.isPad? 1.5 : 1}], position: 'absolute', top: 0, marginRight: vs(30)}}
            resizeMode='center'
            autoPlay={false}
            loop={false}
        />
    );
};

export default StarsLottie;