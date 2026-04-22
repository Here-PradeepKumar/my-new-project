import React from 'react';
import { render } from '@testing-library/react-native';
import { Divider } from '@/components/grit/divider';

describe('Divider', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Divider />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders a single View element', () => {
    const { toJSON } = render(<Divider />);
    const json = toJSON() as any;
    expect(json.type).toBe('View');
  });

  it('has hairlineWidth height', () => {
    const { toJSON } = render(<Divider />);
    const json = toJSON() as any;
    expect(json.props.style).toEqual(
      expect.objectContaining({ height: expect.any(Number) })
    );
  });
});
