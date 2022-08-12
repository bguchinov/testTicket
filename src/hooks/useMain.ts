import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useEffect, useMemo, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useTimer} from './useTimer';

let timer: number | null = null;

export const useMain = () => {
  const fontSize = useSharedValue(20);
  let pointsRef = useRef<TextInput>(null);
  let rewardsRef = useRef<TextInput>(null);
  let imageViewRef = useRef<View>(null);
  const [rewardPoints, setRewardPoints] = useState(1000);
  const [points, setPoints] = useState(0);
  const [scoreBoardPosition, setScoreBoardPosition] = useState({x: 0, y: 0});
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const {timerId, setNewTimer} = useTimer();

  let memoizedRewards = useMemo(() => rewardPoints, [rewardPoints]);
  let memoizedPoints = useMemo(() => points, [points]);

  const editText = () => {
    if (memoizedRewards >= 0) {
      pointsRef?.current?.setNativeProps({text: `${memoizedPoints++}`});
      rewardsRef?.current?.setNativeProps({
        text: `${memoizedRewards--}`,
      });
    }
  };

  useEffect(() => {
    pointsRef?.current?.setNativeProps({text: `${points}`});
  }, [pointsRef]);

  useEffect(() => {
    rewardsRef?.current?.setNativeProps({text: `${rewardPoints}`});
  }, [rewardsRef]);

  const pointsStyle = useAnimatedStyle(() => {
    return {
      fontSize: fontSize.value,
      lineHeight: 24,
      color: '#fff5b2',
      marginLeft: 10,
    };
  });

  const onAnimationEnd = () => {
    fontSize.value = withSpring(20);
    setAnimationInProgress(false);
    setNewTimer(null);

    pointsRef?.current?.setNativeProps({
      text: `${memoizedPoints + memoizedRewards}`,
    });
    rewardsRef?.current?.setNativeProps({
      text: '0',
    });

    setPoints(memoizedRewards + memoizedPoints);
    setRewardPoints(0);
  };

  const onVotePress = () => {
    setAnimationInProgress(true);
    setTimeout(() => {
      fontSize.value = withSpring(25);

      const newTimerId = setInterval(() => {
        editText();
      }, 100);
      setNewTimer(newTimerId);
    }, 1000);
  };

  const onRestartPress = () => {
    setRewardPoints(1000);
    setPoints(0);
  };

  const setScoreBoardPositionHandler = (pageX: number, pageY: number) => {
    setScoreBoardPosition({x: pageX, y: pageY});
  };

  const getScoreBoardCoordinates = () => {
    if (imageViewRef.current) {
      imageViewRef.current.measure((x, y, width, height, pageX, pageY) => {
        setScoreBoardPositionHandler(pageX, pageY);
      });
    }
  };

  return {
    points,
    rewardPoints,
    pointsRef,
    rewardsRef,
    onAnimationEnd,
    animationInProgress,
    imageViewRef,
    pointsStyle,
    scoreBoardPosition,
    onVotePress,
    onRestartPress,
    setScoreBoardPositionHandler,
    getScoreBoardCoordinates,
  };
};
