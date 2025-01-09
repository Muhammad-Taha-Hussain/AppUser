import React from "react";
import { View, Text, Image } from "react-native";

const ProfileHeader = ({ name, email, imageUrl }) => {
  return (
    <View className="items-center mt-8 mb-4">
      <View className="relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-20 h-20 rounded-full"
          alt="Profile Image"
        />
        <View className="absolute bottom-0 right-0 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
          <Text className="text-white text-xs font-bold">🔒</Text>
        </View>
      </View>
      <Text className="text-xl font-semibold mt-2">{name}</Text>
      <Text className="text-gray-500">{email}</Text>
    </View>
  );
};

export default ProfileHeader;
