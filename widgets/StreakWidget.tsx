import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

type StreakWidgetProps = {
  streak: number;
  dailyPct: number;
  sprintDay: number;
  sprintTotal: number;
};

// Outer ring = accent green circle; inner circle = dark background.
// This produces a circular ring effect using nested FlexWidgets.
function CircleRing({ streak }: { streak: number }) {
  return (
    <FlexWidget
      style={{
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#00E676',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FlexWidget
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: '#111111',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <TextWidget
          text="🔥"
          style={{ fontSize: 18, marginBottom: 0 }}
        />
        <TextWidget
          text={String(streak)}
          style={{
            fontSize: 26,
            color: '#F2F2F2',
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

// 2×2 compact widget
export function StreakWidget2x2({ streak, dailyPct, sprintDay, sprintTotal }: StreakWidgetProps) {
  const pctLabel = `${Math.round(dailyPct * 100)}% today`;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0F0F0F',
        borderRadius: 16,
        padding: 12,
      }}
    >
      {/* Top label */}
      <TextWidget
        text="GRIT"
        style={{
          fontSize: 11,
          color: '#00E676',
          fontWeight: 'bold',
          letterSpacing: 2,
        }}
      />

      {/* Ring with streak */}
      <CircleRing streak={streak} />

      {/* Bottom label */}
      <TextWidget
        text="DAY STREAK"
        style={{ fontSize: 9, color: '#7A7A7A', letterSpacing: 1 }}
      />
    </FlexWidget>
  );
}

// 4×2 wide widget — ring on left, stats on right
export function StreakWidget4x2({ streak, dailyPct, sprintDay, sprintTotal }: StreakWidgetProps) {
  const pctLabel = `${Math.round(dailyPct * 100)}% done today`;
  const sprintLabel = `Day ${sprintDay} of ${sprintTotal}`;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F0F',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 14,
      }}
    >
      {/* Left: ring */}
      <CircleRing streak={streak} />

      {/* Right: stats */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          marginLeft: 18,
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <TextWidget
          text="GRIT"
          style={{
            fontSize: 11,
            color: '#00E676',
            fontWeight: 'bold',
            letterSpacing: 2,
            marginBottom: 4,
          }}
        />
        <TextWidget
          text={`${streak} Day Streak 🔥`}
          style={{
            fontSize: 18,
            color: '#F2F2F2',
            fontWeight: 'bold',
          }}
        />
        <TextWidget
          text={sprintLabel}
          style={{ fontSize: 12, color: '#7A7A7A', marginTop: 4 }}
        />
        <TextWidget
          text={pctLabel}
          style={{ fontSize: 12, color: '#00E676', marginTop: 2 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
