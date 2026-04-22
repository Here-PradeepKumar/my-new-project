import React from 'react';
import { StyleSheet, View } from 'react-native';
import { T } from '@/constants/theme';

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.dim,
  },
});
