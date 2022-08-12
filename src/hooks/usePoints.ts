import {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Coordinates} from '../types/coordinates';
import {Dimensions} from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const defaultRewardSize = 20;
const increasedRewardSize = 40;
const inactiveRewardTransition = 0;
const activeRewardTransition = 1;

type usePointsProps = {
  coordinates: Coordinates;
  animationInProgress: boolean;
  index: number;
  isLast: boolean;
  onAnimationEnd: () => void;
};

export const usePoints = (props: usePointsProps) => {
  const {coordinates, animationInProgress, isLast, onAnimationEnd, index} =
    props;
  const rewardSize = useSharedValue(defaultRewardSize);
  const rewardTransition = useSharedValue(inactiveRewardTransition);
  const [hide, setHide] = useState(true);
  const {top: topInset} = useSafeAreaInsets();

  const translateXOutput = [
    0,
    width / 2 - 90 - coordinates.x,
    width / 2 - 30 - coordinates.x,
  ];

  const translateYOutput = [
    0,
    -height + 210 - (topInset <= 20 ? topInset + 37 : 0) + coordinates.y,
  ];

  useEffect(() => {
    if (animationInProgress) {
      changeSize();
      setHide(false);
    }
  }, [animationInProgress]);

  const animationStart = () => {
    rewardSize.value = withSpring(defaultRewardSize);
    setTimeout(() => {
      startPointsTransition();
    }, 100 * index + 1);
  };

  const animationFinish = () => {
    rewardTransition.value = withSpring(inactiveRewardTransition);
    setHide(true);
    if (isLast) {
      onAnimationEnd();
    }
  };

  const changeSize = () => {
    rewardSize.value = withSpring(increasedRewardSize, undefined, finished => {
      if (finished) {
        runOnJS(animationStart)();
      }
    });
  };

  const startPointsTransition = () => {
    rewardTransition.value = withSpring(
      activeRewardTransition,
      undefined,
      finished => {
        if (finished) {
          runOnJS(animationFinish)();
        }
      },
    );
  };

  const rewardStyle = useAnimatedStyle(() => {
    return {
      height: rewardSize.value,
      width: rewardSize.value,
      borderRadius: interpolate(
        rewardSize.value,
        [defaultRewardSize, increasedRewardSize],
        [10, 20],
        Extrapolation.CLAMP,
      ),
      position: 'absolute',
      top: 5,
      left: 5,
      display: hide ? 'none' : 'flex',
      transform: [
        {
          translateX: interpolate(
            rewardTransition.value,
            [0, 0.5, 1],
            translateXOutput,
            Extrapolation.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            rewardTransition.value,
            [0, 1],
            translateYOutput,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return {rewardStyle};
};
