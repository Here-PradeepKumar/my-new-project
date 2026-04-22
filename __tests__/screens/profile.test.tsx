import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

import { router } from 'expo-router';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@/contexts/auth', () => ({
  useAuth: () => ({
    user: { name: 'mkang', email: 'mk@grit.app', initials: 'MK' },
    isAuthenticated: true,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    (router.push as jest.Mock).mockClear();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<ProfileScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows username from auth context', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('mkang')).toBeTruthy();
  });

  it('shows initials in avatar', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('MK')).toBeTruthy();
  });

  it('shows sprint status', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Sprint #3 Active · Day 9')).toBeTruthy();
  });

  it('shows Settings button', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('navigates to /settings when Settings is pressed', () => {
    render(<ProfileScreen />);
    fireEvent.press(screen.getByText('Settings'));
    expect(router.push).toHaveBeenCalledWith('/settings');
  });

  it('shows Lifetime section', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Lifetime')).toBeTruthy();
  });

  it('shows all lifetime stats', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Sprints started')).toBeTruthy();
    expect(screen.getByText('Sprints passed')).toBeTruthy();
    expect(screen.getByText('Current streak')).toBeTruthy();
    expect(screen.getByText('Longest streak')).toBeTruthy();
  });

  it('shows Badges section', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Badges')).toBeTruthy();
  });

  it('shows earned badges', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('First Sprint')).toBeTruthy();
    expect(screen.getByText('7-Day Streak')).toBeTruthy();
    expect(screen.getByText('Perfect Day')).toBeTruthy();
  });

  it('shows unearned badges', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('30-Day Streak')).toBeTruthy();
    expect(screen.getByText('Perfect Sprint')).toBeTruthy();
  });

  it('shows Sprint History section', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Sprint History')).toBeTruthy();
  });

  it('shows sprint history entries', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Sprint #2')).toBeTruthy();
    expect(screen.getByText('Sprint #1')).toBeTruthy();
  });

  it('shows pass/fail results', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('PASS')).toBeTruthy();
    expect(screen.getByText('FAIL')).toBeTruthy();
  });
});
