import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

const SHOP_ITEMS = [
  {
    id: 'heart_refill',
    icon: '❤️',
    title: 'Recharger les cœurs',
    description: '5 cœurs pleins',
    price: 350,
    color: COLORS.red,
    lightColor: COLORS.redLight,
  },
  {
    id: 'streak_freeze',
    icon: '🧊',
    title: 'Streak Freeze',
    description: 'Protège ta série 1 jour',
    price: 200,
    color: COLORS.blue,
    lightColor: COLORS.blueLight,
  },
  {
    id: 'double_xp',
    icon: '⚡',
    title: 'Double XP',
    description: 'XP x2 pendant 1 heure',
    price: 500,
    color: COLORS.yellow,
    lightColor: COLORS.yellowLight,
  },
  {
    id: 'timer_freeze',
    icon: '⏱️',
    title: 'Pause Timer',
    description: 'Désactive le chrono',
    price: 150,
    color: COLORS.purple,
    lightColor: COLORS.purpleLight,
  },
];

const STREAK_SOCIETY = [
  { days: 7, icon: '🌱', title: '7 jours', reward: '200 💎' },
  { days: 14, icon: '🌿', title: '14 jours', reward: '500 💎' },
  { days: 30, icon: '🌳', title: '30 jours', reward: '1000 💎' },
  { days: 100, icon: '🦅', title: '100 jours', reward: '5000 💎' },
];

export default function ShopScreen() {
  const { user, refillHearts } = useApp();

  const handleBuy = (item) => {
    if (user.gems < item.price) {
      Alert.alert(
        'Pas assez de gemmes 💎',
        `Il te faut ${item.price} gemmes. Tu n\'en as que ${user.gems}.`,
        [{ text: 'OK' }]
      );
      return;
    }
    Alert.alert(
      `Acheter "${item.title}" ?`,
      `Coût : ${item.price} 💎`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Acheter',
          onPress: () => {
            if (item.id === 'heart_refill') {
              refillHearts();
            }
            Alert.alert('Acheté ! ✅', `"${item.title}" activé !`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏪 Boutique</Text>
        <View style={styles.gemChip}>
          <Text style={styles.gemIcon}>💎</Text>
          <Text style={styles.gemCount}>{user.gems}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🎁</Text>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Boutique du jour</Text>
            <Text style={styles.bannerSub}>
              Gagne des gemmes en complétant des leçons !
            </Text>
          </View>
        </View>

        {/* Power-ups */}
        <Text style={styles.sectionTitle}>⚡ Power-ups</Text>
        <View style={styles.grid}>
          {SHOP_ITEMS.map(item => (
            <View
              key={item.id}
              style={[styles.card, { borderTopColor: item.color, borderTopWidth: 4 }]}
            >
              <View style={[styles.cardIcon, { backgroundColor: item.lightColor }]}>
                <Text style={styles.cardEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>

              <TouchableOpacity
                style={[
                  styles.buyBtnWrap,
                  user.gems < item.price && styles.buyBtnDisabledWrap,
                ]}
                onPress={() => handleBuy(item)}
                activeOpacity={0.85}
              >
                <View style={[
                  styles.buyBtnShadow,
                  { backgroundColor: user.gems >= item.price ? item.color : COLORS.borderDark },
                ]} />
                <View style={[
                  styles.buyBtn,
                  { backgroundColor: user.gems >= item.price ? item.color : COLORS.border },
                ]}>
                  <Text style={[
                    styles.buyBtnText,
                    user.gems < item.price && styles.buyBtnTextDisabled,
                  ]}>
                    💎 {item.price}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Streak society */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>🔥 Club Streak</Text>
        <Text style={styles.sectionSub}>Maintiens ta série pour débloquer des récompenses</Text>
        {STREAK_SOCIETY.map(tier => {
          const achieved = user.streak >= tier.days;
          return (
            <View
              key={tier.days}
              style={[styles.streakRow, achieved && styles.streakRowAchieved]}
            >
              <Text style={styles.streakIcon}>{tier.icon}</Text>
              <View style={styles.streakInfo}>
                <Text style={[styles.streakTitle, achieved && { color: COLORS.orange }]}>
                  {tier.title}
                </Text>
                <Text style={styles.streakReward}>Récompense : {tier.reward}</Text>
              </View>
              {achieved ? (
                <View style={styles.achievedBadge}>
                  <Text style={styles.achievedText}>✅ Obtenu</Text>
                </View>
              ) : (
                <Text style={styles.streakNeeded}>
                  {tier.days - user.streak} jours
                </Text>
              )}
            </View>
          );
        })}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  gemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.blueLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
  },
  gemIcon: { fontSize: 16 },
  gemCount: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.blue,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.yellowLight,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
  },
  bannerEmoji: { fontSize: 36 },
  bannerText: { flex: 1 },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS.textMedium,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
  card: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  cardEmoji: { fontSize: 28 },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textMedium,
    textAlign: 'center',
    marginBottom: 4,
  },
  buyBtnWrap: {
    width: '100%',
    marginTop: 4,
    height: 38,
  },
  buyBtnDisabledWrap: {},
  buyBtnShadow: {
    position: 'absolute',
    bottom: -3,
    left: 0, right: 0,
    height: 38,
    borderRadius: 10,
  },
  buyBtn: {
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  buyBtnTextDisabled: {
    color: COLORS.textLight,
  },
  // Streak
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
  },
  streakRowAchieved: {
    backgroundColor: COLORS.orangeLight,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  streakIcon: { fontSize: 28 },
  streakInfo: { flex: 1 },
  streakTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  streakReward: {
    fontSize: 12,
    color: COLORS.textMedium,
    marginTop: 2,
  },
  achievedBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  achievedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  streakNeeded: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMedium,
  },
});
