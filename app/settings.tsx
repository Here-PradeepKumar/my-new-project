import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Label } from '@/components/grit/label';
import { T } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';

function ChevronRight() {
  return (
    <Svg width={7} height={12} viewBox="0 0 7 12" fill="none">
      <Path d="M1 1l5 5-5 5" stroke={T.dim} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BackIcon() {
  return (
    <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
      <Path d="M7 1L1 7l6 6" stroke={T.muted} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

type RowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

function SettingsRow({ label, value, onPress, danger }: RowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <Text style={[styles.rowLabel, danger && { color: T.red }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {onPress ? <ChevronRight /> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <BackIcon />
        <Text style={styles.backLabel}>Profile</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      {/* Account */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 12 }}>Account</Label>
        <View style={styles.card}>
          <SettingsRow label="Email" value={user?.email ?? '—'} />
          <View style={styles.divider} />
          <SettingsRow label="Username" value={user?.name ?? '—'} />
          <View style={styles.divider} />
          <SettingsRow label="Change Password" onPress={() => {}} />
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 12 }}>Preferences</Label>
        <View style={styles.card}>
          <SettingsRow label="Notifications" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingsRow label="Action Window Duration" value="20 min" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingsRow label="Passing Threshold" value="70%" onPress={() => {}} />
        </View>
      </View>

      {/* App */}
      <View style={styles.section}>
        <Label style={{ marginBottom: 12 }}>App</Label>
        <View style={styles.card}>
          <SettingsRow label="Version" value="1.0.0" />
          <View style={styles.divider} />
          <SettingsRow label="Privacy Policy" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingsRow label="Terms of Service" onPress={() => {}} />
        </View>
      </View>

      {/* Sign Out */}
      <View style={[styles.section, { marginTop: 8 }]}>
        <View style={styles.card}>
          <SettingsRow label="Sign Out" onPress={handleSignOut} danger />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  backLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: T.muted,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: T.text,
    letterSpacing: -0.5,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  section: {
    paddingHorizontal: 22,
    marginBottom: 24,
  },
  card: {
    backgroundColor: T.s1,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: T.dim,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  rowLabel: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 15,
    color: T.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: T.muted,
  },
  divider: {
    height: 0.5,
    backgroundColor: T.dim,
    marginLeft: 16,
  },
});
