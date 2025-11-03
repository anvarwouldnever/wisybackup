import LottieView from "lottie-react-native";
import { useRef, useEffect } from "react";
import star0 from '../../lotties/0.json'
import star1 from '../../lotties/1.json'
import star2 from '../../lotties/2.json'
import star3 from '../../lotties/3.json'
import { useScale } from "../../hooks/utils/useScale";

const StarsLottie = ({ stars }) => {

    const { s, vs } = useScale()
    const lottieRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            lottieRef.current?.play(0, 400);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LottieView
            ref={lottieRef}
            source={stars?.length === 1? star1 : stars?.length === 2? star2 : stars?.length === 3? star3 : star0}
            style={{ width: '100%', height: '100%', alignItems: 'center', alignSelf: 'center', transform: [{ scale: 1.5 }], position: 'absolute', top: 0, marginRight: s(10)}}
            resizeMode='cover'
            autoPlay={false}
            loop={false}
        />
    );
};

export default StarsLottie;