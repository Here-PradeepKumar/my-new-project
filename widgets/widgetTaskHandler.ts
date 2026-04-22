import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { StreakWidget2x2, StreakWidget4x2 } from './StreakWidget';

// Keys must match what the main app writes to AsyncStorage
const STORAGE_KEYS = {
  streak: '@grit/streak',
  dailyPct: '@grit/dailyPct',
  sprintDay: '@grit/sprintDay',
  sprintTotal: '@grit/sprintTotal',
};

async function loadWidgetData() {
  try {
    const [streak, dailyPct, sprintDay, sprintTotal] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.streak),
      AsyncStorage.getItem(STORAGE_KEYS.dailyPct),
      AsyncStorage.getItem(STORAGE_KEYS.sprintDay),
      AsyncStorage.getItem(STORAGE_KEYS.sprintTotal),
    ]);
    return {
      streak: streak != null ? parseInt(streak, 10) : 0,
      dailyPct: dailyPct != null ? parseFloat(dailyPct) : 0,
      sprintDay: sprintDay != null ? parseInt(sprintDay, 10) : 1,
      sprintTotal: sprintTotal != null ? parseInt(sprintTotal, 10) : 14,
    };
  } catch {
    return { streak: 0, dailyPct: 0, sprintDay: 1, sprintTotal: 14 };
  }
}

// Determine which widget layout to render based on widget size
function chooseLayout(
  widgetWidth: number,
  data: { streak: number; dailyPct: number; sprintDay: number; sprintTotal: number }
) {
  if (widgetWidth >= 250) {
    return React.createElement(StreakWidget4x2, data);
  }
  return React.createElement(StreakWidget2x2, data);
}

export default async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, widgetInfo, renderWidget } = props;

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const data = await loadWidgetData();
      renderWidget(chooseLayout(widgetInfo.width, data));
      break;
    }

    case 'WIDGET_DELETED':
      // Nothing to clean up for now
      break;

    default:
      break;
  }
}
