import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp, EXERCISES_FOR_GOAL } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import ProgressBar from '../components/ProgressBar';

const NONE = 'none', CORRECT = 'correct', WRONG = 'wrong';

// ── Particle burst on correct answer ─────────────────────────────────────
const BURST_COLORS = ['#FFD700','#58CC02','#1CB0F6','#FF4B4B','#CE82FF','#FF9600','#FFFFFF'];
function BurstEffect({ trigger }) {
  const particles = useRef(
    Array.from({ length: 8 }, () => ({
      x: new Animated.Value(0), y: new Animated.Value(0),
      opacity: new Animated.Value(0), scale: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!trigger) return;
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    const anims = particles.map((p, i) => {
      const rad = (angles[i] * Math.PI) / 180;
      const dist = 55 + Math.random() * 30;
      p.x.setValue(0); p.y.setValue(0); p.opacity.setValue(0); p.scale.setValue(0);
      return Animated.sequence([
        Animated.parallel([
          Animated.spring(p.scale, { toValue: 1, useNativeDriver: true, speed: 40 }),
          Animated.timing(p.opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(p.x, { toValue: Math.cos(rad) * dist, duration: 450, useNativeDriver: true }),
          Animated.timing(p.y, { toValue: Math.sin(rad) * dist, duration: 450, useNativeDriver: true }),
        ]),
        Animated.timing(p.opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]);
    });
    Animated.stagger(20, anims).start();
  }, [trigger]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 10, height: 10, borderRadius: 5,
          backgroundColor: BURST_COLORS[i % BURST_COLORS.length],
          transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }],
          opacity: p.opacity,
        }} />
      ))}
    </View>
  );
}

// ── Word-order chips ──────────────────────────────────────────────────────
function WordOrderExercise({ words, onAnswerChange, feedback, C }) {
  const [available, setAvailable] = useState(() =>
    [...words].sort(() => Math.random() - 0.5).map((w, i) => ({ id: i, text: w }))
  );
  const [placed, setPlaced] = useState([]);

  const add = (word) => {
    if (feedback !== NONE) return;
    const next = [...placed, word];
    setAvailable(a => a.filter(w => w.id !== word.id));
    setPlaced(next);
    onAnswerChange(next.map(w => w.text).join(' '));
  };
  const remove = (word) => {
    if (feedback !== NONE) return;
    const next = placed.filter(w => w.id !== word.id);
    setAvailable(a => [...a, word].sort((x, y) => x.id - y.id));
    setPlaced(next);
    onAnswerChange(next.map(w => w.text).join(' '));
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={[wo.zone, {
        borderColor: feedback === CORRECT ? C.green : feedback === WRONG ? C.red : C.border,
        backgroundColor: feedback === CORRECT ? C.greenLight : feedback === WRONG ? C.redLight : C.backgroundCard,
      }]}>
        {placed.length === 0
          ? <Text style={{ color: C.textLight, fontSize: 14, fontStyle: 'italic' }}>
              Tape les mots dans le bon ordre...
            </Text>
          : <View style={wo.row}>
              {placed.map(w => (
                <TouchableOpacity key={w.id} onPress={() => remove(w)} style={[wo.chip, {
                  borderColor: feedback === CORRECT ? C.green : feedback === WRONG ? C.red : C.blue,
                  backgroundColor: feedback === CORRECT ? C.greenLight : feedback === WRONG ? C.redLight : C.blue + '22',
                }]}>
                  <Text style={[wo.txt, { color: feedback === CORRECT ? C.green : feedback === WRONG ? C.red : C.blue }]}>
                    {w.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
        }
      </View>
      <View style={{ height: 2, backgroundColor: C.border, borderRadius: 1 }} />
      <View style={wo.row}>
        {available.map(w => (
          <TouchableOpacity key={w.id} onPress={() => add(w)} style={[wo.chip, { borderColor: C.border, backgroundColor: C.backgroundGray }]}>
            <Text style={[wo.txt, { color: C.textDark }]}>{w.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const wo = StyleSheet.create({
  zone: { minHeight: 64, borderWidth: 2, borderRadius: 12, padding: 12, justifyContent: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 2, borderBottomWidth: 4 },
  txt: { fontSize: 15, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
});

// ── Main screen ────────────────────────────────────────────────────────────
export default function LessonScreen({ route, navigation }) {
  const { lesson } = route.params;
  const { completeLesson, loseHeart, user, settings } = useApp();
  const { colors: C } = useTheme();

  const maxEx = EXERCISES_FOR_GOAL[settings.timeGoal] ?? 8;
  const exercises = useMemo(() => lesson.exercises.slice(0, maxEx), [lesson, maxEx]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [fill, setFill] = useState('');
  const [order, setOrder] = useState('');
  const [feedback, setFeedback] = useState(NONE);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [burstKey, setBurstKey] = useState(null); // triggers burst
  const [woKey, setWoKey] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Finish screen animations
  const trophyScale = useRef(new Animated.Value(0)).current;
  const statsSlide = useRef(new Animated.Value(40)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;

  const current = exercises[idx];

  const shake = () => Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
  ]).start();

  const bounceCorrect = () => Animated.sequence([
    Animated.spring(scaleAnim, { toValue: 1.04, useNativeDriver: true, speed: 60 }),
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 60 }),
  ]).start();

  const canCheck = () => {
    if (current.type === 'multiple_choice') return !!selected;
    if (current.type === 'fill_blank') return fill.trim().length > 0;
    if (current.type === 'code_order') return order.length > 0;
    return false;
  };

  // Normalize: remove all whitespace for comparison (handles "score=100" vs "score = 100")
  const norm = (s) => s.replace(/\s+/g, '');

  const handleCheck = () => {
    if (feedback !== NONE || !canCheck()) return;
    let ok = false;
    if (current.type === 'multiple_choice') {
      ok = current.options.find(o => o.id === selected)?.correct === true;
    } else if (current.type === 'fill_blank') {
      ok = fill.trim().toLowerCase() === current.answer.toLowerCase();
    } else if (current.type === 'code_order') {
      // Normalize both sides: remove all spaces before comparing
      ok = norm(order) === norm(current.answer);
    }

    if (ok) {
      setFeedback(CORRECT);
      setCorrect(c => c + 1);
      setBurstKey(Date.now());
      bounceCorrect();
    } else {
      setFeedback(WRONG);
      loseHeart();
      shake();
    }
  };

  const handleContinue = () => {
    if (idx + 1 >= exercises.length) {
      setFinished(true);
      completeLesson(lesson.id, lesson.xp);
      // Trigger finish animations
      setTimeout(() => {
        Animated.spring(trophyScale, { toValue: 1, useNativeDriver: true, bounciness: 18, speed: 10 }).start();
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(statsSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(statsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          ]).start();
        }, 400);
      }, 100);
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setIdx(i => i + 1);
        setSelected(null); setFill(''); setOrder('');
        setFeedback(NONE); setWoKey(k => k + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    }
  };

  // ── Finished screen ──
  if (finished) {
    const accuracy = Math.round((correct / exercises.length) * 100);
    const stats = [
      { icon: '⚡', val: `+${lesson.xp}`, label: 'XP gagnés', color: C.yellow, bg: C.yellowLight },
      { icon: '🎯', val: `${accuracy}%`, label: 'Précision', color: C.green, bg: C.greenLight },
      { icon: '✅', val: `${correct}/${exercises.length}`, label: 'Corrects', color: C.blue, bg: C.blueLight },
    ];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {/* Trophy */}
          <Animated.Text style={{ fontSize: 90, transform: [{ scale: trophyScale }] }}>🏆</Animated.Text>

          <Animated.View style={{ alignItems: 'center', opacity: statsOpacity, transform: [{ translateY: statsSlide }] }}>
            <Text style={{ fontSize: 30, fontWeight: '900', color: C.textDark, marginTop: 12 }}>
              Leçon terminée !
            </Text>
            <Text style={{ fontSize: 16, color: C.textMedium, textAlign: 'center', marginVertical: 6 }}>
              Tu as maîtrisé «{lesson.title}»
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginVertical: 20 }}>
              {stats.map(s => (
                <View key={s.icon} style={{
                  alignItems: 'center', padding: 16, borderRadius: 16,
                  backgroundColor: s.bg, minWidth: 90, gap: 4,
                }}>
                  <Text style={{ fontSize: 26 }}>{s.icon}</Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: s.color }}>{s.val}</Text>
                  <Text style={{ fontSize: 11, color: C.textMedium, fontWeight: '600' }}>{s.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.goBack()} activeOpacity={0.85}>
              <View style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 56, backgroundColor: '#3A8E00', borderRadius: 16 }} />
              <View style={{ backgroundColor: C.green, borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1 }}>CONTINUER</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const disabled = !canCheck();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Top bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color={C.textMedium} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <ProgressBar progress={idx} total={exercises.length} color={C.green} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 16 }}>❤️</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.red }}>{user.hearts}</Text>
          </View>
        </View>

        {/* Exercise with burst effect */}
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }}>
          <BurstEffect trigger={burstKey} />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingTop: 8 }}>

            <Text style={{ fontSize: 12, fontWeight: '700', color: C.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
              Question {idx + 1} / {exercises.length}
            </Text>

            <Text style={{ fontSize: 20, fontWeight: '700', color: C.textDark, lineHeight: 28, marginBottom: 20 }}>
              {current.question}
            </Text>

            {/* Code block */}
            {current.code && (
              <View style={{ backgroundColor: '#0D1117', borderRadius: 12, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#161B22', gap: 6 }}>
                  {['#FF5F57','#FEBC2E','#28C840'].map(d => <View key={d} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: d }} />)}
                  <Text style={{ fontSize: 11, color: '#58A6FF', fontWeight: '600', marginLeft: 4 }}>Python</Text>
                </View>
                <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontSize: 15, color: '#E6EDF3', padding: 16, lineHeight: 24 }}>
                  {current.code}
                </Text>
              </View>
            )}

            {/* Multiple choice */}
            {current.type === 'multiple_choice' && (
              <View style={{ gap: 10 }}>
                {current.options.map(opt => {
                  let bg = C.backgroundCard, border = C.border, txtColor = C.textDark;
                  if (feedback !== NONE && selected === opt.id) {
                    bg = opt.correct ? C.greenLight : C.redLight;
                    border = opt.correct ? C.green : C.red;
                    txtColor = opt.correct ? C.green : C.red;
                  } else if (feedback === WRONG && opt.correct) {
                    bg = C.greenLight; border = C.green; txtColor = C.green;
                  } else if (selected === opt.id && feedback === NONE) {
                    bg = C.blueLight; border = C.blue; txtColor = C.blue;
                  }
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => feedback === NONE && setSelected(opt.id)}
                      activeOpacity={0.8}
                      style={{ borderWidth: 2, borderBottomWidth: 4, borderRadius: 16, backgroundColor: bg, borderColor: border }}
                    >
                      <View style={{ padding: 16 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: txtColor, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                          {opt.text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Fill blank */}
            {current.type === 'fill_blank' && (
              <View style={{ gap: 12 }}>
                <TextInput
                  style={{
                    borderWidth: 2, borderBottomWidth: 4, borderRadius: 12,
                    paddingHorizontal: 16, paddingVertical: 14, fontSize: 18,
                    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
                    borderColor: feedback === CORRECT ? C.green : feedback === WRONG ? C.red : C.border,
                    backgroundColor: feedback === CORRECT ? C.greenLight : feedback === WRONG ? C.redLight : C.backgroundCard,
                    color: feedback === CORRECT ? C.green : feedback === WRONG ? C.red : C.textDark,
                  }}
                  value={fill} onChangeText={setFill}
                  placeholder={current.hint || 'Tape ta réponse...'}
                  placeholderTextColor={C.textLight}
                  autoCapitalize="none" autoCorrect={false}
                  editable={feedback === NONE}
                  returnKeyType="done" onSubmitEditing={handleCheck}
                />
                {current.hint && feedback === NONE && (
                  <Text style={{ fontSize: 13, color: C.textMedium, fontStyle: 'italic' }}>💡 {current.hint}</Text>
                )}
                {feedback === WRONG && (
                  <View style={{ backgroundColor: C.backgroundCard, borderRadius: 10, padding: 12, borderLeftWidth: 4, borderLeftColor: C.green }}>
                    <Text style={{ fontSize: 11, color: C.textMedium, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }}>Réponse correcte :</Text>
                    <Text style={{ fontSize: 16, color: C.green, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                      {current.answer}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Code order */}
            {current.type === 'code_order' && (
              <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 13, color: C.textMedium, fontWeight: '600' }}>
                  👆 Tape sur les mots pour construire le code :
                </Text>
                <WordOrderExercise
                  key={woKey} words={current.words}
                  onAnswerChange={setOrder} feedback={feedback} C={C}
                />
                {feedback === WRONG && (
                  <View style={{ backgroundColor: C.backgroundCard, borderRadius: 10, padding: 12, borderLeftWidth: 4, borderLeftColor: C.green }}>
                    <Text style={{ fontSize: 11, color: C.textMedium, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }}>Réponse correcte :</Text>
                    <Text style={{ fontSize: 16, color: C.green, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}>
                      {current.answer}
                    </Text>
                  </View>
                )}
              </View>
            )}

          </ScrollView>
        </Animated.View>

        {/* Bottom */}
        <View style={{
          padding: 16, gap: 12,
          backgroundColor: feedback === CORRECT ? C.greenLight : feedback === WRONG ? C.redLight : C.background,
        }}>
          {feedback !== NONE && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <Text style={{ fontSize: 24, marginTop: 2 }}>{feedback === CORRECT ? '✅' : '❌'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', marginBottom: 4, color: feedback === CORRECT ? C.green : C.red }}>
                  {feedback === CORRECT ? 'Correct !' : 'Pas tout à fait...'}
                </Text>
                <Text style={{ fontSize: 14, color: C.textMedium, lineHeight: 20 }}>{current.explanation}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={feedback !== NONE ? handleContinue : handleCheck} activeOpacity={0.85} style={{ height: 56 }}>
            <View style={{
              position: 'absolute', bottom: -4, left: 0, right: 0, height: 56, borderRadius: 16,
              backgroundColor: feedback === WRONG ? C.redDark : disabled ? C.borderDark : '#3A8E00',
            }} />
            <View style={{
              borderRadius: 16, height: 52, alignItems: 'center', justifyContent: 'center',
              backgroundColor: feedback === WRONG ? C.red : disabled ? C.border : C.green,
            }}>
              <Text style={{
                fontSize: 16, fontWeight: '900', letterSpacing: 1,
                color: disabled ? C.textLight : '#fff',
              }}>
                {feedback !== NONE ? 'CONTINUER' : 'VÉRIFIER'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
