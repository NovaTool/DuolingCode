import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function LessonNode({ lesson, unitColor, unitDarkColor, index, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 30 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  const isCompleted = lesson.status === 'completed';
  const isActive = lesson.status === 'active';
  const isLocked = lesson.status === 'locked';

  // Zigzag offset like Duolingo
  const zigzag = [0, 40, 70, 40, 0, -40, -70, -40];
  const offset = zigzag[index % zigzag.length] || 0;

  const getBgColor = () => {
    if (isCompleted) return unitColor;
    if (isActive) return unitColor;
    return '#E5E5E5';
  };

  const getShadowColor = () => {
    if (isCompleted) return unitDarkColor;
    if (isActive) return unitDarkColor;
    return '#AFAFAF';
  };

  return (
    <View style={[styles.wrapper, { marginLeft: offset + 120 }]}>
      {isActive && (
        <View style={[styles.activePulse, { borderColor: unitColor }]} />
      )}
      <TouchableOpacity
        onPress={() => onPress(lesson)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLocked}
        activeOpacity={1}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {/* Shadow layer */}
          <View style={[styles.nodeShadow, { backgroundColor: getShadowColor() }]} />
          {/* Main button */}
          <View style={[styles.node, { backgroundColor: getBgColor() }]}>
            {isLocked ? (
              <Text style={styles.lockIcon}>🔒</Text>
            ) : isCompleted ? (
              <Text style={styles.icon}>✓</Text>
            ) : (
              <Text style={styles.icon}>{lesson.icon}</Text>
            )}
          </View>
          {/* Star indicator for completed */}
          {isCompleted && (
            <View style={styles.starsContainer}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.star}>⭐</Text>
            </View>
          )}
          {/* Active tooltip */}
          {isActive && (
            <View style={[styles.tooltip, { backgroundColor: unitColor }]}>
              <Text style={styles.tooltipText}>{lesson.title}</Text>
              <View style={[styles.tooltipArrow, { borderTopColor: unitColor }]} />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  activePulse: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    opacity: 0.3,
    top: -10,
  },
  nodeShadow: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 70,
    borderRadius: 35,
  },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '900',
  },
  lockIcon: {
    fontSize: 26,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    gap: -2,
  },
  star: {
    fontSize: 12,
  },
  tooltip: {
    position: 'absolute',
    top: -50,
    left: '50%',
    transform: [{ translateX: -50 }],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
