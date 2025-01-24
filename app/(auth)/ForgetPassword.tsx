import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline"; // Install heroicons package
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ArrowLeftIcon, HeartIcon } from "react-native-heroicons/outline";
import { useAuth } from "@/providers/AuthProviders";

const ResetPassword = () => {
  const navigation = useNavigation();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState(""); // State to capture email input
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email);
      navigation.navigate("EmailVerification", { email });
    } catch (err) {
      setError("Failed to send verification code. Check your input.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-12">
      {/* Header */}
      <View className="flex-row items-center justify-start mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 bg-slate-300 rounded-full"
        >
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>

        {/* Heading Text Login */}
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Forgot Password?
        </Text>
      </View>
      <Text className="text-base text-gray-500 mb-8">
        Enter your valid email address and we'll send you confirmation code to
        reset your password
      </Text>

      {/* Email address / Phone no */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Email Address / Phone No
        </Text>
        <TextInput
          className="flex-row items-center border border-gray-300 rounded-lg p-3 text-gray-800 text-lg"
          placeholder="Enter your email or phone number"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
      </View>

      {/* Button */}
      <TouchableOpacity
        className="bg-green-500 rounded-full py-3"
        onPress={handleForgotPassword}
      >
        <Text className="text-center text-white font-bold text-lg">
          Continue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResetPassword;
