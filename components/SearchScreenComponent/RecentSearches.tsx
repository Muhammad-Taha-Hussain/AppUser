import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

const recentSearches = ["Burgers", "Fast food", "Dessert", "French", "Pastry"];

export default function RecentSearches() {
  return (
    <View className="mt-6">
      {/* Heading */}
      <View className="flex-row justify-between items-center">
        <Text className="font-bold text-2xl">Recent Searches</Text>
        <TouchableOpacity>
          <Text className="text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
      {/* List of Searches */}
      <FlatList
        data={recentSearches}
        renderItem={({ item, index }) => (
          <View
            key={index}
            className="flex-row justify-between items-center bg-gray-100 p-2 my-1 rounded-md"
          >
            <Text>{item}</Text>
            <TouchableOpacity>
              <XMarkIcon size={18} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(index) => index.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingHorizontal: 10,
          marginVertical: 10,
          height: 150,
        }}
      />
    </View>
  );
}
