import React, { useEffect } from 'react';
import { View, Platform, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const SkeletonCard = () => {
  const shimmerTranslate = useSharedValue(-1); // начнем за пределами

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const width = Platform.isPad
    ? windowWidth * (306 / 1194)
    : windowHeight * (136 / 360);
  const height = Platform.isPad
    ? windowHeight * (402 / 834)
    : windowHeight * (160 / 360);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: shimmerTranslate.value * width,
      },
    ],
  }));

  return (
    <View style={[styles.card, { width, height }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.shimmerOverlay,
          shimmerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D8F6FF33',
    borderRadius: 12,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF1F',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    width: '40%',
    height: '100%',
    backgroundColor: '#ffffff22', // полупрозрачный свет
  },
});

export default SkeletonCard;
