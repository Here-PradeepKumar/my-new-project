import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TodayScreen from '@/app/(tabs)/index';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  const Stub = ({ children }: any) => <View>{children}</View>;
  return {
    __esModule: true,
    default: Stub,
    Circle: (props: any) => <View {...props} />,
    Path: (props: any) => <View {...props} />,
    Defs: Stub,
    LinearGradient: Stub,
    Stop: (props: any) => <View {...props} />,
  };
});

jest.mock('@/components/grit/grit-logo', () => ({
  GritLogo: () => {
    const { Text } = require('react-native');
    return <Text>GRIT</Text>;
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  multiSet: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-android-widget', () => ({
  registerWidgetTaskHandler: jest.fn(),
  requestWidgetUpdate: jest.fn(),
}));

describe('TodayScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<TodayScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows day progress label', () => {
    render(<TodayScreen />);
    expect(screen.getByText('Day 7 of 14')).toBeTruthy();
  });

  it('shows sprint avg label', () => {
    render(<TodayScreen />);
    expect(screen.getByText('Sprint Avg')).toBeTruthy();
  });

  it('shows streak count inside widget', () => {
    render(<TodayScreen />);
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('shows active task name in hero card', () => {
    render(<TodayScreen />);
    expect(screen.getAllByText('Midday Walk').length).toBeGreaterThan(0);
  });

  it('shows ACTIVE badge', () => {
    render(<TodayScreen />);
    expect(screen.getByText('ACTIVE')).toBeTruthy();
  });

  it('shows today schedule label', () => {
    render(<TodayScreen />);
    expect(screen.getByText("Today's Schedule")).toBeTruthy();
  });

  it('renders all 5 tasks', () => {
    render(<TodayScreen />);
    expect(screen.getByText('Cold Shower')).toBeTruthy();
    expect(screen.getByText('Morning Workout')).toBeTruthy();
    expect(screen.getByText('Deep Work Block')).toBeTruthy();
    expect(screen.getByText('Reading')).toBeTruthy();
  });

  it('shows tasks done count in stats', () => {
    render(<TodayScreen />);
    expect(screen.getByText('2/5')).toBeTruthy();
  });

  it('shows sprint avg stat', () => {
    render(<TodayScreen />);
    expect(screen.getByText('Sprint avg')).toBeTruthy();
  });

  it('shows total pts stat', () => {
    render(<TodayScreen />);
    expect(screen.getByText('Total pts')).toBeTruthy();
  });

  it('shows countdown hero section caption', () => {
    render(<TodayScreen />);
    expect(screen.getByText('until trigger · 20 min action window · 20 pts')).toBeTruthy();
  });
});
