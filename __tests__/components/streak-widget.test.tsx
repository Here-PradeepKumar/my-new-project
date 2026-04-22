import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StreakWidget } from '@/components/grit/streak-widget';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => <View>{children}</View>,
    Circle: (props: any) => <View {...props} />,
    Defs: ({ children }: any) => <View>{children}</View>,
    LinearGradient: ({ children }: any) => <View>{children}</View>,
    Stop: (props: any) => <View {...props} />,
  };
});

describe('StreakWidget', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<StreakWidget streak={12} />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays streak count', () => {
    render(<StreakWidget streak={12} />);
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('displays DAY STREAK label', () => {
    render(<StreakWidget streak={5} />);
    expect(screen.getByText('DAY STREAK')).toBeTruthy();
  });

  it('shows daily percentage hint when dailyPct > 0', () => {
    render(<StreakWidget streak={12} dailyPct={0.4} />);
    expect(screen.getByText('40% today')).toBeTruthy();
  });

  it('hides daily hint when dailyPct is 0', () => {
    render(<StreakWidget streak={12} dailyPct={0} />);
    expect(screen.queryByText(/today/)).toBeNull();
  });

  it('renders with custom size', () => {
    const { toJSON } = render(<StreakWidget streak={7} size={160} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom goalDays', () => {
    const { toJSON } = render(<StreakWidget streak={7} goalDays={14} />);
    expect(toJSON()).toBeTruthy();
  });

  it('handles streak exceeding goal without crashing', () => {
    const { toJSON } = render(<StreakWidget streak={45} goalDays={30} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders streak of 0', () => {
    render(<StreakWidget streak={0} />);
    expect(screen.getByText('0')).toBeTruthy();
  });
});
