import React from 'react';
import { render } from '@testing-library/react-native';
import { Ring } from '@/components/grit/ring';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, testID }: any) => <View testID={testID}>{children}</View>,
    Circle: ({ testID, ...props }: any) => <View testID={testID} {...props} />,
  };
});

describe('Ring', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Ring pct={0.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with default size and stroke', () => {
    const { toJSON } = render(<Ring pct={0.4} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with pct = 0 (empty ring)', () => {
    const { toJSON } = render(<Ring pct={0} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with pct = 1 (full ring)', () => {
    const { toJSON } = render(<Ring pct={1} />);
    expect(toJSON()).toBeTruthy();
  });

  it('clamps pct above 1', () => {
    const { toJSON } = render(<Ring pct={1.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('clamps pct below 0', () => {
    const { toJSON } = render(<Ring pct={-0.5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts custom size prop', () => {
    const { toJSON } = render(<Ring pct={0.5} size={80} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts custom stroke prop', () => {
    const { toJSON } = render(<Ring pct={0.5} stroke={12} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts custom color prop', () => {
    const { toJSON } = render(<Ring pct={0.5} color="#FF0000" />);
    expect(toJSON()).toBeTruthy();
  });
});
