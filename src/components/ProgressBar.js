import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function ProgressBar({ progress = 0, total = 1, color = COLORS.green, showText = false }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const percentage = Math.min((progress / total) * 100, 100);

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: percentage,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [percentage]);

  const width = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { width, backgroundColor: color },
          ]}
        />
        {/* Shine effect */}
        <Animated.View
          style={[
            styles.shine,
            { width },
          ]}
        />
      </View>
      {showText && (
        <Text style={styles.text}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
  shine: {
    position: 'absolute',
    top: 2,
    left: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMedium,
    minWidth: 35,
    textAlign: 'right',
  },
});
