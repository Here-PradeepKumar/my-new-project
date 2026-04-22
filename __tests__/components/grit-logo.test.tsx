import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { GritLogo } from '@/components/grit/grit-logo';

jest.mock('@/assets/images/splash-icon.png', () => 'splash-icon');

describe('GritLogo', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<GritLogo />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows GRIT wordmark by default', () => {
    render(<GritLogo />);
    expect(screen.getByText('GRIT')).toBeTruthy();
  });

  it('hides wordmark when showText=false', () => {
    render(<GritLogo showText={false} />);
    expect(screen.queryByText('GRIT')).toBeNull();
  });

  it('renders with custom size', () => {
    const { toJSON } = render(<GritLogo size={56} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders icon-only mode without crashing', () => {
    const { toJSON } = render(<GritLogo size={32} showText={false} />);
    expect(toJSON()).toBeTruthy();
  });
});
