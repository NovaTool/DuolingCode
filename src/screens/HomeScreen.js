import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import DuoHeader from '../components/DuoHeader';
import UnitHeader from '../components/UnitHeader';
import LessonNode from '../components/LessonNode';
import { COLORS } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const { course, user } = useApp();
  const [selectedLesson, setSelectedLesson] = React.useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const handleLessonPress = (lesson) => {
    if (lesson.status === 'locked') return;
    setSelectedLesson(lesson);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  };

  const handleModalClose = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedLesson(null));
  };

  const handleStartLesson = () => {
    if (!selectedLesson) return;
    handleModalClose();
    setTimeout(() => {
      navigation.navigate('Lesson', { lesson: selectedLesson });
    }, 220);
  };

  // XP progress to next level
  const xpInLevel = user.xp % 100;
  const xpNeeded = 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DuoHeader />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* XP Bar */}
        <View style={styles.xpSection}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>⚡ {user.xp} XP total</Text>
            <Text style={styles.levelBadge}>Niv. {user.level}</Text>
          </View>
          <View style={styles.xpTrack}>
            <View
              style={[
                styles.xpFill,
                { width: `${(xpInLevel / xpNeeded) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Course units + lessons */}
        {course.units.map((unit, unitIndex) => (
          <View key={unit.id} style={styles.unitSection}>
            <UnitHeader unit={unit} />

            {/* Lesson nodes */}
            <View style={styles.nodesContainer}>
              {unit.lessons.map((lesson, lessonIndex) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  unitColor={unit.color}
                  unitDarkColor={unit.darkColor}
                  index={lessonIndex}
                  onPress={handleLessonPress}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Bottom padding */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Lesson Preview Modal */}
      <Modal
        visible={!!selectedLesson}
        transparent
        animationType="none"
        onRequestClose={handleModalClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleModalClose}
        />
        {selectedLesson && (
          <Animated.View
            style={[
              styles.modal,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalContent}>
              {/* Lesson icon */}
              <View style={styles.modalIconWrap}>
                <Text style={styles.modalIcon}>{selectedLesson.icon}</Text>
              </View>

              <Text style={styles.modalTitle}>{selectedLesson.title}</Text>
              <Text style={styles.modalDesc}>{selectedLesson.description}</Text>

              {/* Stats row */}
              <View style={styles.statsRow}>
                <View style={styles.statChip}>
                  <Text style={styles.statChipIcon}>⚡</Text>
                  <Text style={styles.statChipText}>{selectedLesson.xp} XP</Text>
                </View>
                <View style={styles.statChip}>
                  <Text style={styles.statChipIcon}>📝</Text>
                  <Text style={styles.statChipText}>{selectedLesson.exercises?.length || 0} exercices</Text>
                </View>
                <View style={[styles.statChip, {
                  backgroundColor: selectedLesson.status === 'completed'
                    ? COLORS.greenLight
                    : COLORS.yellowLight
                }]}>
                  <Text style={styles.statChipIcon}>
                    {selectedLesson.status === 'completed' ? '✅' : '🎯'}
                  </Text>
                  <Text style={styles.statChipText}>
                    {selectedLesson.status === 'completed' ? 'Terminé' : 'Nouveau'}
                  </Text>
                </View>
              </View>

              {/* Start button */}
              <TouchableOpacity
                style={styles.startBtnWrap}
                onPress={handleStartLesson}
                activeOpacity={0.85}
              >
                <View style={styles.startBtnShadow} />
                <View style={styles.startBtn}>
                  <Text style={styles.startBtnText}>
                    {selectedLesson.status === 'completed' ? 'REJOUER' : 'COMMENCER'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  xpSection: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  levelBadge: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.blue,
  },
  xpTrack: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: COLORS.blue,
    borderRadius: 5,
  },
  unitSection: {
    marginBottom: 8,
  },
  nodesContainer: {
    paddingVertical: 8,
    paddingBottom: 20,
  },
  // Modal
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modal: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalIcon: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  modalDesc: {
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.backgroundGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statChipIcon: {
    fontSize: 14,
  },
  statChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  startBtnWrap: {
    width: '100%',
  },
  startBtnShadow: {
    position: 'absolute',
    bottom: -4,
    left: 0, right: 0,
    height: 52,
    backgroundColor: COLORS.greenShadow,
    borderRadius: 16,
  },
  startBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
});
