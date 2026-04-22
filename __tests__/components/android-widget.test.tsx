import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StreakWidget2x2, StreakWidget4x2 } from '@/widgets/StreakWidget';

jest.mock('react-native-android-widget', () => {
  const { View, Text } = require('react-native');
  return {
    FlexWidget: ({ children, style }: any) => <View style={style}>{children}</View>,
    TextWidget: ({ text, style }: any) => <Text style={style}>{text}</Text>,
    ImageWidget: ({ style }: any) => <View style={style} />,
    registerWidgetTaskHandler: jest.fn(),
    requestWidgetUpdate: jest.fn(),
  };
});

const defaultProps = {
  streak: 12,
  dailyPct: 0.4,
  sprintDay: 7,
  sprintTotal: 14,
};

describe('StreakWidget2x2', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<StreakWidget2x2 {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows GRIT branding', () => {
    render(<StreakWidget2x2 {...defaultProps} />);
    expect(screen.getByText('GRIT')).toBeTruthy();
  });

  it('shows streak count', () => {
    render(<StreakWidget2x2 {...defaultProps} />);
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('shows DAY STREAK label', () => {
    render(<StreakWidget2x2 {...defaultProps} />);
    expect(screen.getByText('DAY STREAK')).toBeTruthy();
  });

  it('shows flame emoji', () => {
    render(<StreakWidget2x2 {...defaultProps} />);
    expect(screen.getByText('🔥')).toBeTruthy();
  });

  it('renders streak of 0', () => {
    render(<StreakWidget2x2 {...defaultProps} streak={0} />);
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('renders large streak numbers', () => {
    render(<StreakWidget2x2 {...defaultProps} streak={365} />);
    expect(screen.getByText('365')).toBeTruthy();
  });
});

describe('StreakWidget4x2', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<StreakWidget4x2 {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows GRIT branding', () => {
    render(<StreakWidget4x2 {...defaultProps} />);
    expect(screen.getByText('GRIT')).toBeTruthy();
  });

  it('shows streak count and flame in wide layout', () => {
    render(<StreakWidget4x2 {...defaultProps} />);
    expect(screen.getByText('12 Day Streak')).toBeTruthy();
    expect(screen.getByText('🔥')).toBeTruthy();
  });

  it('shows sprint day info', () => {
    render(<StreakWidget4x2 {...defaultProps} />);
    expect(screen.getByText('Sprint · Day 7 of 14')).toBeTruthy();
  });

  it('shows daily completion percentage', () => {
    render(<StreakWidget4x2 {...defaultProps} />);
    expect(screen.getByText('40% done today')).toBeTruthy();
  });

  it('renders 100% daily completion', () => {
    render(<StreakWidget4x2 {...defaultProps} dailyPct={1} />);
    expect(screen.getByText('100% done today')).toBeTruthy();
  });
});
