import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function MenuStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
        // headerRight: () => (
        //   <Link href="/(user)/Cart" asChild>
        //     <Pressable>
        //       {({ pressed }) => (
        //         <FontAwesome
        //           name="shopping-cart"
        //           size={25}
        //           color={Colors.light.tint}
        //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        //         />
        //       )}
        //     </Pressable>
        //   </Link>
        // ),
      }}
    >
      <Stack.Screen name="Home" options={{ title: 'Menu' }} />
       <Stack.Screen name="Menu" options={{ headerShown: false }} />
       <Stack.Screen name="Orders" options={{ headerShown: false }} />
    </Stack>
  );
}
