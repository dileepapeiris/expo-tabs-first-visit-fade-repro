import { renderHook } from '@testing-library/react-native';
// The same unit test as the PR adds upstream, pointed at the installed build.
import { useAnimatedHashMap } from 'expo-router/build/react-navigation/bottom-tabs/utils/useAnimatedHashMap';

function state(keys: string[], index: number): any {
  return { index, routes: keys.map((key) => ({ key, name: key.split(':')[0] })) };
}
function values(map: any) {
  return Object.fromEntries(Object.entries(map).map(([key, value]: [string, any]) => [key, value.__getValue()]));
}

describe('useAnimatedHashMap', () => {
  it('starts the focused route at 0 and the others at their side', async () => {
    const { result } = await renderHook(useAnimatedHashMap, { initialProps: state(['a:1', 'b:1', 'c:1'], 1) });
    expect(values(result.current)).toEqual({ 'a:1': -1, 'b:1': 0, 'c:1': 1 });
  });
  it('returns the same map while the route keys do not change', async () => {
    const { result, rerender } = await renderHook(useAnimatedHashMap, { initialProps: state(['a:1', 'b:1'], 0) });
    const first = result.current;
    await rerender(state(['a:1', 'b:1'], 1));
    expect(result.current).toBe(first);
  });
  it('starts a route that replaces a lazy placeholder and is focused at once beside the previous route', async () => {
    const { result, rerender } = await renderHook(useAnimatedHashMap, { initialProps: state(['index:1', 'settings'], 0) });
    expect(values(result.current)).toEqual({ 'index:1': 0, settings: 1 });
    await rerender(state(['index:1', 'settings:1'], 1));
    expect(values(result.current)['settings:1']).toBe(1);
  });
  it('starts a new focused route to the left of the previous route at -1', async () => {
    const { result, rerender } = await renderHook(useAnimatedHashMap, { initialProps: state(['home', 'profile:1'], 1) });
    await rerender(state(['home:1', 'profile:1'], 0));
    expect(values(result.current)['home:1']).toBe(-1);
  });
  it('keeps the values of routes that are still present', async () => {
    const { result, rerender } = await renderHook(useAnimatedHashMap, { initialProps: state(['index:1', 'settings'], 0) });
    const indexValue = result.current['index:1'];
    await rerender(state(['index:1', 'settings:1'], 1));
    expect(result.current['index:1']).toBe(indexValue);
  });
  it('starts a new focused route at 0 when the previous focused route is gone', async () => {
    const { result, rerender } = await renderHook(useAnimatedHashMap, { initialProps: state(['a:1', 'b:1'], 0) });
    await rerender(state(['c:1', 'b:1'], 0));
    expect(values(result.current)['c:1']).toBe(0);
  });
});
