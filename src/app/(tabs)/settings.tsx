import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e53935' },
  label: { color: '#fff', fontSize: 32, fontWeight: '600' },
});
