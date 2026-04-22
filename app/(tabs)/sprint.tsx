import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Divider } from '@/components/grit/divider';
import { Label } from '@/components/grit/label';
import { T } from '@/constants/theme';

const DAYS = Array.from({ length: 14 }, (_, i) => ({
  n: i + 1,
  pct: i < 9 ? ([1, 0.8, 1, 0.6, 1, 0, 1, 1, 0.9] as number[])[i] : null,
}));

const GOALS = [
  { name: 'Morning Workout', pct: 0.89 },
  { name: 'Cold Shower',     pct: 1.00 },
  { name: 'Midday Walk',     pct: 0.78 },
  { name: 'Deep Work Block', pct: 0.67 },
  { name: 'Reading',         pct: 0.89 },
];

const STATS = [
  { val: '847', label: 'Points' },
  { val: '12',  label: 'Streak' },
  { val: '3',   label: 'Missed' },
  { val: '84%', label: 'Avg' },
];

function heatColor(pct: number | null): string {
  if (pct === null) return T.s2;
  if (pct === 0) return T.red + 'AA';
  if (pct < 0.7) return T.amber + '88';
  if (pct < 0.95) return T.accent + '77';
  return T.accent;
}

function PlusIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v16M4 12h16" stroke={T.muted} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

export default function SprintScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Label style={{ marginBottom: 4 }}>Sprint #3 · Day 9 of 14</Label>
          <Text style={styles.title}>On Track</Text>
        </View>
        <Text style={styles.passingLabel}>↑ Passing</Text>
      </View>

      {/* 14-day heatmap */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 12 }}>14-Day Heatmap</Label>
        <View style={styles.heatGrid}>
          {DAYS.map((d, i) => (
            <View
              key={i}
              style={[
                styles.heatCell,
                { backgroundColor: heatColor(d.pct) },
                d.pct === null && styles.heatCellFuture,
              ]}
            >
              <Text style={[
                styles.heatDay,
                d.pct !== null && d.pct > 0 ? { color: T.bg } : d.pct === 0 ? { color: T.text } : { color: T.dim },
              ]}>{d.n}</Text>
              {d.pct !== null && d.pct > 0 && (
                <Text style={styles.heatPct}>{Math.round(d.pct * 100)}%</Text>
              )}
              {d.pct === 0 && <Text style={styles.heatMiss}>miss</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* 4 stat cards */}
      <View style={styles.statsRow}>
        {STATS.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statVal}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Goal breakdown */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 14 }}>Goal Breakdown</Label>
        {GOALS.map((g, i) => (
          <View key={i} style={[styles.goalRow, i < GOALS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.dim }]}>
            <View style={styles.goalTop}>
              <Text style={styles.goalName}>{g.name}</Text>
              <Text style={[styles.goalPct, { color: g.pct >= 0.7 ? T.accent : T.red }]}>{Math.round(g.pct * 100)}%</Text>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${g.pct * 100}%` as any, backgroundColor: g.pct >= 0.7 ? T.accent : T.red }]} />
            </View>
          </View>
        ))}
      </View>

      {/* New sprint button */}
      <View style={{ paddingHorizontal: 22 }}>
        <TouchableOpacity style={styles.newSprintBtn} onPress={() => router.push('/sprint-builder')}>
          <PlusIcon />
          <Text style={styles.newSprintText}>New Sprint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: T.text,
    letterSpacing: -0.5,
  },
  passingLabel: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 14,
    color: T.accent,
  },
  section: {
    paddingHorizontal: 22,
    marginBottom: 28,
  },
  heatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  heatCell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatCellFuture: {
    borderWidth: 1,
    borderColor: T.dim,
    borderStyle: 'dashed',
  },
  heatDay: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 12,
    lineHeight: 15,
  },
  heatPct: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 8,
    color: T.bg + 'CC',
    marginTop: 1,
  },
  heatMiss: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 8,
    color: T.text + '99',
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 22,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.s1,
    borderRadius: 12,
    padding: 13,
    borderWidth: 0.5,
    borderColor: T.dim,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 20,
    color: T.text,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: T.muted,
    marginTop: 4,
  },
  goalRow: {
    paddingVertical: 13,
  },
  goalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalName: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 14,
    color: T.text,
  },
  goalPct: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 14,
  },
  goalTrack: {
    backgroundColor: T.s3,
    borderRadius: 3,
    height: 3,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    borderRadius: 3,
  },
  newSprintBtn: {
    backgroundColor: T.s1,
    borderWidth: 0.5,
    borderColor: T.dim,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newSprintText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 14,
    color: T.muted,
  },
});
