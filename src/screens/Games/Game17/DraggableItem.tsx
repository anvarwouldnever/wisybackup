import { Animated, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, runOnJS, withDelay, withSpring, useAnimatedStyle, LinearTransition } from "react-native-reanimated";


export const DraggableItem = ({ item, windowWidth, windowHeight, checkDropZone, lock, opacity, draggingId, setDraggingId }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            if (lock) return;
            runOnJS(setDraggingId)(item.id);
        })
        .onUpdate((event) => {
            if (lock) {
                translateX.value = 0;
                translateY.value = 0;
                return;
            }
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (lock) {
                translateX.value = 0;
                translateY.value = 0;
                return;
            }

            const hit = runOnJS(checkDropZone)(
                event.absoluteX,
                event.absoluteY,
                item.image,
                item
            );

            if (hit) return;

            translateX.value = withDelay(50, withSpring(0, { damping: 20, stiffness: 200 }));
            translateY.value = withDelay(50, withSpring(0, { damping: 20, stiffness: 200 }));
        });

    const animatedStyleMove = useAnimatedStyle(() => {
        return lock
            ? { transform: [{ translateX: 0 }, { translateY: 0 }] }
            : { transform: [{ translateX: translateX.value }, { translateY: translateY.value }] };
    });

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View layout={LinearTransition.duration(500)} style={[{ width: windowWidth * (80 / 800), zIndex: draggingId == item.id? 1000 : 0, height: Platform.isPad? windowWidth * (80 / 800) : windowHeight * (80 / 360), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', shadowColor: "#D0D0D0", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4}]}>
                <Animated.Image source={{ uri: item?.image }} style={[animatedStyleMove, { width: windowHeight * (64 / 360), height: Platform.isPad? windowWidth * (64 / 800) : windowHeight * (64 / 360), opacity: draggingId == item.id? opacity : 1, resizeMode: 'contain'}]} />
            </Animated.View>
        </GestureDetector>
    );
};