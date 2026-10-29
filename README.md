# expo-router Tabs: first visit to a lazy tab skips its enter animation

Reproduction, regression tests and fix check for
[expo/expo#52415](https://github.com/expo/expo/issues/52415). With `<Tabs screenOptions={{ animation: 'fade' }}>`
the first switch to a tab that has not been visited yet fades the old screen out, but the new screen
appears instantly. Every later switch fades both ways. `animation: 'shift'` is affected the same way,
and so are Android, iOS and web, since the code is shared JavaScript.

## Result

Two Jest suites, run against the published `expo-router` 58.0.28 build and against the fixed hook
(`fix/useAnimatedHashMap.js`, the build output of the PR's change):

| Test | Published 58.0.28 | With the fix |
|---|---|---|
| lazy tab: incoming route is a new key, its value starts at 1 (fade-in start) | fails, starts at 0 | passes |
| `lazy: false` control: route keeps its key, starts at 1 | passes | passes |
| hook: placeholder replaced by the focused real route starts beside the previous route | fails, 0 | passes |
| hook: new focused route left of the previous one starts at -1 | fails, 0 | passes |
| hook: first render, unchanged keys, kept values, previous route gone (4 tests) | pass | pass |

Full output: [media/jest-before.txt](media/jest-before.txt), [media/jest-after-with-fix.txt](media/jest-after-with-fix.txt).

## Cause

- An unvisited lazy tab is a placeholder route keyed by its route name (`settings`), added by
  `appendMissingPlaceholderTabRoutes` since expo/expo#48618.
- The first visit replaces it with the real route under a generated key (`settings:0-0-1`).
- `useAnimatedHashMap` in `react-navigation/bottom-tabs/utils` creates an `Animated.Value` for every
  key it has not seen, starting at `0` when that route is the focused index. The real route is already
  focused, so it starts at `0`.
- `BottomTabView` then animates the focused route to `0`. It is already there, so no enter animation
  runs. The placeholder's value, which waited at `1`, is dropped at that moment.

## Fix

The hook remembers which route was focused on its previous run. A route that is new and focused at
once now starts beside the previously focused route (`1` if it is to the right, `-1` if to the left),
so the enter animation has somewhere to come from. Routes that keep their key keep their value, and
a new focused route whose predecessor is gone still starts at `0`, as before. That covers the lazy
placeholder swap and a tab that is added and focused at the same time.

## Run it

```sh
npm install
npm test                      # 3 of 8 fail on the published build
scripts/apply-fix.sh          # swap in the fixed hook
npm test                      # 8 of 8 pass
scripts/apply-fix.sh undo     # back to the published build
```

To see it on a device or in a browser: `npx expo start`, open the app, tap **Settings**. Before the
fix, Settings pops in without a fade on the first tap only.

## The tests

- `__tests__/first-visit-fade.test.tsx` renders the two-tab layout through `expo-router/testing-library`,
  wraps the real `useAnimatedHashMap` to record every route's starting value, and navigates to
  `/settings` for the first time. It asserts the placeholder was keyed by name, the real route got a
  new key, and the new value starts at `1`. A `lazy: false` control shows the expected start value.
- `__tests__/useAnimatedHashMap.unit.test.tsx` is the unit test the PR adds upstream, pointed at the
  installed build: first render positions, unchanged keys return the same map, the placeholder swap,
  a new focused route to the left, kept values, and a focused route whose predecessor is gone.

The second visit is not asserted: the tabs animate with the native driver, which Jest mocks, so an
existing value never moves in this environment.
