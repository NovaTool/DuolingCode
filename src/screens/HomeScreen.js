import React, { useRef, useState, useEffect } from 'react';
import {
  View, ScrollView, Text, TouchableOpacity, Modal,
  Animated, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, EXERCISES_FOR_GOAL } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import DuoHeader from '../components/DuoHeader';
import UnitHeader from '../components/UnitHeader';
import LessonNode from '../components/LessonNode';

// Animated unit section
function AnimatedUnit({ unit, index, onLessonPress }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1, duration: 500,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
    }}>
      <UnitHeader unit={unit} />
      <View style={{ paddingVertical: 8, paddingBottom: 20 }}>
        {unit.lessons.map((lesson, i) => (
          <LessonNode
            key={lesson.id} lesson={lesson}
            unitColor={unit.color} unitDarkColor={unit.darkColor}
            index={i} onPress={onLessonPress}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const { course, user, settings } = useApp();
  const { colors: C } = useTheme();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openLesson = (lesson) => {
    if (lesson.status === 'locked') return;
    setSelectedLesson(lesson);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 10 }),
      Animated.timing(overlayOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const closeModal = (cb) => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 400, duration: 220, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => { setSelectedLesson(null); cb?.(); });
  };

  const startLesson = () => closeModal(() => {
    setTimeout(() => navigation.navigate('Lesson', { lesson: selectedLesson }), 220);
  });

  const xpInLevel = user.xp % 100;
  const maxEx = EXERCISES_FOR_GOAL[settings.timeGoal] ?? 8;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      <DuoHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>
        {/* XP bar */}
        <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.textMedium }}>⚡ {user.xp} XP</Text>
            <Text style={{ fontSize: 13, fontWeight: '800', color: C.blue }}>Niv. {user.level}</Text>
          </View>
          <View style={{ height: 10, backgroundColor: C.border, borderRadius: 5, overflow: 'hidden' }}>
            <Animated.View style={{ height: '100%', width: `${xpInLevel}%`, backgroundColor: C.blue, borderRadius: 5 }} />
          </View>
        </View>

        {/* Goal chip */}
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <View style={{ backgroundColor: C.backgroundGray, borderColor: C.border, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ fontSize: 13, color: C.textMedium, fontWeight: '600' }}>
              🎯 Objectif : {settings.timeGoal} min/jour · {maxEx} exercices/leçon
            </Text>
          </View>
        </View>

        {/* Animated units */}
        {course.units.map((unit, i) => (
          <AnimatedUnit key={unit.id} unit={unit} index={i} onLessonPress={openLesson} />
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Modal overlay */}
      {selectedLesson && (
        <>
          <Animated.View
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', opacity: overlayOpacity }]}
            pointerEvents="auto"
          >
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => closeModal()} activeOpacity={1} />
          </Animated.View>

          <Animated.View style={[s.modal, { backgroundColor: C.background, transform: [{ translateY: slideAnim }] }]}>
            <View style={[s.handle, { backgroundColor: C.border }]} />
            <View style={{ padding: 24, alignItems: 'center' }}>
              <View style={[s.iconWrap, { backgroundColor: C.backgroundGray }]}>
                <Text style={{ fontSize: 40 }}>{selectedLesson.icon}</Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: C.textDark, marginBottom: 6 }}>
                {selectedLesson.title}
              </Text>
              <Text style={{ fontSize: 16, color: C.textMedium, textAlign: 'center', marginBottom: 20 }}>
                {selectedLesson.description}
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                {[
                  { icon: '⚡', text: `${selectedLesson.xp} XP`, bg: C.yellowLight, color: C.yellow },
                  { icon: '📝', text: `${Math.min(selectedLesson.exercises?.length ?? 0, maxEx)} exos`, bg: C.backgroundGray, color: C.textDark },
                  { icon: '⏱️', text: `${settings.timeGoal} min`, bg: C.backgroundGray, color: C.textDark },
                ].map(c => (
                  <View key={c.icon} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: c.bg }}>
                    <Text>{c.icon}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: c.color }}>{c.text}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={{ width: '100%' }} onPress={startLesson} activeOpacity={0.85}>
                <View style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 52, backgroundColor: '#3A8E00', borderRadius: 16 }} />
                <View style={{ backgroundColor: C.green, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1 }}>
                    {selectedLesson.status === 'completed' ? 'REJOUER' : 'COMMENCER'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  modal: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 20,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
});
