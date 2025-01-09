import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { StarIcon } from "react-native-heroicons/solid";

const recentOrders = [
  {
    id: 1,
    name: "Ordinary Burgers",
    image: "https://via.placeholder.com/50",
    restaurant: "Burger Restaurant",
    rating: 4.9,
    distance: "190m",
  },
  {
    id: 2,
    name: "Ordinary Burgers",
    image: "https://via.placeholder.com/50",
    restaurant: "Burger Restaurant",
    rating: 4.9,
    distance: "190m",
  },
  {
    id: 3,
    name: "Ordinary Burgers",
    image: "https://via.placeholder.com/50",
    restaurant: "Burger Restaurant",
    rating: 4.9,
    distance: "190m",
  },
];

export default function RecentOrders() {
  return (
    <View className="mt-6">
      {/* Heading */}
      <Text className="font-bold text-2xl">My Recent Orders</Text>
      {/* List of Recent Orders */}
      <FlatList
        data={recentOrders}
        renderItem={({ item }) => (
          <View className="flex-row items-center">
            <Image
              source={{ uri: item.image }}
              className="w-12 h-12 rounded-full"
            />
            <View className="flex-1">
              <Text className="font-bold">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.restaurant}</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <StarIcon size={16} color="gold" />
              <Text>{item.rating}</Text>
              <Text className="text-gray-500">• {item.distance}</Text>
            </View>
          </View>
        )}
        keyExtractor={(index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 10, marginVertical: 10 }}
      />
    </View>
  );
}
