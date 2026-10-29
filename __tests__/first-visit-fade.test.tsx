import { Tabs } from 'expo-router';
import { act, renderRouter, screen } from 'expo-router/testing-library';
import { Text, View } from 'react-native';

// Records what every bottom-tabs animated value holds each time the real hook runs,
// so the first visit to a lazy tab shows the starting value of the incoming route.
type Snapshot = { index: number; keys: string[]; values: Record<string, number> };
const hashLog: Snapshot[] = [];
(global as any).__hashLog = hashLog;

jest.mock('expo-router/build/react-navigation/bottom-tabs/utils/useAnimatedHashMap', () => {
  const actual = jest.requireActual(
    'expo-router/build/react-navigation/bottom-tabs/utils/useAnimatedHashMap'
  );
  return {
    useAnimatedHashMap: (state: any) => {
      const map = actual.useAnimatedHashMap(state);
      (global as any).__hashLog.push({
        index: state.index,
        keys: state.routes.map((r: any) => r.key),
        values: Object.fromEntries(
          Object.entries(map).map(([k, v]: [string, any]) => [k, v.__getValue()])
        ),
      });
      return map;
    },
  };
});
