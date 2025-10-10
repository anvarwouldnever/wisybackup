import { useWindowDimensions } from 'react-native';
import * as Device from 'expo-device';

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

export const useScale = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const s = (size) => (windowWidth / guidelineBaseWidth) * size;

  const vs = (size) => (windowHeight / guidelineBaseHeight) * size;

  const isTablet = Device.deviceType === Device.DeviceType.TABLET;

  return { s, vs, windowHeight, windowWidth, isTablet };
};