import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Label } from '@/components/grit/label';
import { T } from '@/constants/theme';

const WINDOW_SECS = 20 * 60;

function ChevronIcon() {
  return (
    <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
      <Path d="M7 1L1 7l6 6" stroke={T.muted} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={28} height={22} viewBox="0 0 24 18" fill="none">
      <Path d="M2 9l7 7L22 2" stroke={T.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CameraIcon() {
  return (
    <Svg width={22} height={20} viewBox="0 0 24 20" fill="none">
      <Path d="M23 17a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" stroke={T.bg} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 14.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke={T.bg} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function FlameIcon() {
  return (
    <Svg width={16} height={20} viewBox="0 0 16 22" fill="none">
      <Path d="M8 2C8 2 4 6 4 10c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.4-.7-2.6-1.5-3.5C9.7 5.8 10 4.5 8 2z" stroke={T.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 16c-2-1.2-3-3.2-3-5.5C1 5.3 5.5 1 8 1c2.5 0 7 4.3 7 9.5S12.5 20 8 20c-4.5 0-7-3-7-6" stroke={T.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Phase = 'act' | 'preview' | 'done' | 'missed';

export default function ActionScreen() {
  const insets = useSafeAreaInsets();
  const { taskName, pts } = useLocalSearchParams<{ taskName: string; pts: string }>();

  const [secs, setSecs] = useState(27 * 60 + 43);
  const [snoozed, setSnoozed] = useState(0);
  const [phase, setPhase] = useState<Phase>('act');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== 'act') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { setPhase('missed'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const windowProgress = 1 - secs / WINDOW_SECS;
  const barColor = windowProgress > 0.8 ? T.red : windowProgress > 0.5 ? T.amber : T.accent;

  const goBack = () => router.back();
  const name = taskName ?? 'Midday Walk';
  const points = pts ?? '20';

  if (phase === 'done') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
        <View style={styles.centerContent}>
          <View style={styles.checkCircle}><CheckIcon /></View>
          <Text style={styles.doneTitle}>Done.</Text>
          <Text style={styles.doneSubtitle}>{name} completed.</Text>
          <Text style={styles.donePoints}>+{points} pts</Text>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>Back to Today</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'missed') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
        <View style={styles.centerContent}>
          <Text style={styles.missedTitle}>Missed.</Text>
          <Text style={styles.missedSubtitle}>Action window expired. Streak at risk.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>Back to Today</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'preview') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
        <View style={styles.previewPhoto}>
          <Text style={styles.previewPlaceholder}>📷{'\n'}proof photo preview</Text>
        </View>
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={styles.retakeBtn} onPress={() => setPhase('act')}>
            <Text style={styles.retakeBtnText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={() => setPhase('done')}>
            <Text style={styles.submitBtnText}>Submit Proof</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      {/* Back */}
      <TouchableOpacity style={styles.backRow} onPress={goBack}>
        <ChevronIcon />
        <Text style={styles.backLabel}>Today</Text>
      </TouchableOpacity>

      {/* Task label */}
      <View style={styles.taskHeader}>
        <Label style={{ marginBottom: 8 }}>Now Active · 12:00 PM</Label>
        <Text style={styles.taskName}>{name}</Text>
      </View>

      {/* Countdown hero */}
      <View style={styles.countdownSection}>
        <View style={styles.countdown}>
          <Text style={styles.countDigit}>{mm}</Text>
          <Text style={styles.countColon}>:</Text>
          <Text style={styles.countDigit}>{ss}</Text>
        </View>
        <Label style={{ marginBottom: 28 }}>Remaining in window</Label>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${windowProgress * 100}%` as any, backgroundColor: barColor }]} />
        </View>

        {/* Streak stake */}
        <View style={styles.stakeRow}>
          <FlameIcon />
          <Text style={styles.stakeText}>Streak at stake:</Text>
          <Text style={styles.stakeVal}>12 days</Text>
        </View>
      </View>

      {/* CTAs */}
      <View style={[styles.ctas, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.proofBtn} onPress={() => setPhase('preview')}>
          <CameraIcon />
          <Text style={styles.proofBtnText}>Capture Proof</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.snoozeBtn, snoozed >= 3 && styles.snoozeBtnDisabled]}
          onPress={() => snoozed < 3 && setSnoozed(s => s + 1)}
          disabled={snoozed >= 3}
        >
          <Text style={[styles.snoozeBtnText, snoozed >= 3 && styles.snoozeBtnTextDisabled]}>
            {snoozed >= 3 ? 'No snoozes remaining' : `Snooze  ·  −10 pts  ·  ${3 - snoozed} of 3 left`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: T.bg,
    flexDirection: 'column',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingBottom: 24,
  },
  backLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: T.muted,
  },
  taskHeader: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  taskName: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: T.text,
    letterSpacing: -0.5,
  },
  countdownSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: 8,
  },
  countDigit: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 88,
    color: T.text,
    lineHeight: 92,
    letterSpacing: -4,
  },
  countColon: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 64,
    color: T.accent,
    lineHeight: 92,
    marginHorizontal: 2,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: T.s3,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stakeText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 13,
    color: T.muted,
  },
  stakeVal: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 13,
    color: T.accent,
  },
  ctas: {
    paddingHorizontal: 22,
    gap: 10,
  },
  proofBtn: {
    width: '100%',
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  proofBtnText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 17,
    color: T.bg,
  },
  snoozeBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: T.s3,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  snoozeBtnDisabled: {
    borderColor: T.dim,
  },
  snoozeBtnText: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 14,
    color: T.muted,
  },
  snoozeBtnTextDisabled: {
    color: T.dim,
  },
  // Done / Missed
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  doneTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 42,
    color: T.text,
    marginBottom: 8,
    letterSpacing: -1,
  },
  doneSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: T.muted,
    marginBottom: 4,
  },
  donePoints: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: T.accent,
    marginBottom: 48,
  },
  backBtn: {
    backgroundColor: T.s2,
    borderWidth: 1,
    borderColor: T.dim,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  backBtnText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 15,
    color: T.text,
  },
  missedTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 64,
    color: T.red,
    marginBottom: 16,
    letterSpacing: -2,
  },
  missedSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: T.muted,
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Preview
  previewPhoto: {
    flex: 1,
    margin: 24,
    backgroundColor: T.s2,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: T.dim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPlaceholder: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: T.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 22,
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: T.s2,
    borderWidth: 1,
    borderColor: T.dim,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retakeBtnText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 15,
    color: T.muted,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: T.bg,
  },
});
