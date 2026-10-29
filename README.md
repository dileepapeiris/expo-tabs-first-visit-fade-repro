# expo-router Tabs: first visit to a lazy tab skips its enter animation

Reproduction, regression tests and fix check for
[expo/expo#52415](https://github.com/expo/expo/issues/52415). With `<Tabs screenOptions={{ animation: 'fade' }}>`
the first switch to a tab that has not been visited yet fades the old screen out, but the new screen
appears instantly. Every later switch fades both ways. `animation: 'shift'` is affected the same way,
and so are Android, iOS and web, since the code is shared JavaScript.
