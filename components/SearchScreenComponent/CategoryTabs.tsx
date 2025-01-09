import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const categories = ["Burger", "Taco", "Drink", "Pizza"];

export default function CategoryTabs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Function to handle category selection
  const handleCategoryPress = (index: number) => {
    setSelectedIndex(index);
  };
  return (
    <View className="flex-row mt-4">
      <FlatList
        data={categories}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleCategoryPress(index)} // Handle category press
            className={`flex-1 px-4 rounded-full mx-3 h-10 items-center justify-center ${
                selectedIndex === index ? "bg-green-200" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-lg ${selectedIndex === index ? "text-green-600" : "text-gray-700"}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, marginVertical: 10 }}
      />
    </View>
  );
}
