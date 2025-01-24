import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import RemoteImageItems from "@/components/RemoteImages/RemoteImageItems";
import { defaultPizzaImage } from "@/components/HomeComponent/DealListItem";

const CartItemsScreen = () => {
  const { itemname, itemprice, itemimage, itemquantity } = useLocalSearchParams();
  console.log("restaurantName", itemimage);

  return (
    <ScrollView className="bg-gray-100 flex-1 p-4">
      <Stack.Screen options={{ title: itemname }} />

      <RemoteImageItems
          path={itemimage}
          fallback={defaultPizzaImage}
          className="flex-row w-24 h-24 mr-4 items-center bg-black rounded-lg shadow-lg my-2"
        />

      {/* Item Details */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">{itemname}</Text>
        <Text className="text-sm text-gray-600 mt-2">Quantity {itemquantity}</Text>
        <Text className="text-xl font-semibold text-green-600 mt-4">
          ${itemprice}
        </Text>
      </View>
    </ScrollView>
  );
};

export default CartItemsScreen;
