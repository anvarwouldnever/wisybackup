import { useWindowDimensions } from 'react-native';

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

export const useScale = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const s = (size) => (windowWidth / guidelineBaseWidth) * size;

  const vs = (size) => (windowHeight / guidelineBaseHeight) * size;

  return { s, vs, windowHeight, windowWidth };
};