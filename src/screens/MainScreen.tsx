import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {scrollItems} from '../constants/scrollItems';
import {PointImage} from '../components/PointImage';
import {useMain} from '../hooks/useMain';
import Animated from 'react-native-reanimated';
import {ICONS} from '../constants/icons';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const MainScreen = () => {
  const {
    points,
    pointsRef,
    rewardPoints,
    rewardsRef,
    onAnimationEnd,
    animationInProgress,
    pointsStyle,
    onRestartPress,
    scoreBoardPosition,
    getScoreBoardCoordinates,
    onVotePress,
    imageViewRef,
  } = useMain();

  const renderPoints = () => {
    return [...new Array(rewardPoints > 10 ? 10 : rewardPoints)].map(
      (value, index) => {
        return (
          <PointImage
            onAnimationEnd={onAnimationEnd}
            coordinates={scoreBoardPosition}
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scoreboard}>
        <View ref={imageViewRef} onLayout={getScoreBoardCoordinates}>
          <Image source={ICONS.coin} />
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
          <Image source={ICONS.coin} />
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

export default MainScreen;
