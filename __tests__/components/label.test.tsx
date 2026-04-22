import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Label } from '@/components/grit/label';

describe('Label', () => {
  it('renders children text', () => {
    render(<Label>Today's Schedule</Label>);
    expect(screen.getByText("Today's Schedule")).toBeTruthy();
  });

  it('renders uppercase text', () => {
    const { toJSON } = render(<Label>streak</Label>);
    const json = toJSON() as any;
    expect(json.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textTransform: 'uppercase' }),
      ])
    );
  });

  it('accepts additional style prop', () => {
    const { toJSON } = render(
      <Label style={{ marginBottom: 8 }}>Label</Label>
    );
    const json = toJSON() as any;
    expect(json.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ marginBottom: 8 })])
    );
  });

  it('renders numeric children', () => {
    render(<Label>{42}</Label>);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders empty string without crashing', () => {
    const { toJSON } = render(<Label>{''}</Label>);
    expect(toJSON()).toBeTruthy();
  });
});
