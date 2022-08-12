import React from 'react';
import Animated from 'react-native-reanimated';
import {ICONS} from '../constants/icons';
import {usePoints} from '../hooks/usePoints';
import {Coordinates} from '../types/coordinates';

type PointImageProps = {
  coordinates: Coordinates;
  animationInProgress: boolean;
  index: number;
  isLast: boolean;
  onAnimationEnd: () => void;
};

export const PointImage = (props: PointImageProps) => {
  const {rewardStyle} = usePoints(props);

  return <Animated.Image style={[rewardStyle]} source={ICONS.coin} />;
};
