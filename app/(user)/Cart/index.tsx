// import React, { useState } from "react";
// import { View, Text, ScrollView, TouchableOpacity } from "react-native";
// import CartItem from "../../../components/CartComponent/CartItem";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { FontAwesome } from "@expo/vector-icons";

// const CartScreen = () => {
//   const [EmptyCart, setEmptyCart] = useState(false);
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       name: "Pizza With Meat",
//       price: 12230,
//       quantity: 1,
//       image: require("../../../assets/images/pizza.jpg"),
//     },
//     {
//       id: 2,
//       name: "Ordinary Pizza",
//       price: 12230,
//       quantity: 1,
//       image: require("../../../assets/images/pizza.jpg"),
//     },
//     {
//       id: 3,
//       name: "Special Pizza",
//       price: 12230,
//       quantity: 1,
//       image: require("../../../assets/images/pizza.jpg"),
//     },
//     {
//       id: 4,
//       name: "Special Pizza",
//       price: 12230,
//       quantity: 1,
//       image: require("../../../assets/images/pizza.jpg"),
//     },
//   ]);

//   const updateQuantity = (id, increment = true) => {
//     setItems(
//       items.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: Math.max(1, item.quantity + (increment ? 1 : -1)),
//             }
//           : item
//       )
//     );
//   };

//   const subtotal = items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
//   const discount = 10900;
//   const total = subtotal - discount;

//   return (
//     <SafeAreaView className="flex-1 bg-white px-6 pt-8">
//       {/* Header */}
//       <View className="flex-row items-center justify-start mb-4">
//         <Text className="flex-1 items-center text-center font-bold text-2xl">
//           My Cart
//         </Text>
//       </View>
//       {!EmptyCart ? (
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <ScrollView showsVerticalScrollIndicator={false} className="h-80">
//             {items.map((item) => (
//               <CartItem
//                 key={item.id}
//                 name={item.name}
//                 price={item.price}
//                 quantity={item.quantity}
//                 image={item.image}
//                 onIncrement={() => updateQuantity(item.id, true)}
//                 onDecrement={() => updateQuantity(item.id, false)}
//               />
//             ))}
//           </ScrollView>

//           {/* Payment Summary */}
//           <View className="bg-white p-4 rounded-lg shadow-md mt-4">
//             <Text className="text-lg font-semibold">Payment Summary</Text>
//             <View className="flex-row justify-between mt-2">
//               <Text>Total Items ({items.length})</Text>
//               <Text className="font-bold">${subtotal}</Text>
//             </View>
//             <View className="flex-row justify-between mt-1">
//               <Text>Delivery Fee</Text>
//               <Text className="text-green-500">Free</Text>
//             </View>
//             <View className="flex-row justify-between mt-1">
//               <Text>Discount</Text>
//               <Text className="text-red-500">-${discount}</Text>
//             </View>
//             <View className="flex-row justify-between mt-3 border-t pt-2">
//               <Text className="text-xl font-bold">Total</Text>
//               <Text className="text-xl font-bold">${total}</Text>
//             </View>
//           </View>

//           <TouchableOpacity className="bg-green-500 p-4 rounded-lg mt-4">
//             <Text className="text-center text-white font-bold text-lg">
//               Order Now
//             </Text>
//           </TouchableOpacity>

//           <ScrollView showsVerticalScrollIndicator={false} className="h-80">
//             {items.map((item) => (
//               <CartItem
//                 key={item.id}
//                 name={item.name}
//                 price={item.price}
//                 quantity={item.quantity}
//                 image={item.image}
//                 onIncrement={() => updateQuantity(item.id, true)}
//                 onDecrement={() => updateQuantity(item.id, false)}
//               />
//             ))}
//           </ScrollView>

//           {/* Payment Summary */}
//           <View className="bg-white p-4 rounded-lg shadow-md mt-4">
//             <Text className="text-lg font-semibold">Payment Summary</Text>
//             <View className="flex-row justify-between mt-2">
//               <Text>Total Items ({items.length})</Text>
//               <Text className="font-bold">${subtotal}</Text>
//             </View>
//             <View className="flex-row justify-between mt-1">
//               <Text>Delivery Fee</Text>
//               <Text className="text-green-500">Free</Text>
//             </View>
//             <View className="flex-row justify-between mt-1">
//               <Text>Discount</Text>
//               <Text className="text-red-500">-${discount}</Text>
//             </View>
//             <View className="flex-row justify-between mt-3 border-t pt-2">
//               <Text className="text-xl font-bold">Total</Text>
//               <Text className="text-xl font-bold">${total}</Text>
//             </View>
//           </View>

//           <TouchableOpacity className="bg-green-500 p-4 rounded-lg mt-4">
//             <Text className="text-center text-white font-bold text-lg">
//               Order Now
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       ) : (
//         <View className="flex-1 flex-col items-center justify-center">
//           {/* Header */}

//           {/* Search Icon */}
//           <View className="w-40 h-40 bg-orange-100 rounded-full items-center justify-end">
//             <View className="flex-row w-24 h-24 bg-orange-500 rounded-full items-center justify-center">
//               <FontAwesome name="search" size={40} color="#fff" />
//             </View>
//           </View>

//           {/* Message */}
//           <Text className="text-xl font-semibold mt-6">Ouch! Hungry</Text>
//           <Text className="text-gray-500 text-center mt-2">
//             Seems like you have not ordered any food yet
//           </Text>

//           {/* Find Foods Button */}
//           <TouchableOpacity className="bg-green-600 px-6 py-3 rounded-full mt-6">
//             <Text className="text-white text-lg font-semibold">Find Foods</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default CartScreen;

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import CartItem from "../../../components/CartComponent/CartItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase"; // Replace with your Supabase client import
import { useAuth } from "@/providers/AuthProviders";
import { router } from "expo-router";
import { initializePaymentSheet, openPaymentSheet } from "@/lib/stripe";
import { useCart } from "@/providers/CartProvider";

const CartScreen = () => {
  const { profile } = useAuth();
  // const [carts, setCarts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const { loading, carts, fetchCarts } = useCart();

  // const fetchCarts = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("carts")
  //       .select("*, cartitems(*, restaurantitems(*)), restaurants(*)")
  //       .eq("customerid", profile.customerid);

  //     if (error) throw error;

  //     // Log fetched data for debugging
  //     console.log("Fetched Cart Data:", data);

  //     setCarts(data || []);
  //   } catch (error) {
  //     console.error("Error fetching carts:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const checkout = async (totalamount: number) => {
    try {
      await initializePaymentSheet(Math.floor(totalamount * 100));
      const payed = await openPaymentSheet();
      if (!payed) {
        return;
      }

      // insertOrder(
      //   { total },
      //   {
      //     onSuccess: saveOrderItems,
      //   }
      // );
      console.log("Payment successful! Proceeding with order creation...");

      // Uncomment and implement insertOrder
      // insertOrder({ total: totalAmount }, { onSuccess: saveOrderItems });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  useEffect(() => {
    fetchCarts();
    // (async () => {
    //   try {
    //     const data = await fetchCarts();
    //     console.log(data)
    //     setCarts(data);
    //   } catch (error) {
    //     console.error("Error fetching carts:", error);
    //   }
    // })();
  }, [fetchCarts]);

  console.log('Fetch CArt DATA ALl', carts)

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-8">
      <View className="flex-row items-center justify-start mb-4">
        <Text className="flex-1 text-center font-bold text-2xl">My Carts</Text>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">Loading your carts...</Text>
        </View>
      ) : carts.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {carts.map((cart) => {
            const { restaurants, cartitems } = cart;

            // Calculate subtotal for cart items
            const subtotal = cartitems?.reduce(
              (acc, item) => acc + item.quantity * (item.items?.baseprice || 0),
              0
            );

            console.log("cart items here", cartitems);

            const discount = 10; // Example static discount
            const total = subtotal - discount;

            return (
              <View key={cart.cartid} className="mb-6">
                <Text className="text-xl font-bold mb-2">
                  {restaurants?.restaurantname || "Unknown Restaurant"}
                </Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="mb-4"
                >
                  {cartitems.map((item) => (
                    <CartItem
                      key={item.cartitemid}
                      name={item.restaurantitems?.itemname || "Unknown Item"}
                      price={item.restaurantitems?.baseprice || 0}
                      quantity={item.quantity}
                      image={item.items?.image_url || ""}
                      onIncrement={() => {}}
                      onDecrement={() => {}}
                    />
                  ))}
                </ScrollView>
                <View className="bg-white p-4 rounded-lg shadow-md">
                  <Text className="text-lg font-semibold">Payment Summary</Text>
                  <View className="flex-row justify-between mt-2">
                    <Text>Total Items ({cartitems.length})</Text>
                    <Text className="font-bold">
                      ${cart.totalamount.toFixed(2)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mt-1">
                    <Text>Delivery Fee</Text>
                    <Text className="text-green-500">Free</Text>
                  </View>
                  <View className="flex-row justify-between mt-1">
                    <Text>Discount</Text>
                    <Text className="text-red-500">
                      -${discount.toFixed(2)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mt-3 border-t pt-2">
                    <Text className="text-xl font-bold">Total</Text>
                    <Text className="text-xl font-bold">
                      ${cart.totalamount.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="bg-green-500 p-4 rounded-lg mt-4"
                  onPress={() => checkout(cart.totalamount.toFixed(2))}
                >
                  <Text className="text-center text-white font-bold text-lg">
                    Order Now
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <View className="w-40 h-40 bg-orange-100 rounded-full items-center justify-end">
            <View className="flex-row w-24 h-24 bg-orange-500 rounded-full items-center justify-center">
              <FontAwesome name="search" size={40} color="#fff" />
            </View>
          </View>
          <Text className="text-xl font-semibold mt-6">Ouch! Hungry</Text>
          <Text className="text-gray-500 text-center mt-2">
            Seems like you have not ordered any food yet
          </Text>
          <TouchableOpacity
            className="bg-green-600 px-6 py-3 rounded-full mt-6"
            onPress={() => router.push("/(user)/index")}
          >
            <Text className="text-white text-lg font-semibold">Find Foods</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
