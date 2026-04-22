import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SprintScreen from '@/app/(tabs)/sprint';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

import { router } from 'expo-router';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => <View>{children}</View>,
    Path: (props: any) => <View {...props} />,
  };
});

describe('SprintScreen', () => {
  beforeEach(() => {
    (router.push as jest.Mock).mockClear();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<SprintScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows sprint info label', () => {
    render(<SprintScreen />);
    expect(screen.getByText('Sprint #3 · Day 9 of 14')).toBeTruthy();
  });

  it('shows on track status', () => {
    render(<SprintScreen />);
    expect(screen.getByText('On Track')).toBeTruthy();
  });

  it('shows passing label', () => {
    render(<SprintScreen />);
    expect(screen.getByText('↑ Passing')).toBeTruthy();
  });

  it('shows heatmap label', () => {
    render(<SprintScreen />);
    expect(screen.getByText('14-Day Heatmap')).toBeTruthy();
  });

  it('shows all 4 stat cards', () => {
    render(<SprintScreen />);
    expect(screen.getByText('Points')).toBeTruthy();
    expect(screen.getByText('Streak')).toBeTruthy();
    expect(screen.getByText('Missed')).toBeTruthy();
    expect(screen.getByText('Avg')).toBeTruthy();
  });

  it('shows stat values', () => {
    render(<SprintScreen />);
    expect(screen.getByText('847')).toBeTruthy();
    expect(screen.getByText('84%')).toBeTruthy();
  });

  it('shows goal breakdown section', () => {
    render(<SprintScreen />);
    expect(screen.getByText('Goal Breakdown')).toBeTruthy();
  });

  it('shows all goals', () => {
    render(<SprintScreen />);
    expect(screen.getByText('Morning Workout')).toBeTruthy();
    expect(screen.getByText('Cold Shower')).toBeTruthy();
    expect(screen.getByText('Midday Walk')).toBeTruthy();
    expect(screen.getByText('Deep Work Block')).toBeTruthy();
    expect(screen.getByText('Reading')).toBeTruthy();
  });

  it('shows New Sprint button', () => {
    render(<SprintScreen />);
    expect(screen.getByText('New Sprint')).toBeTruthy();
  });

  it('navigates to sprint-builder on New Sprint press', () => {
    render(<SprintScreen />);
    fireEvent.press(screen.getByText('New Sprint'));
    expect(router.push).toHaveBeenCalledWith('/sprint-builder');
  });
});
