import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    emoji: '🦉',
    title: 'Apprends à coder\ngratuitement',
    subtitle: 'Des leçons courtes et fun qui s\'adaptent à ton niveau.',
    bg: COLORS.green,
    btnText: 'Commencer',
  },
  {
    id: 2,
    emoji: '🐍',
    title: 'Commence avec\nPython',
    subtitle: 'Le langage le plus populaire pour débuter. Simple, puissant, universel.',
    bg: COLORS.blue,
    btnText: 'Continuer',
  },
  {
    id: 3,
    emoji: '🏆',
    title: 'Défie les autres\ncodeurs',
    subtitle: 'Monte dans les ligues, gagne des XP et deviens le meilleur !',
    bg: '#CE82FF',
    btnText: 'C\'est parti !',
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = SLIDES[currentSlide];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    if (currentSlide + 1 < SLIDES.length) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish?.();
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: slide.bg }]}>
      <View style={styles.container}>
        {/* Skip */}
        <TouchableOpacity style={styles.skip} onPress={onFinish}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>

        {/* Emoji */}
        <Animated.Text style={[styles.emoji, { transform: [{ scale: scaleAnim }] }]}>
          {slide.emoji}
        </Animated.Text>

        {/* Title */}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.btnWrap} onPress={handleNext} activeOpacity={0.85}>
          <View style={styles.btnShadow} />
          <View style={styles.btn}>
            <Text style={styles.btnText}>{slide.btnText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  skip: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  skipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  btnWrap: {
    width: '100%',
    marginTop: 16,
  },
  btnShadow: {
    position: 'absolute',
    bottom: -4,
    left: 0, right: 0,
    height: 56,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
  },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: 0.5,
  },
});
