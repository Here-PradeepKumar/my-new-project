import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { T } from '@/constants/theme';

type GritLogoProps = {
  size?: number;
  showText?: boolean;
};

export function GritLogo({ size = 40, showText = true }: GritLogoProps) {
  return (
    <View style={styles.row}>
      <Image
        source={require('@/assets/images/splash-icon.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {showText && (
        <Text style={styles.wordmark}>GRIT</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 26,
    color: T.text,
    letterSpacing: -0.5,
  },
});
