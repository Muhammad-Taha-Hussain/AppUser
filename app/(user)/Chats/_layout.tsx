import { Stack } from 'expo-router';

export default function ChatScreenStack() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
      {/* <Stack.Screen name="AppSettingScreen" options={{ headerShown: false }} /> */}
    </Stack>
  );
}