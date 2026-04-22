import { registerWidgetTaskHandler } from 'react-native-android-widget';
import widgetTaskHandler from './widgets/widgetTaskHandler';

// Register the widget task handler so Android can update the home screen widget
// even when the main app is not running.
registerWidgetTaskHandler(widgetTaskHandler);

// Load the main Expo Router app
import 'expo-router/entry';
