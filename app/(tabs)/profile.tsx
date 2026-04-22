import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Label } from '@/components/grit/label';
import { T } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';

const BADGES = [
  { name: 'First Sprint',   earned: true,  sym: '◆' },
  { name: '3 Sprints',      earned: true,  sym: '◆◆◆' },
  { name: '7-Day Streak',   earned: true,  sym: '▲' },
  { name: 'Perfect Day',    earned: true,  sym: '●' },
  { name: '30-Day Streak',  earned: false, sym: '▲▲' },
  { name: 'Perfect Sprint', earned: false, sym: '◈' },
];

const LIFETIME_STATS = [
  { val: '3',  label: 'Sprints started' },
  { val: '2',  label: 'Sprints passed' },
  { val: '12', label: 'Current streak' },
  { val: '19', label: 'Longest streak' },
];

const HISTORY = [
  { name: 'Sprint #2', result: 'pass', pct: 88, date: 'Mar 2026', days: 14 },
  { name: 'Sprint #1', result: 'fail', pct: 58, date: 'Feb 2026', days: 14 },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const displayName = user?.name ?? 'mkang';
  const initials = user?.initials ?? 'MK';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.profileHeader}>
        <View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.username}>{displayName}</Text>
          <Text style={styles.sprintStatus}>Sprint #3 Active · Day 9</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
          <Text style={styles.settingsBtnText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Lifetime stats */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 12 }}>Lifetime</Label>
        <View style={styles.statsGrid}>
          {LIFETIME_STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 12 }}>Badges</Label>
        <View style={styles.badgesGrid}>
          {BADGES.map((b, i) => (
            <View key={i} style={[styles.badgeTile, !b.earned && { opacity: 0.3 }, b.earned && { borderColor: T.accent + '33' }]}>
              <Text style={[styles.badgeSym, { color: b.earned ? T.accent : T.muted }]}>{b.sym}</Text>
              <Text style={styles.badgeName}>{b.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Sprint history */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 14 }}>Sprint History</Label>
        {HISTORY.map((h, i) => (
          <View
            key={i}
            style={[styles.historyRow, i < HISTORY.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.dim }]}
          >
            <View style={[styles.historyDot, { backgroundColor: h.result === 'pass' ? T.accent : T.red }]} />
            <View style={styles.historyInfo}>
              <Text style={styles.historyName}>{h.name}</Text>
              <Text style={styles.historyMeta}>{h.date} · {h.days} days</Text>
            </View>
            <View style={styles.historyResult}>
              <Text style={[styles.historyPct, { color: h.result === 'pass' ? T.accent : T.red }]}>{h.pct}%</Text>
              <Text style={[styles.historyStatus, { color: T.muted }]}>{h.result.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: T.s2,
    borderWidth: 2,
    borderColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: T.accent,
  },
  username: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: T.text,
  },
  sprintStatus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: T.accent,
    marginTop: 3,
  },
  settingsBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: T.dim,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  settingsBtnText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 12,
    color: T.muted,
  },
  section: {
    paddingHorizontal: 22,
    marginBottom: 28,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: T.s1,
    borderRadius: 14,
    padding: 18,
    borderWidth: 0.5,
    borderColor: T.dim,
  },
  statVal: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 32,
    color: T.text,
    lineHeight: 36,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: T.muted,
    marginTop: 6,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeTile: {
    width: '30%',
    backgroundColor: T.s1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: T.dim,
    alignItems: 'center',
    gap: 8,
  },
  badgeSym: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 18,
    letterSpacing: 2,
  },
  badgeName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    color: T.muted,
    textAlign: 'center',
    lineHeight: 13,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 15,
    color: T.text,
  },
  historyMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: T.muted,
    marginTop: 2,
  },
  historyResult: {
    alignItems: 'flex-end',
  },
  historyPct: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
  },
  historyStatus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
