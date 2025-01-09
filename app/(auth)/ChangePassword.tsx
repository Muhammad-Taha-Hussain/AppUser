import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState(""); // State to hold password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Toggle state for visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // Toggle state for confirm password visibility

  // Validation conditions
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-12">
      {/* Header */}
        <View className="flex-row items-center justify-start mb-4">
        <Text className="flex-1 items-center text-center font-bold text-xl">Reset Password</Text>
      </View>
      {/* Heading Text Login */}
      <Text className="text-2xl font-bold text-gray-800 mb-2">Reset Password</Text>
      <Text className="text-base text-gray-500 mb-8">
        Your new password must be different from the previously used password
      </Text>

      {/* Password Reset */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          New Password
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
          {/* Password Input */}
          <TextInput
            className="flex-1 py-3 text-lg"
            placeholder="Enter your password"
            secureTextEntry={!isPasswordVisible} // Mask password
            value={password}
            onChangeText={setPassword}
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
        <Text style={{ color: isPasswordValid ? "green" : "red" }}>
          Must be at least 8 characters
        </Text>
      </View>

      {/* Password Confirm Reset */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Confirm Password
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
          {/* Confirm Password Input */}
          <TextInput
            className="flex-1 py-3 text-lg"
            placeholder="Re-enter your password"
            secureTextEntry={!isConfirmPasswordVisible} // Mask confirm password
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          >
            <Icon
              name={isConfirmPasswordVisible ? "eye-off" : "eye"} // Toggle icon
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <Text style={{ color: doPasswordsMatch ? "green" : "red" }}>
          Both passwords must match
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("(user)")}
        className="bg-green-500 rounded-full py-3"
      >
        <Text className="text-center text-white font-bold text-lg">
          Verify Account
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
