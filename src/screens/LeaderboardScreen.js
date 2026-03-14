import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';

const MOCK_PLAYERS = [
  { id: 1, name: 'Alice', avatar: '🧑‍💻', xp: 1250, streak: 14, league: 'Or' },
  { id: 2, name: 'Bob', avatar: '👨‍🎓', xp: 980, streak: 7, league: 'Or' },
  { id: 3, name: 'Clara', avatar: '👩‍🔬', xp: 870, streak: 21, league: 'Or' },
  { id: 4, name: 'David', avatar: '🧑‍🏫', xp: 760, streak: 5, league: 'Argent' },
  { id: 5, name: 'Eva', avatar: '👩‍💻', xp: 650, streak: 10, league: 'Argent' },
  { id: 6, name: 'Felix', avatar: '🧙‍♂️', xp: 540, streak: 3, league: 'Argent' },
  { id: 7, name: 'Grace', avatar: '🦸‍♀️', xp: 430, streak: 8, league: 'Bronze' },
  { id: 8, name: 'Hugo', avatar: '🧑‍🚀', xp: 320, streak: 2, league: 'Bronze' },
  { id: 9, name: 'Iris', avatar: '👩‍🎨', xp: 210, streak: 1, league: 'Bronze' },
];

const LEAGUES = ['Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Obsidienne'];
const LEAGUE_ICONS = ['🥉', '🥈', '🥇', '💎', '🔵', '⬛'];
const LEAGUE_COLORS = [COLORS.bronze, COLORS.silver, COLORS.gold, '#00BCD4', '#2196F3', '#212121'];

const TABS = ['Cette semaine', 'Amis', 'Ligues'];

export default function LeaderboardScreen() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState(0);

  // Insert current user in the leaderboard
  const userEntry = { id: 0, name: 'Moi', avatar: user.avatar, xp: user.xp, streak: user.streak, isMe: true };
  const allPlayers = [...MOCK_PLAYERS, userEntry].sort((a, b) => b.xp - a.xp);
  const myRank = allPlayers.findIndex(p => p.isMe) + 1;

  const top3 = allPlayers.slice(0, 3);
  const rest = allPlayers.slice(3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classement</Text>
        <View style={styles.leagueChip}>
          <Text style={styles.leagueIcon}>🥈</Text>
          <Text style={styles.leagueText}>Ligue Argent</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 2 ? (
        // Leagues view
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.leaguesInfo}>
            <Text style={styles.leaguesTitle}>Les Ligues</Text>
            <Text style={styles.leaguesSub}>Termine dans le top 10 pour monter de ligue !</Text>
          </View>
          {LEAGUES.map((league, i) => (
            <View
              key={league}
              style={[
                styles.leagueRow,
                i === 1 && { borderWidth: 2, borderColor: COLORS.silver, borderRadius: 16 },
              ]}
            >
              <Text style={styles.leagueRowIcon}>{LEAGUE_ICONS[i]}</Text>
              <View style={styles.leagueRowInfo}>
                <Text style={[styles.leagueRowName, { color: LEAGUE_COLORS[i] }]}>
                  Ligue {league}
                </Text>
                <Text style={styles.leagueRowDesc}>
                  {i === 0 ? 'Niveau débutant' :
                   i === 1 ? 'Tu es ici →' :
                   i === 2 ? 'Top 10 ce mois' :
                   'Prochains niveaux'}
                </Text>
              </View>
              {i === 1 && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>ACTUEL</Text>
                </View>
              )}
            </View>
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Countdown */}
          <View style={styles.countdown}>
            <Text style={styles.countdownIcon}>⏰</Text>
            <Text style={styles.countdownText}>La ligue se termine dans <Text style={styles.bold}>5 jours</Text></Text>
          </View>

          {/* Top 3 podium */}
          <View style={styles.podium}>
            {/* 2nd place */}
            <View style={[styles.podiumPlayer, styles.podiumSecond]}>
              <Text style={styles.podiumAvatar}>{top3[1]?.avatar}</Text>
              <View style={[styles.podiumBase, { height: 80, backgroundColor: COLORS.silver }]}>
                <Text style={styles.podiumRank}>2</Text>
              </View>
              <Text style={styles.podiumName}>{top3[1]?.name}</Text>
              <Text style={styles.podiumXP}>{top3[1]?.xp} XP</Text>
            </View>

            {/* 1st place */}
            <View style={[styles.podiumPlayer, styles.podiumFirst]}>
              <Text style={styles.crownIcon}>👑</Text>
              <Text style={styles.podiumAvatar}>{top3[0]?.avatar}</Text>
              <View style={[styles.podiumBase, { height: 110, backgroundColor: COLORS.gold }]}>
                <Text style={styles.podiumRank}>1</Text>
              </View>
              <Text style={styles.podiumName}>{top3[0]?.name}</Text>
              <Text style={styles.podiumXP}>{top3[0]?.xp} XP</Text>
            </View>

            {/* 3rd place */}
            <View style={[styles.podiumPlayer, styles.podiumThird]}>
              <Text style={styles.podiumAvatar}>{top3[2]?.avatar}</Text>
              <View style={[styles.podiumBase, { height: 60, backgroundColor: COLORS.bronze }]}>
                <Text style={styles.podiumRank}>3</Text>
              </View>
              <Text style={styles.podiumName}>{top3[2]?.name}</Text>
              <Text style={styles.podiumXP}>{top3[2]?.xp} XP</Text>
            </View>
          </View>

          {/* My rank banner */}
          {myRank > 3 && (
            <View style={styles.myRankBanner}>
              <Text style={styles.myRankText}>Tu es classé #{myRank} 🎯</Text>
            </View>
          )}

          {/* Rest of leaderboard */}
          <View style={styles.list}>
            {rest.map((player, index) => {
              const rank = index + 4;
              return (
                <View
                  key={player.id}
                  style={[
                    styles.listRow,
                    player.isMe && styles.listRowMe,
                    rank <= 10 && styles.listRowTop,
                  ]}
                >
                  <Text style={[
                    styles.rank,
                    rank <= 3 && styles.rankTop,
                  ]}>
                    {rank}
                  </Text>
                  <Text style={styles.listAvatar}>{player.avatar}</Text>
                  <View style={styles.listInfo}>
                    <Text style={[styles.listName, player.isMe && styles.listNameMe]}>
                      {player.name}{player.isMe ? ' (Moi)' : ''}
                    </Text>
                    <View style={styles.listMeta}>
                      <Text style={styles.listStreak}>🔥 {player.streak}</Text>
                    </View>
                  </View>
                  <Text style={[styles.listXP, player.isMe && { color: COLORS.green }]}>
                    {player.xp} XP
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Top 10 notice */}
          <View style={styles.notice}>
            <Text style={styles.noticeText}>🎁 Le top 10 monte en Ligue Or !</Text>
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>
      )}
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
  leagueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.backgroundGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.silver,
  },
  leagueIcon: { fontSize: 16 },
  leagueText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginBottom: -2,
  },
  tabActive: {
    borderBottomColor: COLORS.blue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  tabTextActive: {
    color: COLORS.blue,
    fontWeight: '800',
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.yellowLight,
    margin: 16,
    padding: 10,
    borderRadius: 12,
  },
  countdownIcon: { fontSize: 16 },
  countdownText: {
    fontSize: 13,
    color: COLORS.textMedium,
  },
  bold: {
    fontWeight: '800',
    color: COLORS.textDark,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 8,
  },
  podiumPlayer: {
    alignItems: 'center',
    flex: 1,
  },
  podiumFirst: {
    order: 2,
  },
  podiumSecond: {
    order: 1,
  },
  podiumThird: {
    order: 3,
  },
  crownIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  podiumAvatar: {
    fontSize: 32,
    marginBottom: 4,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  podiumRank: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 4,
  },
  podiumXP: {
    fontSize: 11,
    color: COLORS.textMedium,
    fontWeight: '600',
  },
  myRankBanner: {
    backgroundColor: COLORS.greenLight,
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  myRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.green,
  },
  list: {
    paddingHorizontal: 16,
    gap: 4,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundGray,
  },
  listRowMe: {
    backgroundColor: COLORS.greenLight,
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  listRowTop: {},
  rank: {
    width: 24,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMedium,
    textAlign: 'center',
  },
  rankTop: {
    color: COLORS.textDark,
  },
  listAvatar: {
    fontSize: 26,
  },
  listInfo: {
    flex: 1,
    gap: 2,
  },
  listName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  listNameMe: {
    color: COLORS.green,
  },
  listMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  listStreak: {
    fontSize: 12,
    color: COLORS.textMedium,
    fontWeight: '500',
  },
  listXP: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.blue,
  },
  notice: {
    margin: 16,
    padding: 12,
    backgroundColor: COLORS.blueLight,
    borderRadius: 12,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.blue,
  },
  // Leagues tab
  leaguesInfo: {
    padding: 16,
    paddingBottom: 8,
  },
  leaguesTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  leaguesSub: {
    fontSize: 14,
    color: COLORS.textMedium,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
  },
  leagueRowIcon: {
    fontSize: 28,
  },
  leagueRowInfo: {
    flex: 1,
  },
  leagueRowName: {
    fontSize: 16,
    fontWeight: '800',
  },
  leagueRowDesc: {
    fontSize: 13,
    color: COLORS.textMedium,
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: COLORS.silver,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
