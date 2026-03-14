import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function LessonNode({ lesson, unitColor, unitDarkColor, index, onPress }) {
  const { colors: C } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onIn  = () => Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 30 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const isCompleted = lesson.status === 'completed';
  const isActive    = lesson.status === 'active';
  const isLocked    = lesson.status === 'locked';

  const zigzag = [0, 40, 70, 40, 0, -40, -70, -40];
  const offset = zigzag[index % zigzag.length] || 0;

  return (
    <View style={[s.wrapper, { marginLeft: offset + 120 }]}>
      {isActive && <View style={[s.pulse, { borderColor: unitColor }]} />}
      <TouchableOpacity
        onPress={() => onPress(lesson)}
        onPressIn={onIn} onPressOut={onOut}
        disabled={isLocked} activeOpacity={1}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={[s.shadow, { backgroundColor: isLocked ? C.borderDark : unitDarkColor }]} />
          <View style={[s.node, { backgroundColor: isLocked ? C.border : unitColor }]}>
            {isLocked
              ? <Text style={s.lock}>🔒</Text>
              : isCompleted
                ? <Text style={[s.icon, { color: '#fff' }]}>✓</Text>
                : <Text style={s.icon}>{lesson.icon}</Text>
            }
          </View>
          {isCompleted && (
            <View style={s.stars}>
              <Text style={s.star}>⭐</Text><Text style={s.star}>⭐</Text><Text style={s.star}>⭐</Text>
            </View>
          )}
          {isActive && (
            <View style={[s.tooltip, { backgroundColor: unitColor }]}>
              <Text style={s.tooltipTxt}>{lesson.title}</Text>
              <View style={[s.tooltipArrow, { borderTopColor: unitColor }]} />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: 8 },
  pulse: { position: 'absolute', width: 90, height: 90, borderRadius: 45, borderWidth: 3, opacity: 0.3, top: -10 },
  shadow: { position: 'absolute', bottom: -4, left: 0, right: 0, height: 70, borderRadius: 35 },
  node: {
    width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  icon: { fontSize: 30, fontWeight: '900' },
  lock: { fontSize: 26 },
  stars: { flexDirection: 'row', justifyContent: 'center', marginTop: 6, gap: -2 },
  star: { fontSize: 12 },
  tooltip: {
    position: 'absolute', top: -50, left: '50%', transform: [{ translateX: -50 }],
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, minWidth: 100, alignItems: 'center',
  },
  tooltipTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  tooltipArrow: {
    position: 'absolute', bottom: -6, width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
});
