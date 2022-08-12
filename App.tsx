import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {PointImage} from './src/components/PointImage';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {scrollItems} from './src/constants/constants';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

let timer: number | null = null;

const App = () => {
  const fontSize = useSharedValue(20);
  let pointsRef = useRef<TextInput>(null);
  let rewardsRef = useRef<TextInput>(null);
  let imageViewRef = useRef<View>(null);
  const [rewardPoints, setRewardPoints] = useState(1000);
  const [points, setPoints] = useState(0);
  const [coordinates, setCoordinates] = useState({x: 0, y: 0});
  const [animationInProgress, setAnimationInProgress] = useState(false);

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
    if (timer) {
      clearInterval(timer);
    }

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

      timer = setInterval(() => {
        editText();
      }, 100);
    }, 1000);
  };

  const onRestartPress = () => {
    setRewardPoints(1000);
    setPoints(0);
  };

  const setCoordinatesHandler = (pageX: number, pageY: number) => {
    setCoordinates({x: pageX, y: pageY});
  };

  const renderPoints = () => {
    return [...new Array(rewardPoints > 10 ? 10 : rewardPoints)].map(
      (value, index) => {
        return (
          <PointImage
            onAnimationEnd={onAnimationEnd}
            coordinates={coordinates}
            key={index}
            animationInProgress={animationInProgress}
            index={index}
            isLast={index === (rewardPoints > 10 ? 10 : rewardPoints) - 1}
          />
        );
      },
    );
  };

  const renderScrollItems = () => {
    return scrollItems.map(item => (
      <View key={item.id} style={styles.scrollItem}>
        <Text style={styles.scrollText}>{item.item}</Text>
      </View>
    ));
  };

  const takeCoordinates = () => {
    if (imageViewRef.current) {
      imageViewRef.current.measure((x, y, width, height, pageX, pageY) => {
        setCoordinatesHandler(pageX, pageY);
      });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.scoreboard}>
          <View ref={imageViewRef} onLayout={takeCoordinates}>
            <Image source={require('./assets/icon.png')} />
          </View>
          <AnimatedTextInput
            value={`${points}`}
            style={pointsStyle}
            ref={pointsRef}
            editable={false}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderScrollItems()}
        </ScrollView>
        <View style={styles.block}>
          <View style={styles.pointsContainer}>
            <Image source={require('./assets/icon.png')} />
            {renderPoints()}
            <TextInput
              value={`${rewardPoints}`}
              style={styles.pointText}
              ref={rewardsRef}
              editable={false}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                (animationInProgress || rewardPoints === 0) && styles.disabled,
              ]}
              onPress={onVotePress}
              disabled={animationInProgress || rewardPoints === 0}>
              <Text style={styles.text}>Vote</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRestartPress} style={styles.button}>
              <Text style={styles.text}>Restart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scoreboard: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0b142b',
    alignSelf: 'center',
    marginBottom: 8,
    borderRadius: 16,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  scrollItem: {
    width: '80%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2ec2bd',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  block: {
    marginHorizontal: 10,
    borderRadius: 16,
    padding: 10,
    borderWidth: 2,
    borderColor: '#0b142b',
  },
  pointsContainer: {
    minWidth: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#0b142b',
    marginBottom: 8,
  },
  scrollText: {
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 28,
    color: '#192841',
  },
  pointText: {
    fontSize: 20,
    lineHeight: 24,
    color: '#fff5b2',
    marginLeft: 10,
  },
  scoreItem: {
    fontSize: 20,
    lineHeight: 24,
    color: '#fff5b2',
    marginLeft: 10,
  },
  button: {
    width: '40%',
    padding: 15,
    backgroundColor: '#0b142b',
    borderRadius: 16,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    fontSize: 25,
    lineHeight: 32,
    color: '#6fffe9',
    alignSelf: 'center',
  },
});

export default App;
