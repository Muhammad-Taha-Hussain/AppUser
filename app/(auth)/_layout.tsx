import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ headerShown: false }} />
      <Stack.Screen name="ForgetPassword" options={{ headerShown: false }} />
      <Stack.Screen name="EmailVerification" options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" options={{ headerShown: false }} />
    </Stack>
  );
}
