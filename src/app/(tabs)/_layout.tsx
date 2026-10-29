import { Tabs } from 'expo-router';

// expo/expo#52415: the first switch to `settings` shows it instantly (only `index` fades out).
// Every later switch fades both ways. `lazy: false` avoids it, at the cost of mounting every tab.
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ animation: 'fade' }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
