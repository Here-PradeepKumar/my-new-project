import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { T } from '@/constants/theme';

type StreakWidgetProps = {
  streak: number;
  goalDays?: number;
  dailyPct?: number;
  size?: number;
};

function Ring({
  size,
  stroke,
  radius,
  pct,
  color,
  trackColor,
  gradientId,
}: {
  size: number;
  stroke: number;
  radius: number;
  pct: number;
  color: string;
  trackColor: string;
  gradientId?: string;
}) {
  const circ = 2 * Math.PI * radius;
  const filled = circ * Math.min(1, Math.max(0, pct));

  return (
    <>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={gradientId ? `url(#${gradientId})` : color}
        strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </>
  );
}

export function StreakWidget({
  streak,
  goalDays = 30,
  dailyPct = 0,
  size = 200,
}: StreakWidgetProps) {
  const outerStroke = size * 0.075;
  const innerStroke = size * 0.045;
  const gap = size * 0.03;

  const outerRadius = (size - outerStroke) / 2;
  const innerRadius = outerRadius - outerStroke / 2 - innerStroke / 2 - gap;

  const streakPct = Math.min(streak / goalDays, 1);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Defs>
          <LinearGradient id="streakGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={T.accent} stopOpacity="1" />
            <Stop offset="100%" stopColor="#00BFA5" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="dailyGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={T.accent} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={T.accent} stopOpacity="0.9" />
          </LinearGradient>
        </Defs>

        {/* Outer ring — streak progress toward goal */}
        <Ring
          size={size}
          stroke={outerStroke}
          radius={outerRadius}
          pct={streakPct}
          color={T.accent}
          trackColor={T.s2}
          gradientId="streakGrad"
        />

        {/* Inner ring — today's task completion */}
        <Ring
          size={size}
          stroke={innerStroke}
          radius={innerRadius}
          pct={dailyPct}
          color={T.accent}
          trackColor={T.s3}
          gradientId="dailyGrad"
        />
      </Svg>

      {/* Center content */}
      <View style={styles.center}>
        <Text style={[styles.streakNum, { fontSize: size * 0.26 }]}>{streak}</Text>
        <Text style={[styles.dayLabel, { fontSize: size * 0.085 }]}>DAY STREAK</Text>
        {dailyPct > 0 && (
          <Text style={[styles.dailyHint, { fontSize: size * 0.065 }]}>
            {Math.round(dailyPct * 100)}% today
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNum: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: T.text,
    letterSpacing: -2,
    lineHeight: undefined,
  },
  dayLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: T.muted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  dailyHint: {
    fontFamily: 'Inter_400Regular',
    color: T.accent,
    marginTop: 4,
    opacity: 0.8,
  },
});
