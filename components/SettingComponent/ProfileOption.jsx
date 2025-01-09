import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";



const ProfileOption = ({ title, icon: Icon, onPress }) => {

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-200"
    >
      <View className="flex-row items-center">
        {/* Use width, height, and stroke for icon styling */}
        <Icon width={24} height={24} stroke="#6b7280" />
        <Text className="ml-4 text-lg">{title}</Text>
      </View>
      <ChevronRightIcon size={20} color="#a1a1a1" />
    </TouchableOpacity>
  );
};

export default ProfileOption;
