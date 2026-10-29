import { renderHook } from '@testing-library/react-native';
// The same unit test as the PR adds upstream, pointed at the installed build.
import { useAnimatedHashMap } from 'expo-router/build/react-navigation/bottom-tabs/utils/useAnimatedHashMap';

function state(keys: string[], index: number): any {
  return { index, routes: keys.map((key) => ({ key, name: key.split(':')[0] })) };
}
function values(map: any) {
  return Object.fromEntries(Object.entries(map).map(([key, value]: [string, any]) => [key, value.__getValue()]));
}
