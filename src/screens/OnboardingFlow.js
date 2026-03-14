import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, Animated, Dimensions, ScrollView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const AVATARS = ['🦉','🧑‍💻','👩‍💻','🦸','🧙','👨‍🎓','🤖','🐱','🐸','🦊','🐼','🚀'];

const CODING_LANGUAGES = [
  { id: 'python',     icon: '🐍', label: 'Python',     available: true },
  { id: 'javascript', icon: '🟨', label: 'JavaScript', available: false },
  { id: 'swift',      icon: '🍎', label: 'Swift',      available: false },
  { id: 'java',       icon: '☕', label: 'Java',        available: false },
  { id: 'cpp',        icon: '⚙️', label: 'C++',         available: false },
  { id: 'rust',       icon: '🦀', label: 'Rust',        available: false },
];

const TIME_GOALS = [
  { value: 3,  icon: '⚡', label: '3 min',  sublabel: 'Décontracté',  exercises: 3 },
  { value: 5,  icon: '🎯', label: '5 min',  sublabel: 'Normal',       exercises: 5 },
  { value: 10, icon: '🔥', label: '10 min', sublabel: 'Sérieux',      exercises: 8 },
  { value: 20, icon: '🏆', label: '20 min', sublabel: 'Intense',      exercises: 12 },
];

const TOTAL_STEPS = 6; // 0..5

export default function OnboardingFlow() {
  const { finishOnboarding } = useApp();
  const { colors, isDark, setIsDark } = useTheme();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦉');
  const [theme, setTheme] = useState('dark');
  const [appLanguage, setAppLanguage] = useState('fr');
  const [codingLanguage, setCodingLanguage] = useState('python');
  const [timeGoal, setTimeGoal] = useState(10);

  const slideX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      Animated.sequence([
        Animated.timing(slideX, { toValue: -width, duration: 200, useNativeDriver: true }),
        Animated.timing(slideX, { toValue: width, duration: 0, useNativeDriver: true }),
        Animated.timing(slideX, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
      setStep(s => s + 1);
    } else {
      finishOnboarding({ name: name.trim() || 'Apprenant', avatar, theme, appLanguage, codingLanguage, timeGoal });
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const handleThemeChange = (t) => {
    setTheme(t);
    setIsDark(t === 'dark');
  };

  const C = colors;
  const progress = (step + 1) / TOTAL_STEPS;

  const canContinue = () => {
    if (step === 1) return name.trim().length >= 2;
    return true;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      {/* Progress bar */}
      {step > 0 && (
        <View style={[styles.progressWrap, { backgroundColor: C.border }]}>
          <Animated.View style={[styles.progressFill, {
            width: `${progress * 100}%`,
            backgroundColor: C.green,
          }]} />
        </View>
      )}

      {/* Back button */}
      {step > 0 && (
        <TouchableOpacity style={styles.backBtn} onPress={goPrev}>
          <Text style={[styles.backIcon, { color: C.textMedium }]}>←</Text>
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.stepWrap, { transform: [{ translateX: slideX }] }]}>
        {/* ── STEP 0 : Welcome ── */}
        {step === 0 && (
          <View style={styles.centerStep}>
            <Text style={styles.bigEmoji}>🦉</Text>
            <Text style={[styles.stepTitle, { color: C.textDark }]}>
              Bienvenue sur{'\n'}DuolingCode
            </Text>
            <Text style={[styles.stepSub, { color: C.textMedium }]}>
              Apprends à coder gratuitement,{'\n'}5 minutes par jour suffisent !
            </Text>
            <View style={styles.featuresGrid}>
              {[
                { icon: '🎮', text: 'Exercices interactifs' },
                { icon: '🏆', text: 'Classement & Ligues' },
                { icon: '🔥', text: 'Streaks quotidiens' },
                { icon: '🐍', text: 'Python & plus' },
              ].map(f => (
                <View key={f.text} style={[styles.featureChip, { backgroundColor: C.backgroundGray, borderColor: C.border }]}>
                  <Text style={styles.featureIcon}>{f.icon}</Text>
                  <Text style={[styles.featureText, { color: C.textMedium }]}>{f.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── STEP 1 : Account ── */}
        {step === 1 && (
          <ScrollView contentContainerStyle={styles.scrollStep} showsVerticalScrollIndicator={false}>
            <Text style={[styles.stepTitle, { color: C.textDark }]}>Crée ton profil</Text>
            <Text style={[styles.stepSub, { color: C.textMedium }]}>
              Choisis un avatar et entre ton prénom
            </Text>

            {/* Avatar grid */}
            <View style={styles.avatarGrid}>
              {AVATARS.map(em => (
                <TouchableOpacity
                  key={em}
                  style={[
                    styles.avatarBtn,
                    { backgroundColor: C.backgroundGray, borderColor: C.border },
                    avatar === em && { borderColor: C.green, backgroundColor: C.greenLight },
                  ]}
                  onPress={() => setAvatar(em)}
                >
                  <Text style={styles.avatarEmoji}>{em}</Text>
                  {avatar === em && (
                    <View style={[styles.avatarCheck, { backgroundColor: C.green }]}>
                      <Text style={styles.avatarCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Name input */}
            <Text style={[styles.inputLabel, { color: C.textMedium }]}>Ton prénom</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: C.backgroundCard,
                  borderColor: name.length >= 2 ? C.green : C.border,
                  color: C.textDark,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Ex : Alex"
              placeholderTextColor={C.textLight}
              maxLength={20}
              autoFocus
              returnKeyType="done"
            />
            {name.length > 0 && name.length < 2 && (
              <Text style={[styles.inputHint, { color: C.red }]}>Au moins 2 caractères</Text>
            )}
          </ScrollView>
        )}

        {/* ── STEP 2 : Theme ── */}
        {step === 2 && (
          <View style={styles.centerStep}>
            <Text style={styles.bigEmoji}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
            <Text style={[styles.stepTitle, { color: C.textDark }]}>Quel thème ?</Text>
            <Text style={[styles.stepSub, { color: C.textMedium }]}>Tu pourras le changer plus tard</Text>

            <View style={styles.themeRow}>
              {[
                { id: 'dark',  icon: '🌙', label: 'Sombre',  bg: '#131F24', card: '#1E2F38', text: '#fff' },
                { id: 'light', icon: '☀️', label: 'Clair',   bg: '#ffffff', card: '#F7F7F7', text: '#333' },
              ].map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.themeCard,
                    { borderColor: theme === t.id ? C.green : C.border },
                  ]}
                  onPress={() => handleThemeChange(t.id)}
                >
                  {/* Mini preview */}
                  <View style={[styles.themePreview, { backgroundColor: t.bg }]}>
                    <View style={[styles.themePreviewBar, { backgroundColor: t.card }]} />
                    <View style={[styles.themePreviewCard, { backgroundColor: t.card }]}>
                      <View style={[styles.themePreviewLine, { backgroundColor: t.text + '60' }]} />
                      <View style={[styles.themePreviewLine, { backgroundColor: t.text + '40', width: '60%' }]} />
                    </View>
                    <View style={[styles.themePreviewBtn, { backgroundColor: '#58CC02' }]} />
                  </View>
                  <Text style={styles.themeIcon}>{t.icon}</Text>
                  <Text style={[styles.themeLabel, { color: C.textDark }]}>{t.label}</Text>
                  {theme === t.id && (
                    <View style={[styles.themeCheck, { backgroundColor: C.green }]}>
                      <Text style={styles.themeCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── STEP 3 : App Language ── */}
        {step === 3 && (
          <View style={styles.centerStep}>
            <Text style={styles.bigEmoji}>🌍</Text>
            <Text style={[styles.stepTitle, { color: C.textDark }]}>Quelle langue ?</Text>
            <Text style={[styles.stepSub, { color: C.textMedium }]}>Langue de l'application</Text>

            <View style={styles.langRow}>
              {[
                { id: 'fr', flag: '🇫🇷', label: 'Français' },
                { id: 'en', flag: '🇬🇧', label: 'English' },
              ].map(l => (
                <TouchableOpacity
                  key={l.id}
                  style={[
                    styles.langCard,
                    { backgroundColor: C.backgroundCard, borderColor: appLanguage === l.id ? C.green : C.border },
                    appLanguage === l.id && { backgroundColor: C.greenLight },
                  ]}
                  onPress={() => setAppLanguage(l.id)}
                >
                  <Text style={styles.langFlag}>{l.flag}</Text>
                  <Text style={[styles.langLabel, { color: C.textDark }]}>{l.label}</Text>
                  {appLanguage === l.id && (
                    <View style={[styles.langCheck, { backgroundColor: C.green }]}>
                      <Text style={styles.langCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── STEP 4 : Coding Language ── */}
        {step === 4 && (
          <View style={styles.centerStep}>
            <Text style={styles.bigEmoji}>💻</Text>
            <Text style={[styles.stepTitle, { color: C.textDark }]}>Que veux-tu apprendre ?</Text>
            <Text style={[styles.stepSub, { color: C.textMedium }]}>Choisis ton langage de programmation</Text>

            <View style={styles.langGrid}>
              {CODING_LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l.id}
                  style={[
                    styles.codingCard,
                    {
                      backgroundColor: C.backgroundGray,
                      borderColor: codingLanguage === l.id ? C.green : C.border,
                      opacity: l.available ? 1 : 0.5,
                    },
                    codingLanguage === l.id && { backgroundColor: C.greenLight },
                  ]}
                  onPress={() => l.available && setCodingLanguage(l.id)}
                  activeOpacity={l.available ? 0.8 : 1}
                >
                  <Text style={styles.codingIcon}>{l.icon}</Text>
                  <Text style={[styles.codingLabel, { color: C.textDark }]}>{l.label}</Text>
                  {!l.available && (
                    <View style={[styles.soonBadge, { backgroundColor: C.border }]}>
                      <Text style={[styles.soonText, { color: C.textMedium }]}>Bientôt</Text>
                    </View>
                  )}
                  {codingLanguage === l.id && l.available && (
                    <View style={[styles.codingCheck, { backgroundColor: C.green }]}>
                      <Text style={styles.codingCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── STEP 5 : Time Goal ── */}
        {step === 5 && (
          <View style={styles.centerStep}>
            <Text style={styles.bigEmoji}>⏱️</Text>
            <Text style={[styles.stepTitle, { color: C.textDark }]}>Ton objectif quotidien</Text>
            <Text style={[styles.stepSub, { color: C.textMedium }]}>
              Le nombre d'exercices s'adapte à ta durée
            </Text>

            <View style={styles.goalList}>
              {TIME_GOALS.map(g => (
                <TouchableOpacity
                  key={g.value}
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: C.backgroundCard,
                      borderColor: timeGoal === g.value ? C.green : C.border,
                    },
                    timeGoal === g.value && { backgroundColor: C.greenLight },
                  ]}
                  onPress={() => setTimeGoal(g.value)}
                >
                  <Text style={styles.goalIcon}>{g.icon}</Text>
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalLabel, { color: C.textDark }]}>{g.label}</Text>
                    <Text style={[styles.goalSub, { color: C.textMedium }]}>
                      {g.sublabel} · {g.exercises} exercices/leçon
                    </Text>
                  </View>
                  {timeGoal === g.value && (
                    <View style={[styles.goalCheck, { backgroundColor: C.green }]}>
                      <Text style={styles.goalCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.View>

      {/* Bottom CTA */}
      <View style={[styles.bottom, { backgroundColor: C.background }]}>
        {step === TOTAL_STEPS - 1 && (
          <View style={[styles.summaryRow, { backgroundColor: C.backgroundGray, borderColor: C.border }]}>
            <Text style={styles.summaryItem}>{avatar} {name.trim() || 'Apprenant'}</Text>
            <Text style={styles.summaryItem}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
            <Text style={styles.summaryItem}>🐍</Text>
            <Text style={styles.summaryItem}>⏱️ {timeGoal} min</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.ctaWrap, !canContinue() && { opacity: 0.5 }]}
          onPress={canContinue() ? goNext : null}
          activeOpacity={0.85}
        >
          <View style={[styles.ctaShadow, { backgroundColor: '#3A8E00' }]} />
          <View style={[styles.ctaBtn, { backgroundColor: colors.green }]}>
            <Text style={styles.ctaText}>
              {step === 0 ? 'COMMENCER →' : step === TOTAL_STEPS - 1 ? 'ALLONS-Y ! 🚀' : 'CONTINUER'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  progressWrap: {
    height: 6, marginHorizontal: 16, marginTop: 8, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  backBtn: {
    position: 'absolute', top: 52, left: 12, padding: 10, zIndex: 10,
  },
  backIcon: { fontSize: 22, fontWeight: '700' },
  stepWrap: { flex: 1, paddingHorizontal: 24 },
  centerStep: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  scrollStep: {
    flexGrow: 1, paddingTop: 40, paddingBottom: 20, gap: 12, alignItems: 'center',
  },
  bigEmoji: { fontSize: 72, marginBottom: 4 },
  stepTitle: {
    fontSize: 28, fontWeight: '900', textAlign: 'center', lineHeight: 36,
  },
  stepSub: {
    fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: 8,
  },
  // Welcome features
  featuresGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 8,
  },
  featureChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  featureIcon: { fontSize: 16 },
  featureText: { fontSize: 13, fontWeight: '600' },
  // Account
  avatarGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
  },
  avatarBtn: {
    width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  avatarEmoji: { fontSize: 30 },
  avatarCheck: {
    position: 'absolute', bottom: -2, right: -2,
    width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  avatarCheckText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  inputLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, alignSelf: 'flex-start' },
  input: {
    width: '100%', borderWidth: 2, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, fontWeight: '600',
    borderBottomWidth: 4,
  },
  inputHint: { fontSize: 12, alignSelf: 'flex-start' },
  // Theme
  themeRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  themeCard: {
    flex: 1, borderWidth: 2, borderRadius: 16, overflow: 'hidden',
    alignItems: 'center', paddingBottom: 12,
  },
  themePreview: { width: '100%', height: 110, padding: 8, gap: 6 },
  themePreviewBar: { height: 14, borderRadius: 4, width: '100%' },
  themePreviewCard: { flex: 1, borderRadius: 8, padding: 6, gap: 4 },
  themePreviewLine: { height: 6, borderRadius: 3, width: '80%' },
  themePreviewBtn: { height: 16, borderRadius: 8, width: '60%', alignSelf: 'center' },
  themeIcon: { fontSize: 24, marginTop: 8 },
  themeLabel: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  themeCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
  },
  themeCheckText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  // Language
  langRow: { flexDirection: 'row', gap: 16, marginTop: 8, width: '100%' },
  langCard: {
    flex: 1, borderWidth: 2, borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 6,
  },
  langFlag: { fontSize: 40 },
  langLabel: { fontSize: 16, fontWeight: '700' },
  langCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
  },
  langCheckText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  // Coding language
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', width: '100%' },
  codingCard: {
    width: '30%', borderWidth: 2, borderRadius: 14, padding: 12,
    alignItems: 'center', gap: 4,
  },
  codingIcon: { fontSize: 28 },
  codingLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  soonBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 2,
  },
  soonText: { fontSize: 9, fontWeight: '700' },
  codingCheck: {
    position: 'absolute', top: 4, right: 4,
    width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
  },
  codingCheckText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  // Time goal
  goalList: { gap: 10, width: '100%' },
  goalCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 2, borderRadius: 16, padding: 16, borderBottomWidth: 4,
  },
  goalIcon: { fontSize: 28 },
  goalInfo: { flex: 1 },
  goalLabel: { fontSize: 17, fontWeight: '800' },
  goalSub: { fontSize: 13, marginTop: 2 },
  goalCheck: {
    width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  goalCheckText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  // Summary
  summaryRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12,
  },
  summaryItem: { fontSize: 14, fontWeight: '700' },
  // Bottom
  bottom: { padding: 16, paddingBottom: Platform.OS === 'ios' ? 8 : 16 },
  ctaWrap: { height: 56 },
  ctaShadow: {
    position: 'absolute', bottom: -4, left: 0, right: 0,
    height: 56, borderRadius: 16,
  },
  ctaBtn: {
    borderRadius: 16, height: 52, alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1 },
});
