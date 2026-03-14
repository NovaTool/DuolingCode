import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UnitHeader({ unit, onGuidebookPress }) {
  return (
    <View style={[s.container, { backgroundColor: unit.color }]}>
      <View style={s.left}>
        <Text style={s.section}>SECTION {unit.id.split('_')[1]}</Text>
        <Text style={s.title}>{unit.title}</Text>
        <Text style={s.desc}>{unit.description}</Text>
      </View>
      <TouchableOpacity style={s.guide} onPress={() => onGuidebookPress?.(unit)}>
        <Text style={s.guideIcon}>📖</Text>
        <Text style={s.guideText}>Guide</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 16, marginBottom: 4, borderRadius: 16, padding: 16,
  },
  left: { flex: 1 },
  section: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', letterSpacing: 1, marginBottom: 2 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 2 },
  desc: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  guide: {
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12, padding: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', minWidth: 60,
  },
  guideIcon: { fontSize: 22 },
  guideText: { fontSize: 11, fontWeight: '700', color: '#fff', marginTop: 2 },
});
