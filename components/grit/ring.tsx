import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { T } from '@/constants/theme';

type RingProps = {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
};

export function Ring({ pct, size = 110, stroke = 9, color = T.accent }: RingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * Math.min(1, Math.max(0, pct));

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.s2} strokeWidth={stroke} />
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </Svg>
  );
}
