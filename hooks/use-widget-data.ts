import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';

const KEYS = {
  streak: '@grit/streak',
  dailyPct: '@grit/dailyPct',
  sprintDay: '@grit/sprintDay',
  sprintTotal: '@grit/sprintTotal',
};

type WidgetData = {
  streak: number;
  dailyPct: number;
  sprintDay: number;
  sprintTotal: number;
};

// Call this from the Today screen whenever data changes.
// It saves to AsyncStorage and tells Android to refresh the widget.
export async function syncWidgetData(data: WidgetData) {
  await Promise.all([
    AsyncStorage.setItem(KEYS.streak, String(data.streak)),
    AsyncStorage.setItem(KEYS.dailyPct, String(data.dailyPct)),
    AsyncStorage.setItem(KEYS.sprintDay, String(data.sprintDay)),
    AsyncStorage.setItem(KEYS.sprintTotal, String(data.sprintTotal)),
  ]);
  requestWidgetUpdate({ widgetName: 'StreakWidget', renderWidget: () => null });
}

// Hook: syncs widget data on mount and whenever values change
export function useWidgetSync(data: WidgetData) {
  useEffect(() => {
    syncWidgetData(data);
  }, [data.streak, data.dailyPct, data.sprintDay, data.sprintTotal]);
}
