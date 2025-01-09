import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { defaultPizzaImage } from "../HomeComponent/RestaurantListItem";


interface CartItemProps {
    name: string;          // The name is a string
    price: number;         // The price is a number
    quantity: number;      // The quantity is a number
    image: any;         // The image URL is a string
    onIncrement: () => void;  // Function for incrementing quantity
    onDecrement: () => void;  // Function for decrementing quantity
  }

const CartItem = ({ name, price, quantity, image, onIncrement, onDecrement }: CartItemProps) => {
  return (
    <View className="flex-row items-center bg-white p-4 rounded-lg shadow-md my-2">
      <Image source={{uri: image || defaultPizzaImage}} className="w-16 h-16 rounded-md mr-4" />
      <View className="flex-1">
        <Text className="font-semibold text-lg">{name}</Text>
        <Text className="text-green-600">${price}</Text>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onDecrement} className="p-2 bg-gray-200 rounded-full">
          <Text className="text-xl">-</Text>
        </TouchableOpacity>
        <Text className="mx-2 text-lg">{quantity}</Text>
        <TouchableOpacity onPress={onIncrement} className="p-2 bg-gray-200 rounded-full">
          <Text className="text-xl">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItem;