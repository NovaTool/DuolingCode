import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function UnitHeader({ unit, onGuidebookPress }) {
  return (
    <View style={[styles.container, { backgroundColor: unit.color }]}>
      <View style={styles.left}>
        <Text style={styles.section}>SECTION {unit.id.split('_')[1]}</Text>
        <Text style={styles.title}>{unit.title}</Text>
        <Text style={styles.description}>{unit.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.guidebook}
        onPress={() => onGuidebookPress?.(unit)}
      >
        <Text style={styles.guidebookIcon}>📖</Text>
        <Text style={styles.guidebookText}>Guide</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 16,
    padding: 16,
  },
  left: {
    flex: 1,
  },
  section: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  guidebook: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    minWidth: 60,
  },
  guidebookIcon: {
    fontSize: 22,
  },
  guidebookText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },
});
