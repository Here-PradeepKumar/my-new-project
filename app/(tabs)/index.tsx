import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Divider } from '@/components/grit/divider';
import { GritLogo } from '@/components/grit/grit-logo';
import { Label } from '@/components/grit/label';
import { StreakWidget } from '@/components/grit/streak-widget';
import { Task, TaskRow } from '@/components/grit/task-row';
import { T } from '@/constants/theme';
import { useWidgetSync } from '@/hooks/use-widget-data';

const TASKS: Task[] = [
  { id: 0, time: '6:00',  label: 'AM', name: 'Cold Shower',     done: true,  active: false, pts: 15, window: '15 min' },
  { id: 1, time: '7:00',  label: 'AM', name: 'Morning Workout', done: true,  active: false, pts: 30, window: '30 min' },
  { id: 2, time: '12:00', label: 'PM', name: 'Midday Walk',     done: false, active: true,  pts: 20, window: '20 min' },
  { id: 3, time: '3:00',  label: 'PM', name: 'Deep Work Block', done: false, active: false, pts: 40, window: '60 min' },
  { id: 4, time: '9:00',  label: 'PM', name: 'Reading',         done: false, active: false, pts: 20, window: '30 min' },
];

const STREAK = 12;
const GOAL_DAYS = 30;
const INITIAL_SECS = 3 * 3600 + 47 * 60 + 22;

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const [secs, setSecs] = useState(INITIAL_SECS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecs(s => Math.max(0, s - 1));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const hh = String(Math.floor(secs / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  const doneCount = TASKS.filter(t => t.done).length;
  const dailyPct = doneCount / TASKS.length;
  const activeTask = TASKS.find(t => t.active);

  useWidgetSync({ streak: STREAK, dailyPct, sprintDay: 7, sprintTotal: 14 });

  const stats = [
    { val: `${doneCount}/${TASKS.length}`, label: 'Tasks done' },
    { val: '85',  label: 'Pts today' },
    { val: '84%', label: 'Sprint avg' },
    { val: '847', label: 'Total pts' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Label style={{ marginBottom: 6 }}>Day 7 of 14</Label>
          <GritLogo size={36} />
        </View>
        <View style={styles.streakCol}>
          <Label style={{ marginBottom: 4 }}>Sprint Avg</Label>
          <Text style={styles.sprintAvg}>84%</Text>
        </View>
      </View>

      {/* Streak Widget — full width, centered */}
      <View style={styles.widgetRow}>
        <StreakWidget
          streak={STREAK}
          goalDays={GOAL_DAYS}
          dailyPct={dailyPct}
          size={200}
        />
        <View style={styles.widgetStats}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Hero card */}
      <TouchableOpacity
        style={styles.heroCard}
        activeOpacity={0.85}
        onPress={() => activeTask && router.push({ pathname: '/action', params: { taskId: String(activeTask.id), taskName: activeTask.name, pts: String(activeTask.pts) } })}
      >
        <View style={styles.heroAccentLine} />
        <View style={styles.heroTop}>
          <View>
            <Label style={{ marginBottom: 6 }}>Up next · 12:00 PM</Label>
            <Text style={styles.heroTaskName}>Midday Walk</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        </View>
        <View style={styles.countdown}>
          <Text style={styles.countDigit}>{hh}</Text>
          <Text style={styles.countColon}>:</Text>
          <Text style={styles.countDigit}>{mm}</Text>
          <Text style={styles.countColon}>:</Text>
          <Text style={styles.countDigit}>{ss}</Text>
        </View>
        <Text style={styles.heroCaption}>until trigger · 20 min action window · 20 pts</Text>
      </TouchableOpacity>

      {/* Task list */}
      <View style={styles.taskSection}>
        <Label style={{ marginBottom: 14 }}>Today's Schedule</Label>
        {TASKS.map((task, i) => (
          <View key={task.id}>
            <TaskRow
              task={task}
              onPress={() => router.push({ pathname: '/action', params: { taskId: String(task.id), taskName: task.name, pts: String(task.pts) } })}
            />
            {i < TASKS.length - 1 && <Divider />}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  streakCol: {
    alignItems: 'flex-end',
  },
  sprintAvg: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 30,
    color: T.accent,
    lineHeight: 36,
  },
  widgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginBottom: 24,
    gap: 16,
  },
  widgetStats: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  statItem: {
    width: '45%',
  },
  statVal: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: T.text,
    lineHeight: 26,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: T.muted,
    marginTop: 3,
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: T.s1,
    borderRadius: 18,
    padding: 22,
    borderWidth: 0.5,
    borderColor: T.dim,
    overflow: 'hidden',
  },
  heroAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: T.accent,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    marginTop: 2,
  },
  heroTaskName: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    color: T.text,
  },
  activeBadge: {
    backgroundColor: T.accent + '22',
    borderWidth: 1,
    borderColor: T.accent + '44',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadgeText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    color: T.accent,
    letterSpacing: 1,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    gap: 2,
  },
  countDigit: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 68,
    color: T.text,
    lineHeight: 72,
    letterSpacing: -3,
  },
  countColon: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 52,
    color: T.accent,
    lineHeight: 72,
  },
  heroCaption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: T.muted,
  },
  taskSection: {
    paddingHorizontal: 22,
  },
});
