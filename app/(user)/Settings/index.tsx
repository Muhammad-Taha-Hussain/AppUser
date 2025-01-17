// import React from "react";
// import { ScrollView, Text, View, TouchableOpacity } from "react-native";
// import ProfileHeader from "../../../components/SettingComponent/ProfileHeader";
// import ProfileOption from "../../../components/SettingComponent/ProfileOption";
// import {
//   UserIcon,
//   CreditCardIcon,
//   CurrencyDollarIcon,
//   QuestionMarkCircleIcon,
//   TrashIcon,
// } from "react-native-heroicons/outline";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { useAuth } from "@/providers/AuthProviders";

// const ProfileScreen = () => {
//   const router = useRouter();
//   const { profile, logout } = useAuth();
//   console.log(profile);

//   const handleOptionPress = (option) => {
//     if (option === "EditPersonalData") {
//       router.navigate("/(user)/Settings/PersonalInfoScreen");
//     } else if (option === "PaymentDetails") {
//       router.navigate("/(user)/Settings/AppSettingScreen");
//     }
//     console.log(`Pressed: ${option}`);
//   };

//   const handleSignOut = async () => {
//     await logout();
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white px-6 pt-8">
//       <View className="flex-row items-center justify-start mb-4">
//         <Text className="flex-1 text-center font-bold text-2xl">
//           Profile Settings
//         </Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} className="bg-white h-full">
//         <ProfileHeader
//           name={profile?.name || "User Name"}
//           email={profile?.email || "user@example.com"}
//           imageUrl={profile?.profileImage || "https://via.placeholder.com/150"}
//         />

//         <View className="flex-col px-4 my-4">
//           <Text className="font-light text-gray-600">Profile</Text>
//           <ProfileOption
//             title="Edit Personal Data"
//             icon={UserIcon}
//             onPress={() => handleOptionPress("EditPersonalData")}
//           />
//           <ProfileOption
//             title="Payment Details"
//             icon={CreditCardIcon}
//             onPress={() => handleOptionPress("PaymentDetails")}
//           />
//           <ProfileOption
//             title="Earnings"
//             icon={CurrencyDollarIcon}
//             onPress={() => handleOptionPress("Earnings")}
//           />
//         </View>

//         <View className="flex-col px-4 my-4">
//           <Text className="font-light text-gray-600">Support</Text>
//           <ProfileOption
//             title="Help Center"
//             icon={QuestionMarkCircleIcon}
//             onPress={() => handleOptionPress("Help Center")}
//           />
//           <ProfileOption
//             title="Request Account Deletion"
//             icon={TrashIcon}
//             onPress={() => handleOptionPress("Request Account Deletion")}
//           />
//         </View>

//         <TouchableOpacity
//           className="rounded-full bg-transparent py-3 border border-red-600 mb-2"
//           activeOpacity={0.7}
//           onPress={() => handleSignOut()}
//         >
//           <Text className="text-red-600 text-center font-light text-lg">
//             Sign out
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ProfileScreen;

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useAuth } from "@/providers/AuthProviders";
import { useRouter } from "expo-router";
import ProfileHeader from "../../../components/SettingComponent/ProfileHeader";
import ProfileOption from "../../../components/SettingComponent/ProfileOption";
import {
  UserIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
const SettingsScreen = () => {
  const { profile, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
  };

  // Handler for options
  const handleOptionPress = (option) => {
    if (option === "EditPersonalData") {
      router.push({
        pathname: "/(user)/Settings/PersonalInfoScreen",
        params: { profile: JSON.stringify(profile) }, // Pass profile as a string
      });
    } else if (option === "PaymentDetails") {
        router.push("/(user)/Settings/AppSettingScreen");
      }
      console.log(`Pressed: ${option}`);
    };

  // Render conditional buttons based on profile existence
  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-8">
      <View className="flex-row items-center justify-start mb-4">
        <Text className="flex-1 text-center font-bold text-2xl">
          Profile Settings
        </Text>
      </View>
      {profile ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="bg-white h-full"
        >
          <ProfileHeader
            name={profile?.name || "User Name"}
            email={profile?.email || "user@example.com"}
            imageUrl={
              profile?.image || "../../assets/images/profile.jpg"
            }
          />

          <View className="flex-col px-4 my-4">
            <Text className="font-light text-gray-600">Profile</Text>
            <ProfileOption
              title="Edit Personal Data"
              icon={UserIcon}
              onPress={() => handleOptionPress("EditPersonalData")}
            />
            <ProfileOption
              title="Payment Details"
              icon={CreditCardIcon}
              onPress={() => handleOptionPress("PaymentDetails")}
            />
            <ProfileOption
              title="Earnings"
              icon={CurrencyDollarIcon}
              onPress={() => handleOptionPress("Earnings")}
            />
          </View>

          <View className="flex-col px-4 my-4">
            <Text className="font-light text-gray-600">Support</Text>
            <ProfileOption
            title="Help Center"
            icon={QuestionMarkCircleIcon}
            onPress={() => handleOptionPress("Help Center")}
          />
          <ProfileOption
            title="Request Account Deletion"
            icon={TrashIcon}
            onPress={() => handleOptionPress("Request Account Deletion")}
          />
          </View>

          <TouchableOpacity
            className="rounded-full bg-transparent py-3 border border-red-600 mb-2"
            activeOpacity={0.7}
            onPress={() => handleSignOut()}
          >
            <Text className="text-red-600 text-center font-light text-lg">
              Sign out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        // Register Button
        <TouchableOpacity
          onPress={() => router.push("/(auth)/Register")}
          className="bg-purple-500 p-4 rounded"
        >
          <Text className="text-white font-bold text-center">Register</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default SettingsScreen;
