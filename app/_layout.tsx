import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProviders";
import { useEffect, useState } from "react";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import "../global.css";
import QueryProvider from "@/providers/QueryProvider";
import CartProvider from "@/providers/CartProvider";
import { ActivityIndicator, View } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import {AuthProvider} from '@/providers/AuthProviders'

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
     </AuthProvider>
  );
}

// // async function RootLayoutNav() {
// //   const colorScheme = useColorScheme();
// //   const { profile, loading } = await useAuth();

// //   console.log("profile is", profile);

// //   if (loading) {
// //     return (
// //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
// //         <ActivityIndicator size="large" color="#007BFF" />
// //       </View>
// //     );
// //   }
// //   if(profile) {
// //     return (
// //       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
// //         <CartProvider>
// //           <QueryProvider>
// //             <Stack screenOptions={{ headerShown: false }}>
// //                 <Stack.Screen name="(user)" options={{ path: "(user)" }} />
// //             </Stack>
// //           </QueryProvider>
// //         </CartProvider>
// //       </ThemeProvider>
// //     );
// //   } else {
// //     return (
// //       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
// //             <Stack screenOptions={{ headerShown: false }}>
// //                 <Stack.Screen name="(auth)" options={{ path: "(auth)" }} />
// //             </Stack>
// //       </ThemeProvider>
// //     );
// //   }

  
// // }

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { profile, loading } = useAuth();

  console.log("profile is", profile);

  // Show loading screen until the profile loading state resolves
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }
  console.log('stripe key', process.env.STRIPE_PUBLISHABLE_KEY);

  // Conditional rendering based on profile availability
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StripeProvider
        publishableKey={process.env.STRIPE_PUBLISHABLE_KEY!}
      >
      <QueryProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {profile ? (
              <Stack.Screen name="(user)" />
            ) : (
              <Stack.Screen name="(auth)" />
            )}
          </Stack>
        </CartProvider>
      </QueryProvider>
      </StripeProvider>
    </ThemeProvider>
  );
}



// // export default 
// function RootLayoutNav() {
//   const colorScheme = useColorScheme();
//   const { profile, loading } = useAuth();
//   const [isMounted, setIsMounted] = useState(false);

//   // Ensure the component is mounted before rendering
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   console.log("profile", profile);

//   if (!isMounted) {
//     // Render nothing until mounted
//     return null;
//   }

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#007BFF" />
//       </View>
//     );
//   }

//   // if (!profile) {
//   //   console.warn("Profile is null. Redirecting to auth...");
//   //   return <Redirect href="(auth)" />;
//   // }

//   console.log("stripe key", process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <StripeProvider publishableKey={process.env.STRIPE_PUBLISHABLE_KEY!}>
//         <QueryProvider>
//           <CartProvider>
//             <Stack screenOptions={{ headerShown: false }}>
//               <Redirect href="(user)" />
//             </Stack>
//           </CartProvider>
//         </QueryProvider>
//       </StripeProvider>
//     </ThemeProvider>
//   );
// }