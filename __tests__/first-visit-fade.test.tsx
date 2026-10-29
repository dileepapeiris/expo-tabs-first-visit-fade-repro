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

function routes(lazy: boolean) {
  return {
    '(tabs)/_layout': () => (
      <Tabs screenOptions={{ animation: 'fade', lazy }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      </Tabs>
    ),
    '(tabs)/index': () => (
      <View testID="home">
        <Text>Home</Text>
      </View>
    ),
    '(tabs)/settings': () => (
      <View testID="settings">
        <Text>Settings</Text>
      </View>
    ),
  };
}

async function firstVisitStartValue(lazy: boolean) {
  hashLog.length = 0;
  const { getPathname } = await renderRouter(routes(lazy), { initialUrl: '/' });
  expect(getPathname()).toBe('/');
  expect(screen.getByTestId('home')).toBeTruthy();
  const beforeNav = hashLog.at(-1)!;

  const { router } = require('expo-router');
  await act(async () => {
    router.navigate('/settings');
  });
  expect(getPathname()).toBe('/settings');
  expect(screen.getByTestId('settings')).toBeTruthy();

  const afterNav = hashLog.at(-1)!;
  const settingsKey = afterNav.keys[afterNav.index];
  return { beforeNav, afterNav, settingsKey, start: afterNav.values[settingsKey] };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('lazy tab: the incoming route is a new key and its value starts at 1 (fade-in start)', async () => {
  const { beforeNav, afterNav, settingsKey, start } = await firstVisitStartValue(true);
  // The unvisited tab is a placeholder keyed by its name; the real route gets a generated key.
  expect(beforeNav.keys).toContain('settings');
  expect(settingsKey).not.toBe('settings');
  console.log('lazy: keys before', beforeNav.keys, 'after', afterNav.keys, 'start value', start);
  expect(start).toBe(1);
});

test('lazy: false (control): the incoming route keeps its key and starts at 1', async () => {
  const { beforeNav, afterNav, settingsKey, start } = await firstVisitStartValue(false);
  expect(beforeNav.keys).toEqual(afterNav.keys);
  console.log('lazy:false: keys', afterNav.keys, 'settings key', settingsKey, 'start value', start);
  expect(start).toBe(1);
});

// Not tested here: the second visit. BottomTabView animates with the native driver, which the
// Jest environment mocks, so an existing value never moves and its later start cannot be read.
