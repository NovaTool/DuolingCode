import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function XPBadge({ xp, animate = false }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.4, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [animate]);

  return (
    <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
      <Text style={styles.icon}>⚡</Text>
      <Text style={styles.text}>+{xp} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.yellowLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.yellowDark,
  },
});
