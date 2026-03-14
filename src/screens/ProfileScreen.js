import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const ACHIEVEMENTS = [
  { id: 1, icon: '🔥', title: 'Première flamme', desc: '1 jour de suite', unlocked: true },
  { id: 2, icon: '⭐', title: 'Première étoile', desc: '1ère leçon', unlocked: true },
  { id: 3, icon: '🏆', title: 'Champion Python', desc: '5 leçons', unlocked: false },
  { id: 4, icon: '💎', title: 'Collectionneur', desc: '100 gemmes', unlocked: false },
  { id: 5, icon: '🚀', title: 'Fusée', desc: '7 jours de suite', unlocked: false },
  { id: 6, icon: '🦉', title: 'Sage Chouette', desc: '50 leçons', unlocked: false },
];

const TIME_LABELS = { 3: '3 min · Décontracté', 5: '5 min · Normal', 10: '10 min · Sérieux', 20: '20 min · Intense' };

export default function ProfileScreen() {
  const { user, course, settings } = useApp();
  const { colors: C, isDark, setIsDark } = useTheme();

  const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedLessons = user.completedLessons.length;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[s.header, { borderBottomColor: C.border }]}>
          <View style={[s.avatarWrap, { backgroundColor: C.backgroundGray, borderColor: C.green }]}>
            <Text style={s.avatar}>{user.avatar}</Text>
          </View>
          <Text style={[s.name, { color: C.textDark }]}>{user.name || 'Apprenant'}</Text>
          <Text style={[s.username, { color: C.textMedium }]}>{user.username || '@apprenant'}</Text>
          <View style={[s.levelBadge, { backgroundColor: C.blue }]}>
            <Text style={s.levelText}>NIVEAU {user.level}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsGrid}>
          {[
            { icon: '🔥', value: user.streak, label: 'Jours de suite', color: C.orange },
            { icon: '⚡', value: user.xp, label: 'XP Total', color: C.yellow },
            { icon: '💎', value: user.gems, label: 'Gemmes', color: C.blue },
            { icon: '❤️', value: user.hearts, label: 'Cœurs', color: C.red },
          ].map(st => (
            <View key={st.label} style={[s.statCard, { backgroundColor: C.backgroundGray, borderTopColor: st.color, borderTopWidth: 3 }]}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
              <Text style={[s.statLabel, { color: C.textMedium }]}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings section */}
        <View style={{ padding: 16 }}>
          <Text style={[s.sectionTitle, { color: C.textDark }]}>⚙️ Paramètres</Text>
          <View style={[s.settingRow, { backgroundColor: C.backgroundGray, borderColor: C.border }]}>
            <View>
              <Text style={[s.settingLabel, { color: C.textDark }]}>Thème</Text>
              <Text style={[s.settingVal, { color: C.textMedium }]}>{isDark ? '🌙 Sombre' : '☀️ Clair'}</Text>
            </View>
            <TouchableOpacity
              style={[s.toggleBtn, { backgroundColor: isDark ? C.blue : C.yellow }]}
              onPress={() => setIsDark(!isDark)}
            >
              <Text style={s.toggleTxt}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
          <View style={[s.settingRow, { backgroundColor: C.backgroundGray, borderColor: C.border }]}>
            <View>
              <Text style={[s.settingLabel, { color: C.textDark }]}>Objectif quotidien</Text>
              <Text style={[s.settingVal, { color: C.textMedium }]}>⏱️ {TIME_LABELS[settings.timeGoal]}</Text>
            </View>
          </View>
          <View style={[s.settingRow, { backgroundColor: C.backgroundGray, borderColor: C.border }]}>
            <View>
              <Text style={[s.settingLabel, { color: C.textDark }]}>Langage</Text>
              <Text style={[s.settingVal, { color: C.textMedium }]}>🐍 {settings.codingLanguage}</Text>
            </View>
          </View>
        </View>

        {/* Progression */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={[s.sectionTitle, { color: C.textDark }]}>🐍 Progression Python</Text>
          <View style={[s.progressCard, { backgroundColor: C.backgroundGray }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={[s.progressLabel, { color: C.textMedium }]}>{completedLessons}/{totalLessons} leçons</Text>
              <Text style={[s.progressPct, { color: C.green }]}>{progressPercent}%</Text>
            </View>
            <View style={[s.track, { backgroundColor: C.border }]}>
              <View style={[s.fill, { width: `${progressPercent}%`, backgroundColor: C.green }]} />
            </View>
            <Text style={[s.progressHint, { color: C.textMedium }]}>
              {progressPercent === 0 ? '🚀 Lance-toi !' : progressPercent === 100 ? '🎉 Félicitations !' : `Continue ! ${totalLessons - completedLessons} leçons restantes`}
            </Text>
          </View>
        </View>

        {/* Units */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={[s.sectionTitle, { color: C.textDark }]}>📚 Unités</Text>
          {course.units.map(unit => {
            const done = unit.lessons.filter(l => user.completedLessons.includes(l.id)).length;
            return (
              <View key={unit.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <View style={[s.unitIcon, { backgroundColor: unit.color }]}><Text style={{ fontSize: 18 }}>{unit.icon}</Text></View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.textDark }}>{unit.title}</Text>
                  <Text style={{ fontSize: 12, color: C.textMedium }}>{done}/{unit.lessons.length} leçons</Text>
                  <View style={[s.track, { backgroundColor: C.border }]}>
                    <View style={[s.fill, { width: `${(done / unit.lessons.length) * 100}%`, backgroundColor: unit.color }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Achievements */}
        <View style={{ padding: 16 }}>
          <Text style={[s.sectionTitle, { color: C.textDark }]}>🏅 Succès</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {ACHIEVEMENTS.map(a => (
              <View key={a.id} style={[s.achievement, {
                backgroundColor: C.backgroundGray,
                borderColor: a.unlocked ? C.yellow : C.border,
                opacity: a.unlocked ? 1 : 0.5,
              }]}>
                <Text style={[s.achIcon, !a.unlocked && { opacity: 0.4 }]}>{a.unlocked ? a.icon : '🔒'}</Text>
                <Text style={[s.achTitle, { color: C.textDark }]}>{a.title}</Text>
                <Text style={[s.achDesc, { color: C.textMedium }]}>{a.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: 24, paddingBottom: 20, borderBottomWidth: 2 },
  avatarWrap: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: 12 },
  avatar: { fontSize: 52 },
  name: { fontSize: 22, fontWeight: '800' },
  username: { fontSize: 14, marginBottom: 8 },
  levelBadge: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginTop: 4 },
  levelText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 10 },
  statCard: { flex: 1, minWidth: '45%', borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: 26, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 12 },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8,
  },
  settingLabel: { fontSize: 15, fontWeight: '700' },
  settingVal: { fontSize: 13, marginTop: 2 },
  toggleBtn: { padding: 8, borderRadius: 10 },
  toggleTxt: { fontSize: 18 },
  progressCard: { borderRadius: 16, padding: 16, gap: 8 },
  progressLabel: { fontSize: 14, fontWeight: '600' },
  progressPct: { fontSize: 14, fontWeight: '800' },
  track: { height: 10, borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  progressHint: { fontSize: 13, fontStyle: 'italic', marginTop: 4 },
  unitIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  achievement: { width: '30%', flex: 1, minWidth: '28%', borderRadius: 12, padding: 12, alignItems: 'center', gap: 4, borderWidth: 2 },
  achIcon: { fontSize: 28 },
  achTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  achDesc: { fontSize: 10, textAlign: 'center' },
});
