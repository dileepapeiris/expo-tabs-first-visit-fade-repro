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
