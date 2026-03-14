import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export default function DuoHeader() {
  const { user } = useApp();
  const { colors: C } = useTheme();

  return (
    <View style={[s.container, { backgroundColor: C.background, borderBottomColor: C.border }]}>
      <View style={s.logo}>
        <Text style={s.logoEmoji}>🦉</Text>
        <Text style={[s.logoText, { color: C.green }]}>DuolingCode</Text>
      </View>
      <View style={s.stats}>
        <TouchableOpacity style={s.stat}>
          <Text style={s.statIcon}>🔥</Text>
          <Text style={[s.statVal, { color: C.orange }]}>{user.streak}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.stat}>
          <Text style={s.statIcon}>💎</Text>
          <Text style={[s.statVal, { color: C.blue }]}>{user.gems}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.stat}>
          <Text style={s.statIcon}>❤️</Text>
          <Text style={[s.statVal, { color: C.red }]}>{user.hearts}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 2,
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoEmoji: { fontSize: 26 },
  logoText: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 18 },
  statVal: { fontSize: 15, fontWeight: '700' },
});
