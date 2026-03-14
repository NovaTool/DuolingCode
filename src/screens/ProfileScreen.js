import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

const ACHIEVEMENTS = [
  { id: 1, icon: '🔥', title: 'Première flamme', desc: '1 jour de suite', unlocked: true },
  { id: 2, icon: '⭐', title: 'Première étoile', desc: 'Première leçon complétée', unlocked: true },
  { id: 3, icon: '🏆', title: 'Champion Python', desc: 'Terminer 5 leçons', unlocked: false },
  { id: 4, icon: '💎', title: 'Collectionneur', desc: '100 gemmes gagnées', unlocked: false },
  { id: 5, icon: '🚀', title: 'Fusée', desc: '7 jours de suite', unlocked: false },
  { id: 6, icon: '🦉', title: 'Sage Chouette', desc: '50 leçons complétées', unlocked: false },
];

export default function ProfileScreen() {
  const { user, course } = useApp();

  const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedLessons = user.completedLessons.length;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>{user.avatar}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>

          {/* Level badge */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>NIVEAU {user.level}</Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="🔥" value={user.streak} label="Jours de suite" color={COLORS.orange} />
          <StatCard icon="⚡" value={user.xp} label="XP Total" color={COLORS.yellow} />
          <StatCard icon="💎" value={user.gems} label="Gemmes" color={COLORS.blue} />
          <StatCard icon="❤️" value={user.hearts} label="Cœurs" color={COLORS.red} />
        </View>

        {/* Course progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐍 Progression Python</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>{completedLessons}/{totalLessons} leçons</Text>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressHint}>
              {progressPercent === 0
                ? 'Lance-toi ! Ta première leçon t\'attend 🚀'
                : progressPercent === 100
                ? 'Félicitations ! Tu as maîtrisé Python ! 🎉'
                : `Continue comme ça ! ${totalLessons - completedLessons} leçons restantes`
              }
            </Text>
          </View>
        </View>

        {/* Course units progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Unités</Text>
          {course.units.map(unit => {
            const unitCompleted = unit.lessons.filter(l =>
              user.completedLessons.includes(l.id)
            ).length;
            const unitTotal = unit.lessons.length;
            return (
              <View key={unit.id} style={styles.unitRow}>
                <View style={[styles.unitIcon, { backgroundColor: unit.color }]}>
                  <Text style={{ fontSize: 18 }}>{unit.icon}</Text>
                </View>
                <View style={styles.unitInfo}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitSub}>{unitCompleted}/{unitTotal} leçons</Text>
                  <View style={styles.unitTrack}>
                    <View style={[
                      styles.unitFill,
                      { width: `${(unitCompleted / unitTotal) * 100}%`, backgroundColor: unit.color }
                    ]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 Succès</Text>
          <View style={styles.achievements}>
            {ACHIEVEMENTS.map(a => (
              <View
                key={a.id}
                style={[styles.achievement, !a.unlocked && styles.achievementLocked]}
              >
                <Text style={[styles.achievementIcon, !a.unlocked && styles.achievementIconLocked]}>
                  {a.unlocked ? a.icon : '🔒'}
                </Text>
                <Text style={[styles.achievementTitle, !a.unlocked && styles.achievementTextLocked]}>
                  {a.title}
                </Text>
                <Text style={[styles.achievementDesc, !a.unlocked && styles.achievementTextLocked]}>
                  {a.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.green,
    marginBottom: 12,
  },
  avatar: {
    fontSize: 52,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  username: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: { fontSize: 22 },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.green,
  },
  progressTrack: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 6,
  },
  progressHint: {
    fontSize: 13,
    color: COLORS.textMedium,
    fontStyle: 'italic',
    marginTop: 4,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  unitIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitInfo: {
    flex: 1,
    gap: 4,
  },
  unitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  unitSub: {
    fontSize: 12,
    color: COLORS.textMedium,
  },
  unitTrack: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  unitFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievement: {
    width: '30%',
    flex: 1,
    minWidth: '28%',
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: COLORS.yellow,
  },
  achievementLocked: {
    borderColor: COLORS.border,
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 10,
    color: COLORS.textMedium,
    textAlign: 'center',
  },
  achievementTextLocked: {
    color: COLORS.textLight,
  },
});
