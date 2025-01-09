import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline"; // Install heroicons package
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from 'expo-router';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProviders";

const RegisterScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Toggle state for visibility

  async function signUpWithEmail() {
    // setLoading(true);
    // try {
    //   const { data, error } = await supabase.auth.signUp({
    //     email: "fa21-bcs-122@cuilahore.edu.pk",
    //     password: "securepassword",
    //   });
      
    //   if (error) {
    //     console.error("Sign Up Error:", error);
    //   } else {
    //     console.log("Sign Up Successful:", data);
    //   }
    //         Alert.alert('Success', 'Please check your email for confirmation!');
    //   router.replace('/(auth)');
    // } catch (error) {
    //   Alert.alert('Sign Up failed', error.message);
    // }
    // setLoading(false);
    signUp(email, password, userName)
  }

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-12">
      {/* Heading Text Register */}
      <Text className="text-4xl font-bold text-gray-800 mb-2 w-72">
        Create your new account
      </Text>
      <Text className="text-base text-gray-500 mb-8">
        Create an account to start looking for the food you like
      </Text>

      {/* PhoneNo or Email */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Email / Phone No
        </Text>
        <TextInput
          className="flex-row items-center border border-gray-300 rounded-lg p-3 text-gray-800 text-lg"
          placeholder="Enter email or phone number"
          keyboardType="email-address"
          autoCapitalize={"none"}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        {/* <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        /> */}
      </View>

      {/* User Name */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          UserName
        </Text>
        <TextInput
          className="flex-row items-center border border-gray-300 rounded-lg p-3 text-gray-800 text-lg"
          placeholder="User Name"
          keyboardType="email-address"
          onChangeText={(text) => setuserName(text)}
          value={userName}
          autoCapitalize={"none"}
        />
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Password
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
          {/* Password Input */}
          <TextInput
            className="flex-1 py-3 text-lg"
            placeholder="Enter your password"
            secureTextEntry={!isPasswordVisible} // Mask password
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize={"none"}
          />

          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? "eye-off" : "eye"} // Toggle icon
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Term of Service Password */}
      <TouchableOpacity>
        <Text className="text-center text-green-600 text-sm mb-6">
          I agree with Terms of Service and Privacy Policy
        </Text>
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity
        className="bg-green-500 rounded-full py-3"
        onPress={() => signUpWithEmail()}
      >
        <Text className="text-center text-white font-bold text-lg">
          Register
        </Text>
      </TouchableOpacity>

      {/* Have an account */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-sm text-gray-500">Have an account? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-sm text-green-600 font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
