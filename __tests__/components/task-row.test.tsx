import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskRow, Task } from '@/components/grit/task-row';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => <View>{children}</View>,
    Path: (props: any) => <View {...props} />,
  };
});

const baseTask: Task = {
  id: 1,
  time: '7:00',
  label: 'AM',
  name: 'Morning Workout',
  done: false,
  active: false,
  pts: 30,
  window: '30 min',
};

describe('TaskRow', () => {
  it('renders task name', () => {
    render(<TaskRow task={baseTask} />);
    expect(screen.getByText('Morning Workout')).toBeTruthy();
  });

  it('renders task time', () => {
    render(<TaskRow task={baseTask} />);
    expect(screen.getByText('7:00')).toBeTruthy();
  });

  it('renders AM/PM label', () => {
    render(<TaskRow task={baseTask} />);
    expect(screen.getByText('AM')).toBeTruthy();
  });

  it('renders points for upcoming task', () => {
    render(<TaskRow task={baseTask} />);
    expect(screen.getByText('30pts')).toBeTruthy();
  });

  it('renders +pts for done task', () => {
    render(<TaskRow task={{ ...baseTask, done: true }} />);
    expect(screen.getByText('+30')).toBeTruthy();
  });

  it('shows tap hint for active task', () => {
    render(<TaskRow task={{ ...baseTask, active: true }} />);
    expect(screen.getByText('Tap to act now')).toBeTruthy();
  });

  it('does not show tap hint for upcoming task', () => {
    render(<TaskRow task={baseTask} />);
    expect(screen.queryByText('Tap to act now')).toBeNull();
  });

  it('calls onPress when active task is pressed', () => {
    const onPress = jest.fn();
    render(<TaskRow task={{ ...baseTask, active: true }} onPress={onPress} />);
    fireEvent.press(screen.getByText('Morning Workout'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when non-active task is pressed', () => {
    const onPress = jest.fn();
    render(<TaskRow task={baseTask} onPress={onPress} />);
    fireEvent.press(screen.getByText('Morning Workout'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders without onPress prop', () => {
    const { toJSON } = render(<TaskRow task={baseTask} />);
    expect(toJSON()).toBeTruthy();
  });
});
