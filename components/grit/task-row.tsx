import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { T } from '@/constants/theme';

export type Task = {
  id: number;
  time: string;
  label: string;
  name: string;
  done: boolean;
  active: boolean;
  pts: number;
  window: string;
};

type TaskRowProps = {
  task: Task;
  onPress?: () => void;
};

function CheckIcon() {
  return (
    <Svg width={18} height={14} viewBox="0 0 24 18" fill="none">
      <Path d="M2 9l7 7L22 2" stroke={T.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TaskRow({ task, onPress }: TaskRowProps) {
  const status = task.done ? 'done' : task.active ? 'active' : 'upcoming';
  const dotColor = task.done ? T.accent : task.active ? T.amber : T.dim;

  return (
    <TouchableOpacity
      onPress={task.active ? onPress : undefined}
      activeOpacity={task.active ? 0.7 : 1}
      style={[styles.row, task.done && styles.dimmed]}
    >
      {/* Time */}
      <View style={styles.timeCol}>
        <Text style={[styles.time, status === 'active' && { color: T.accent }]}>{task.time}</Text>
        <Text style={styles.ampm}>{task.label}</Text>
      </View>

      {/* Dot */}
      <View style={[styles.dot, { backgroundColor: dotColor }]} />

      {/* Name */}
      <View style={styles.nameCol}>
        <Text style={[styles.name, status === 'active' && styles.nameActive]}>
          {task.name}
        </Text>
        {task.active && <Text style={styles.tapHint}>Tap to act now</Text>}
      </View>

      {/* Points */}
      <Text style={[styles.pts, task.done && { color: T.accent }]}>
        {task.done ? `+${task.pts}` : `${task.pts}pts`}
      </Text>

      {/* Check badge */}
      {task.done && (
        <View style={styles.checkBadge}>
          <CheckIcon />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
  },
  dimmed: {
    opacity: 0.38,
  },
  timeCol: {
    width: 48,
    alignItems: 'flex-end',
  },
  time: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 13,
    color: T.muted,
    lineHeight: 16,
  },
  ampm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: T.dim,
    marginTop: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  nameCol: {
    flex: 1,
  },
  name: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 15,
    color: T.muted,
  },
  nameActive: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: T.text,
  },
  tapHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: T.amber,
    marginTop: 2,
  },
  pts: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 12,
    color: T.dim,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: T.accent + '22',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
