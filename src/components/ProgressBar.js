import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ProgressBar({ progress = 0, total = 1, color }) {
  const { colors: C } = useTheme();
  const fillColor = color || C.green;
  const animValue = useRef(new Animated.Value(0)).current;
  const percentage = Math.min((progress / total) * 100, 100);

  useEffect(() => {
    Animated.spring(animValue, { toValue: percentage, useNativeDriver: false, tension: 50, friction: 7 }).start();
  }, [percentage]);

  const width = animValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[s.track, { backgroundColor: C.border }]}>
      <Animated.View style={[s.fill, { width, backgroundColor: fillColor }]} />
      <Animated.View style={[s.shine, { width }]} />
    </View>
  );
}

const s = StyleSheet.create({
  track: { flex: 1, height: 16, borderRadius: 8, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 8 },
  shine: {
    position: 'absolute', top: 2, left: 0,
    height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2,
  },
});
