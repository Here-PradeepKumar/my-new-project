import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

type StreakWidgetProps = {
  streak: number;
  dailyPct: number;
  sprintDay: number;
  sprintTotal: number;
};

// 2×2 compact widget
export function StreakWidget2x2({ streak, dailyPct }: StreakWidgetProps) {
  const pct = Math.round(dailyPct * 100);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111111',
        borderRadius: 20,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 14,
        paddingRight: 14,
      }}
    >
      {/* App name */}
      <TextWidget
        text="GRIT"
        style={{
          fontSize: 11,
          color: '#00E676',
          fontWeight: 'bold',
        }}
      />

      {/* Flame + streak number */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A1A1A',
          borderRadius: 50,
          width: 80,
          height: 80,
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <TextWidget
          text="🔥"
          style={{ fontSize: 22, color: '#FFFFFF' }}
        />
        <TextWidget
          text={String(streak)}
          style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }}
        />
      </FlexWidget>

      {/* Label */}
      <TextWidget
        text="DAY STREAK"
        style={{ fontSize: 9, color: '#7A7A7A' }}
      />

      {/* Daily progress */}
      <TextWidget
        text={`${pct}% today`}
        style={{ fontSize: 9, color: '#00E676' }}
      />
    </FlexWidget>
  );
}

// 4×2 wide widget
export function StreakWidget4x2({ streak, dailyPct, sprintDay, sprintTotal }: StreakWidgetProps) {
  const pct = Math.round(dailyPct * 100);
  const sprintLabel = `Sprint · Day ${sprintDay} of ${sprintTotal}`;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111111',
        borderRadius: 20,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      {/* Left: circle badge */}
      <FlexWidget
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: '#00E676',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <TextWidget
          text="🔥"
          style={{ fontSize: 20, color: '#000000' }}
        />
        <TextWidget
          text={String(streak)}
          style={{ fontSize: 26, color: '#000000', fontWeight: 'bold' }}
        />
      </FlexWidget>

      {/* Right: text info */}
      <FlexWidget
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 16,
        }}
      >
        <TextWidget
          text="GRIT"
          style={{ fontSize: 10, color: '#00E676', fontWeight: 'bold' }}
        />
        <TextWidget
          text={`${streak} Day Streak`}
          style={{ fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }}
        />
        <TextWidget
          text={sprintLabel}
          style={{ fontSize: 11, color: '#7A7A7A' }}
        />
        <TextWidget
          text={`${pct}% done today`}
          style={{ fontSize: 11, color: '#00E676' }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
