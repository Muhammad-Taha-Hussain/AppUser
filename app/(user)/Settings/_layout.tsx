import { Stack } from 'expo-router';

export default function SettingScreenStack() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="PersonalInfoScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AppSettingScreen" options={{ headerShown: false }} />
    </Stack>
  );
}