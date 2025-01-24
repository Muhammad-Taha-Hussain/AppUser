import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { defaultPizzaImage } from "../HomeComponent/DealListItem";
import RemoteImageItems from "../RemoteImages/RemoteImageItems";
import { Link, useRouter, useSegments } from "expo-router";

interface CartItemProps {
  cartItemId: number;
  name: string; // The name is a string
  basePrice: number; // The price is a number
  quantity: number; // The quantity is a number
  image: any; // The image URL is a string
  onIncrement: (cartItemId: number) => void; // Function for incrementing quantity
  onDecrement: (cartItemId: number) => void; // Function for decrementing quantity
}
// ?restaurantName=${encodeURIComponent(restaurantName)}`


const CartItem = React.memo(
  ({item, onIncrement, onDecrement}: any) => {
    const router = useRouter();
    const cartItemId=item.cartitemid
    // const key=item.cartitemid
    const name=item.restaurantitems?.itemname || "Unknown Item"
    const basePrice=item.restaurantitems?.baseprice || 0
    const quantity=item.quantity
    const image=item.restaurantitems?.itemsImage || ""

    console.log('items ye hai dekho', item);
    

    return (
      <Pressable
        onPress={() =>
          router.push(
            `/Cart/CartItems/${cartItemId}?itemname=${encodeURIComponent(
              name
            )}&itemprice=${encodeURIComponent(
              basePrice
            )}&itemquantity=${encodeURIComponent(
              quantity
            )}&itemimage=${encodeURIComponent(
              image
            )}`
          )
        }
        className="flex-row items-center bg-white p-4 rounded-lg shadow-md my-2 hover:bg-gray-100 hover:scale-105"
      >
        <RemoteImageItems
          path={image}
          fallback={defaultPizzaImage}
          className="flex-row w-12 h-12 mr-4 items-center bg-black rounded-lg shadow-lg my-2"
        />
        <View className="flex-1">
          <Text className="font-semibold text-lg">{name}</Text>
          <Text className="text-green-600">${basePrice}</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => onDecrement(cartItemId)}
            disabled={quantity <= 1}
            className="p-2 bg-gray-200 rounded-full"
          >
            <Text className="text-xl">-</Text>
          </TouchableOpacity>
          <Text className="mx-2 text-lg">{quantity}</Text>
          <TouchableOpacity
            onPress={() => onIncrement(cartItemId)}
            className="p-2 bg-gray-200 rounded-full"
          >
            <Text className="text-xl">+</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  }
);

export default CartItem;
