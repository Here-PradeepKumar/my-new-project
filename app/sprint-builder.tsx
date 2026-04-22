import React, { useRef, useState } from 'react';
import {
  Animated, PanResponder, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Divider } from '@/components/grit/divider';
import { Label } from '@/components/grit/label';
import { T } from '@/constants/theme';

const SLIDE_WIDTH = 262;
const LOCK_THRESHOLD = 0.88;

type Goal = { name: string; time: string; days: string; pts: number; window: string };

const DEFAULT_GOALS: Goal[] = [
  { name: 'Morning Workout', time: '7:00 AM', days: 'Mon–Fri', pts: 30, window: '30 min' },
  { name: 'Cold Shower',     time: '6:00 AM', days: 'Daily',   pts: 15, window: '15 min' },
  { name: 'Midday Walk',     time: '12:00 PM',days: 'Daily',   pts: 20, window: '20 min' },
  { name: 'Reading',         time: '9:00 PM', days: 'Daily',   pts: 20, window: '30 min' },
];

const TEMPLATES = ['Fitness Foundations', 'Deep Work 14', 'Reading Habit', 'Morning Ritual', 'Athlete Base'];
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STEP_LABELS = ['Goals', 'Schedule', 'Lock'];

function ChevronIcon() {
  return (
    <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
      <Path d="M7 1L1 7l6 6" stroke={T.muted} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v16M4 12h16" stroke={T.muted} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

export default function SprintBuilderScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [locked, setLocked] = useState(false);

  const slideX = useRef(new Animated.Value(0)).current;
  const slideXVal = useRef(0);
  useRef(slideX.addListener(({ value }) => { slideXVal.current = value; }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        const clamped = Math.max(0, Math.min(SLIDE_WIDTH, gs.dx));
        slideX.setValue(clamped);
      },
      onPanResponderRelease: () => {
        const progress = slideXVal.current / SLIDE_WIDTH;
        if (progress > LOCK_THRESHOLD) {
          Animated.timing(slideX, { toValue: SLIDE_WIDTH, duration: 150, useNativeDriver: false }).start(() => {
            setLocked(true);
          });
        } else {
          Animated.spring(slideX, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const slideProgress = slideX.interpolate({ inputRange: [0, SLIDE_WIDTH], outputRange: [0, 1], extrapolate: 'clamp' });
  const labelOpacity = slideX.interpolate({ inputRange: [0, SLIDE_WIDTH * 0.6], outputRange: [1, 0], extrapolate: 'clamp' });

  const loadLevel = goals.length <= 3 ? 'Light' : goals.length <= 5 ? 'Moderate' : 'Heavy';
  const loadColor = goals.length <= 3 ? T.accent : goals.length <= 5 ? T.amber : T.red;
  const maxPts = goals.reduce((a, g) => a + g.pts, 0) * 14;

  if (locked) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
        <View style={styles.lockedContent}>
          <View style={styles.lockCircle}><LockIcon color={T.accent} /></View>
          <Text style={styles.lockedTitle}>Sprint Locked.</Text>
          <Text style={styles.lockedSub}>14 days. No changes. No excuses.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Sprint</Text>
          <Text style={styles.headerDays}>14 days</Text>
        </View>
        {/* Step progress */}
        <View style={styles.stepBars}>
          {STEP_LABELS.map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.stepBar, i <= step && { backgroundColor: T.accent }]}
              onPress={() => i < step && setStep(i)}
            />
          ))}
        </View>
        <View style={styles.stepLabels}>
          {STEP_LABELS.map((s, i) => (
            <Text key={i} style={[styles.stepLabel, i === step && { color: T.accent, fontFamily: 'Inter_600SemiBold' }]}>{s}</Text>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Step 0: Goals ── */}
        {step === 0 && (
          <View>
            <View style={styles.nameInput}>
              <TextInput
                defaultValue="Sprint #3"
                style={styles.nameInputText}
                placeholderTextColor={T.muted}
              />
            </View>

            <Label style={{ marginBottom: 12 }}>Templates</Label>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 28 }}>
              <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 4 }}>
                {TEMPLATES.map((t, i) => (
                  <View key={i} style={styles.templatePill}>
                    <Text style={styles.templateText}>{t}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.goalsHeader}>
              <Label>Goals ({goals.length})</Label>
              <View style={[styles.loadBadge, { backgroundColor: loadColor + '22', borderColor: loadColor + '44' }]}>
                <Text style={[styles.loadBadgeText, { color: loadColor }]}>Load: {loadLevel}</Text>
              </View>
            </View>

            {goals.map((g, i) => (
              <View key={i}>
                <View style={styles.goalRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goalName}>{g.name}</Text>
                    <Text style={styles.goalMeta}>{g.time} · {g.days} · {g.window}</Text>
                  </View>
                  <Text style={styles.goalPts}>{g.pts}pts</Text>
                  <TouchableOpacity onPress={() => setGoals(gs => gs.filter((_, j) => j !== i))} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>×</Text>
                  </TouchableOpacity>
                </View>
                {i < goals.length - 1 && <Divider />}
              </View>
            ))}

            <TouchableOpacity
              style={styles.addGoalBtn}
              onPress={() => setGoals(gs => [...gs, { name: 'Custom Goal', time: '8:00 AM', days: 'Daily', pts: 20, window: '30 min' }])}
            >
              <PlusIcon />
              <Text style={styles.addGoalText}>Add Custom Goal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Step 1: Schedule ── */}
        {step === 1 && (
          <View>
            <Label style={{ marginBottom: 16 }}>Week Preview</Label>
            {WEEK_DAYS.map((day, di) => {
              const dayGoals = goals.filter((_, gi) => di < 5 ? true : gi % 2 === 0);
              return (
                <View key={di} style={styles.weekRow}>
                  <Text style={styles.weekDay}>{day}</Text>
                  <View style={styles.weekPills}>
                    {dayGoals.map((g, gi) => (
                      <View key={gi} style={styles.weekPill}>
                        <Text style={styles.weekPillText}>
                          {g.time.split(':')[0]}{g.time.includes('PM') ? 'p' : 'a'} {g.name.split(' ')[0]}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}

            <View style={styles.loadCard}>
              <Label style={{ marginBottom: 12 }}>Daily Load</Label>
              <View style={styles.barChart}>
                {[0.65, 0.65, 0.65, 0.65, 0.65, 0.35, 0.35].map((h, i) => (
                  <View key={i} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View style={[
                        styles.barFill,
                        { height: `${h * 100}%` as any, backgroundColor: h > 0.8 ? T.red : h > 0.5 ? T.amber : T.accent },
                      ]} />
                    </View>
                    <Text style={styles.barLabel}>{'MTWTFSS'[i]}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.summaryCard}>
              {[
                { day: 'Mon–Fri', tasks: `${goals.length} tasks`, time: '~2h 15m' },
                { day: 'Sat–Sun', tasks: `${Math.ceil(goals.length / 2)} tasks`, time: '~1h 00m' },
              ].map((d, i) => (
                <View key={i} style={[styles.summaryRow, i === 0 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.dim }]}>
                  <Text style={styles.summaryDay}>{d.day}</Text>
                  <Text style={styles.summaryMeta}>{d.tasks} · {d.time}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 2: Lock ── */}
        {step === 2 && (
          <View>
            <View style={styles.summaryBigCard}>
              <View style={styles.summaryBigTop}>
                <View>
                  <Text style={styles.summaryBigTitle}>Sprint #3</Text>
                  <Text style={styles.summaryBigSub}>14 days · starts today</Text>
                </View>
                <View style={styles.goalCountBadge}>
                  <Text style={styles.goalCountNum}>{goals.length}</Text>
                  <Text style={styles.goalCountLabel}>goals</Text>
                </View>
              </View>
              <View style={styles.summaryBigStats}>
                {[
                  { val: '70%', label: 'Min to pass' },
                  { val: `${maxPts}`, label: 'Max pts' },
                  { val: '14', label: 'Days' },
                ].map((s, i) => (
                  <View key={i}>
                    <Text style={styles.summaryBigStatVal}>{s.val}</Text>
                    <Text style={styles.summaryBigStatLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                After locking, nothing can be changed. Not the goals, not the times, not the proof requirements.
              </Text>
            </View>

            <Label style={{ marginBottom: 12 }}>Goals</Label>
            {goals.map((g, i) => (
              <View key={i} style={styles.lockGoalRow}>
                <View style={styles.lockGoalTop}>
                  <Text style={styles.lockGoalName}>{g.name}</Text>
                  <Text style={styles.lockGoalPts}>{g.pts}pts</Text>
                </View>
                <Text style={styles.lockGoalMeta}>{g.time} · {g.days} · {g.window}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {step < 2 ? (
          <TouchableOpacity style={styles.continueBtn} onPress={() => setStep(s => s + 1)}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.slideTrack} {...panResponder.panHandlers}>
            <Animated.View style={[styles.slideFill, { width: slideX.interpolate({ inputRange: [0, SLIDE_WIDTH], outputRange: ['0%', '100%'], extrapolate: 'clamp' }) }]} />
            <Animated.Text style={[styles.slideLabel, { opacity: labelOpacity }]}>
              Slide to Lock Sprint  →
            </Animated.Text>
            <Animated.View style={[styles.slideThumb, { left: Animated.add(slideX, new Animated.Value(6)) }]}>
              <LockIcon color={T.bg} />
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 20,
    color: T.text,
    flex: 1,
  },
  headerDays: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: T.muted,
  },
  stepBars: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  stepBar: {
    flex: 1,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: T.dim,
  },
  stepLabels: {
    flexDirection: 'row',
    gap: 6,
  },
  stepLabel: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: T.muted,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
  },
  nameInput: {
    backgroundColor: T.s1,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: T.dim,
    marginBottom: 24,
    paddingVertical: 4,
  },
  nameInputText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 20,
    color: T.text,
    padding: 13,
  },
  templatePill: {
    backgroundColor: T.s2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 0.5,
    borderColor: T.dim,
  },
  templateText: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 13,
    color: T.text,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  loadBadgeText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  goalName: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 15,
    color: T.text,
  },
  goalMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: T.muted,
    marginTop: 3,
  },
  goalPts: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 13,
    color: T.muted,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 20,
    color: T.red,
    lineHeight: 22,
  },
  addGoalBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: T.dim,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 13,
  },
  addGoalText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 14,
    color: T.muted,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  weekDay: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 12,
    color: T.muted,
    width: 32,
    flexShrink: 0,
  },
  weekPills: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  weekPill: {
    backgroundColor: T.s2,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: T.accent + '33',
  },
  weekPillText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: T.accent,
  },
  loadCard: {
    backgroundColor: T.s1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: T.dim,
    marginTop: 16,
    marginBottom: 12,
  },
  barChart: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    height: 56,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  barTrack: {
    width: '100%',
    height: 44,
    backgroundColor: T.s3,
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
    opacity: 0.85,
  },
  barLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 9,
    color: T.dim,
  },
  summaryCard: {
    backgroundColor: T.s1,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: T.dim,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryDay: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 13,
    color: T.text,
  },
  summaryMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: T.muted,
  },
  summaryBigCard: {
    backgroundColor: T.s1,
    borderRadius: 16,
    padding: 20,
    borderWidth: 0.5,
    borderColor: T.dim,
    marginBottom: 16,
  },
  summaryBigTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  summaryBigTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: T.text,
    letterSpacing: -0.5,
  },
  summaryBigSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: T.muted,
    marginTop: 4,
  },
  goalCountBadge: {
    backgroundColor: T.accent + '22',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  goalCountNum: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 22,
    color: T.accent,
  },
  goalCountLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: T.accent,
  },
  summaryBigStats: {
    flexDirection: 'row',
    gap: 24,
  },
  summaryBigStatVal: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    color: T.text,
  },
  summaryBigStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: T.muted,
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: T.amber + '0D',
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: T.amber + '33',
    marginBottom: 24,
  },
  warningText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: T.amber,
    lineHeight: 20,
  },
  lockGoalRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.dim,
  },
  lockGoalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lockGoalName: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 14,
    color: T.text,
  },
  lockGoalPts: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 13,
    color: T.muted,
  },
  lockGoalMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: T.muted,
    marginTop: 3,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.dim,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  continueBtnText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: T.bg,
  },
  slideTrack: {
    backgroundColor: T.s2,
    borderRadius: 50,
    height: 62,
    borderWidth: 1,
    borderColor: T.dim,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: T.accent + '18',
  },
  slideLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 14,
    color: T.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  slideThumb: {
    position: 'absolute',
    top: 6,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Locked state
  lockedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  lockCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  lockedTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 36,
    color: T.text,
    marginBottom: 10,
    letterSpacing: -1,
  },
  lockedSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: T.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
