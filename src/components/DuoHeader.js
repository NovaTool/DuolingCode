import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

export default function DuoHeader() {
  const { user } = useApp();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Logo */}
      <View style={styles.logo}>
        <Text style={styles.logoEmoji}>🦉</Text>
        <Text style={styles.logoText}>DuolingCode</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        {/* Streak */}
        <TouchableOpacity style={styles.stat}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{user.streak}</Text>
        </TouchableOpacity>

        {/* Gems */}
        <TouchableOpacity style={styles.stat}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={[styles.statValue, { color: COLORS.blue }]}>{user.gems}</Text>
        </TouchableOpacity>

        {/* Hearts */}
        <TouchableOpacity style={styles.stat}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={[styles.statValue, { color: COLORS.red }]}>{user.hearts}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: {
    fontSize: 26,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.green,
    letterSpacing: -0.5,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
});
