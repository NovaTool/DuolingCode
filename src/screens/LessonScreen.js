import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import { COLORS } from '../constants/colors';

const FEEDBACK_NONE = 'none';
const FEEDBACK_CORRECT = 'correct';
const FEEDBACK_WRONG = 'wrong';

export default function LessonScreen({ route, navigation }) {
  const { lesson } = route.params;
  const { completeLesson, loseHeart, user } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [feedback, setFeedback] = useState(FEEDBACK_NONE);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const exercises = lesson.exercises || [];
  const current = exercises[currentIndex];
  const progress = currentIndex / exercises.length;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const bounce = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.08, useNativeDriver: true, speed: 50 }),
      Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
  };

  const handleCheck = () => {
    if (feedback !== FEEDBACK_NONE) return;

    let isCorrect = false;

    if (current.type === 'multiple_choice') {
      if (!selectedOption) return;
      const option = current.options.find(o => o.id === selectedOption);
      isCorrect = option?.correct === true;
    } else if (current.type === 'fill_blank') {
      isCorrect = fillAnswer.trim().toLowerCase() === current.answer.toLowerCase();
    } else if (current.type === 'code_order') {
      isCorrect = fillAnswer.trim() === current.answer;
    }

    if (isCorrect) {
      setFeedback(FEEDBACK_CORRECT);
      setCorrectCount(c => c + 1);
      bounce();
    } else {
      setFeedback(FEEDBACK_WRONG);
      setWrongAnswers(w => [...w, current.id]);
      loseHeart();
      shake();
    }
  };

  const handleContinue = () => {
    if (currentIndex + 1 >= exercises.length) {
      setIsFinished(true);
      completeLesson(lesson.id, lesson.xp);
    } else {
      // Fade transition
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
        setFillAnswer('');
        setFeedback(FEEDBACK_NONE);
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    }
  };

  // ---- Finished Screen ----
  if (isFinished) {
    const accuracy = Math.round((correctCount / exercises.length) * 100);
    return (
      <SafeAreaView style={styles.finishSafe}>
        <View style={styles.finishContainer}>
          {/* Trophy animation */}
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.finishTitle}>Leçon terminée !</Text>
          <Text style={styles.finishSubtitle}>Tu as maîtrisé {lesson.title}</Text>

          {/* Stats */}
          <View style={styles.finishStats}>
            <View style={[styles.finishStat, { backgroundColor: COLORS.yellowLight }]}>
              <Text style={styles.finishStatIcon}>⚡</Text>
              <Text style={[styles.finishStatValue, { color: COLORS.yellow }]}>+{lesson.xp}</Text>
              <Text style={styles.finishStatLabel}>XP gagnés</Text>
            </View>
            <View style={[styles.finishStat, { backgroundColor: COLORS.greenLight }]}>
              <Text style={styles.finishStatIcon}>🎯</Text>
              <Text style={[styles.finishStatValue, { color: COLORS.green }]}>{accuracy}%</Text>
              <Text style={styles.finishStatLabel}>Précision</Text>
            </View>
            <View style={[styles.finishStat, { backgroundColor: COLORS.blueLight }]}>
              <Text style={styles.finishStatIcon}>✅</Text>
              <Text style={[styles.finishStatValue, { color: COLORS.blue }]}>{correctCount}/{exercises.length}</Text>
              <Text style={styles.finishStatLabel}>Corrects</Text>
            </View>
          </View>

          {/* Continue button */}
          <TouchableOpacity
            style={styles.finishBtnWrap}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <View style={styles.finishBtnShadow} />
            <View style={styles.finishBtn}>
              <Text style={styles.finishBtnText}>CONTINUER</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ---- Exercise Screen ----
  const bgColor = feedback === FEEDBACK_CORRECT ? COLORS.greenLight
    : feedback === FEEDBACK_WRONG ? COLORS.redLight
    : COLORS.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.textMedium} />
          </TouchableOpacity>
          <View style={styles.progressWrap}>
            <ProgressBar progress={currentIndex} total={exercises.length} />
          </View>
          <View style={styles.heartsWrap}>
            <Text style={styles.heartIcon}>❤️</Text>
            <Text style={styles.heartCount}>{user.hearts}</Text>
          </View>
        </View>

        {/* Exercise content */}
        <Animated.View
          style={[styles.content, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }, { scale: bounceAnim }] }]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentScroll}
          >
            {/* Exercise number */}
            <Text style={styles.exerciseNum}>
              Question {currentIndex + 1} sur {exercises.length}
            </Text>

            {/* Question */}
            <Text style={styles.question}>{current.question}</Text>

            {/* Code block if present */}
            {current.code && (
              <View style={styles.codeBlock}>
                <View style={styles.codeHeader}>
                  <View style={[styles.codeDot, { backgroundColor: '#FF5F57' }]} />
                  <View style={[styles.codeDot, { backgroundColor: '#FEBC2E' }]} />
                  <View style={[styles.codeDot, { backgroundColor: '#28C840' }]} />
                  <Text style={styles.codeHeaderLabel}>Python</Text>
                </View>
                <Text style={styles.code}>{current.code}</Text>
              </View>
            )}

            {/* Multiple choice */}
            {current.type === 'multiple_choice' && (
              <View style={styles.options}>
                {current.options.map(option => {
                  let optStyle = styles.option;
                  let textStyle = styles.optionText;

                  if (feedback !== FEEDBACK_NONE && selectedOption === option.id) {
                    optStyle = option.correct ? styles.optionCorrect : styles.optionWrong;
                    textStyle = option.correct ? styles.optionTextCorrect : styles.optionTextWrong;
                  } else if (feedback === FEEDBACK_WRONG && option.correct) {
                    optStyle = styles.optionCorrect;
                    textStyle = styles.optionTextCorrect;
                  } else if (selectedOption === option.id && feedback === FEEDBACK_NONE) {
                    optStyle = styles.optionSelected;
                    textStyle = styles.optionTextSelected;
                  }

                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={optStyle}
                      onPress={() => feedback === FEEDBACK_NONE && setSelectedOption(option.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.optionInner}>
                        <Text style={textStyle}>{option.text}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Fill in blank */}
            {(current.type === 'fill_blank' || current.type === 'code_order') && (
              <View style={styles.fillWrap}>
                <TextInput
                  style={[
                    styles.fillInput,
                    feedback === FEEDBACK_CORRECT && styles.fillInputCorrect,
                    feedback === FEEDBACK_WRONG && styles.fillInputWrong,
                  ]}
                  value={fillAnswer}
                  onChangeText={setFillAnswer}
                  placeholder={current.hint || 'Tape ta réponse...'}
                  placeholderTextColor={COLORS.textLight}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={feedback === FEEDBACK_NONE}
                  returnKeyType="done"
                  onSubmitEditing={handleCheck}
                />
                {current.hint && feedback === FEEDBACK_NONE && (
                  <Text style={styles.hint}>💡 {current.hint}</Text>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Feedback banner + button */}
        <View
          style={[
            styles.bottomSection,
            feedback === FEEDBACK_CORRECT && styles.bottomCorrect,
            feedback === FEEDBACK_WRONG && styles.bottomWrong,
          ]}
        >
          {feedback !== FEEDBACK_NONE && (
            <View style={styles.feedbackBanner}>
              <Text style={styles.feedbackIcon}>
                {feedback === FEEDBACK_CORRECT ? '✅' : '❌'}
              </Text>
              <View style={styles.feedbackText}>
                <Text style={[
                  styles.feedbackTitle,
                  feedback === FEEDBACK_CORRECT ? styles.feedbackTitleCorrect : styles.feedbackTitleWrong
                ]}>
                  {feedback === FEEDBACK_CORRECT ? 'Correct !' : 'Pas tout à fait...'}
                </Text>
                <Text style={styles.feedbackExplain}>{current.explanation}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.checkBtnWrap,
              feedback === FEEDBACK_NONE && !selectedOption && current.type === 'multiple_choice' && styles.checkBtnDisabledWrap,
            ]}
            onPress={feedback !== FEEDBACK_NONE ? handleContinue : handleCheck}
            activeOpacity={0.85}
          >
            {feedback === FEEDBACK_NONE ? (
              <>
                <View style={[
                  styles.checkBtnShadow,
                  (!selectedOption && current.type === 'multiple_choice') && styles.checkBtnShadowDisabled,
                ]} />
                <View style={[
                  styles.checkBtn,
                  (!selectedOption && current.type === 'multiple_choice') && styles.checkBtnDisabled,
                ]}>
                  <Text style={[
                    styles.checkBtnText,
                    (!selectedOption && current.type === 'multiple_choice') && styles.checkBtnTextDisabled,
                  ]}>VÉRIFIER</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[
                  styles.checkBtnShadow,
                  feedback === FEEDBACK_CORRECT && styles.continueBtnShadow,
                  feedback === FEEDBACK_WRONG && styles.continueBtnShadowWrong,
                ]} />
                <View style={[
                  styles.checkBtn,
                  feedback === FEEDBACK_CORRECT && styles.continueBtnCorrect,
                  feedback === FEEDBACK_WRONG && styles.continueBtnWrong,
                ]}>
                  <Text style={styles.checkBtnText}>CONTINUER</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  finishSafe: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  closeBtn: {
    padding: 4,
  },
  progressWrap: {
    flex: 1,
  },
  heartsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartIcon: { fontSize: 16 },
  heartCount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.red,
  },
  content: {
    flex: 1,
  },
  contentScroll: {
    padding: 24,
    paddingTop: 16,
  },
  exerciseNum: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    lineHeight: 28,
    marginBottom: 20,
  },
  codeBlock: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2D2D3E',
    gap: 6,
  },
  codeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  codeHeaderLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginLeft: 4,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 15,
    color: '#E8E8F0',
    padding: 16,
    lineHeight: 22,
  },
  options: {
    gap: 10,
  },
  option: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: COLORS.blue,
    borderRadius: 16,
    backgroundColor: COLORS.blueLight,
    overflow: 'hidden',
  },
  optionCorrect: {
    borderWidth: 2,
    borderColor: COLORS.green,
    borderRadius: 16,
    backgroundColor: COLORS.greenLight,
    overflow: 'hidden',
  },
  optionWrong: {
    borderWidth: 2,
    borderColor: COLORS.red,
    borderRadius: 16,
    backgroundColor: COLORS.redLight,
    overflow: 'hidden',
  },
  optionInner: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  optionTextSelected: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.blue,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  optionTextCorrect: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.green,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  optionTextWrong: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.red,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  // Fill blank
  fillWrap: {
    gap: 12,
  },
  fillInput: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: COLORS.textDark,
    backgroundColor: COLORS.background,
  },
  fillInputCorrect: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenLight,
    color: COLORS.green,
  },
  fillInputWrong: {
    borderColor: COLORS.red,
    backgroundColor: COLORS.redLight,
    color: COLORS.red,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textMedium,
    fontStyle: 'italic',
  },
  // Bottom section
  bottomSection: {
    padding: 16,
    gap: 12,
  },
  bottomCorrect: {
    backgroundColor: COLORS.greenLight,
  },
  bottomWrong: {
    backgroundColor: COLORS.redLight,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  feedbackIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  feedbackText: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  feedbackTitleCorrect: {
    color: COLORS.green,
  },
  feedbackTitleWrong: {
    color: COLORS.red,
  },
  feedbackExplain: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
  checkBtnWrap: {
    position: 'relative',
    height: 56,
  },
  checkBtnDisabledWrap: {},
  checkBtnShadow: {
    position: 'absolute',
    bottom: -4,
    left: 0, right: 0,
    height: 56,
    backgroundColor: COLORS.greenShadow,
    borderRadius: 16,
  },
  checkBtnShadowDisabled: {
    backgroundColor: COLORS.borderDark,
  },
  continueBtnShadow: {
    backgroundColor: COLORS.greenShadow,
  },
  continueBtnShadowWrong: {
    backgroundColor: COLORS.redDark,
  },
  checkBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  continueBtnCorrect: {
    backgroundColor: COLORS.green,
  },
  continueBtnWrong: {
    backgroundColor: COLORS.red,
  },
  checkBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  checkBtnTextDisabled: {
    color: COLORS.textLight,
  },
  // Finish screen
  finishContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  trophy: {
    fontSize: 80,
    marginBottom: 8,
  },
  finishTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  finishSubtitle: {
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    marginBottom: 8,
  },
  finishStats: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  finishStat: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    minWidth: 90,
    gap: 4,
  },
  finishStatIcon: {
    fontSize: 24,
  },
  finishStatValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  finishStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  finishBtnWrap: {
    width: '100%',
    marginTop: 8,
  },
  finishBtnShadow: {
    position: 'absolute',
    bottom: -4,
    left: 0, right: 0,
    height: 56,
    backgroundColor: COLORS.greenShadow,
    borderRadius: 16,
  },
  finishBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
});
