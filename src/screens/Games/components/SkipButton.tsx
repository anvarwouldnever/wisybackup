import React from 'react'
import { Text, TouchableOpacity, Platform, useWindowDimensions } from 'react-native'
import { observer } from 'mobx-react-lite'
import AnimatedPaw from '../../../components/AnimatedPaw'

type Props = {
  visible: boolean
  onSkip: () => void
  showPaw?: boolean
}

const SkipButton = observer(({ visible, onSkip, showPaw = false }: Props) => {
  if (!visible) return null

  const { height, width } = useWindowDimensions();

  return (
    <TouchableOpacity
      onPress={onSkip}
      style={{
        width: height * (58 / 360),
        height: Platform.isPad ? width * (40 / 800) : height * (40 / 360),
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
    >
      <Text
        style={{
          fontWeight: '600',
          fontSize: Platform.isPad ? width * (12 / 800) : 12,
          color: '#504297',
        }}
      >
        Skip
      </Text>
      {showPaw && <AnimatedPaw />}
    </TouchableOpacity>
  )
})

export default SkipButton;
