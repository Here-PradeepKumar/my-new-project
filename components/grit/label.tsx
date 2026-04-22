import React from 'react';
import { Text, TextStyle } from 'react-native';
import { T } from '@/constants/theme';

type LabelProps = {
  children: React.ReactNode;
  style?: TextStyle;
};

export function Label({ children, style }: LabelProps) {
  return (
    <Text style={[{
      fontFamily: 'Inter_600SemiBold',
      fontSize: 10,
      color: T.muted,
      textTransform: 'uppercase',
      letterSpacing: 1.6,
    }, style]}>
      {children}
    </Text>
  );
}
