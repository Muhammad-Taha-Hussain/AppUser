// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import CartItem from "../../../components/CartComponent/CartItem";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { FontAwesome } from "@expo/vector-icons";
// import { supabase } from "../../../lib/supabase"; // Replace with your Supabase client import
// import { useAuth } from "@/providers/AuthProviders";
// import { router } from "expo-router";
// import { initializePaymentSheet, openPaymentSheet } from "@/lib/stripe";
// import { useCart } from "@/providers/CartProvider";

// const CartScreen = () => {
//   const { profile } = useAuth();
//   // const [carts, setCarts] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   const { loading, carts, fetchCarts } = useCart();

//   // const fetchCarts = async () => {
//   //   try {
//   //     const { data, error } = await supabase
//   //       .from("carts")
//   //       .select("*, cartitems(*, restaurantitems(*)), restaurants(*)")
//   //       .eq("customerid", profile.customerid);

//   //     if (error) throw error;

//   //     // Log fetched data for debugging
//   //     console.log("Fetched Cart Data:", data);

//   //     setCarts(data || []);
//   //   } catch (error) {
//   //     console.error("Error fetching carts:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const checkout = async (totalamount: number) => {
//     try {
//       await initializePaymentSheet(Math.floor(totalamount * 100));
//       const payed = await openPaymentSheet();
//       if (!payed) {
//         return;
//       }

//       // insertOrder(
//       //   { total },
//       //   {
//       //     onSuccess: saveOrderItems,
//       //   }
//       // );
//       console.log("Payment successful! Proceeding with order creation...");

//       // Uncomment and implement insertOrder
//       // insertOrder({ total: totalAmount }, { onSuccess: saveOrderItems });
//     } catch (error) {
//       console.error("Error during checkout:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCarts();
//     // (async () => {
//     //   try {
//     //     const data = await fetchCarts();
//     //     console.log(data)
//     //     setCarts(data);
//     //   } catch (error) {
//     //     console.error("Error fetching carts:", error);
//     //   }
//     // })();
//   }, []);

//   console.log("Fetch CArt DATA ALl", carts);

//   //   return (
//   //     <SafeAreaView className="flex-1 bg-white px-6 pt-8">
//   //       <View className="flex-row items-center justify-start mb-4">
//   //         <Text className="flex-1 text-center font-bold text-2xl">My Carts</Text>
//   //       </View>
//   //       {loading ? (
//   //         <View className="flex-1 items-center justify-center">
//   //           <Text className="text-lg text-gray-500">Loading your carts...</Text>
//   //         </View>
//   //       ) : carts.length > 0 ? (
//   //         <ScrollView showsVerticalScrollIndicator={false}>
//   //           {carts.map((cart) => {
//   //             const { restaurants, cartitems } = cart;

//   //             // Calculate subtotal for cart items
//   //             const subtotal = cartitems?.reduce(
//   //               (acc, item) => acc + item.quantity * (item.items?.baseprice || 0),
//   //               0
//   //             );

//   //             console.log("cart items here", cartitems);

//   //             const discount = 10; // Example static discount
//   //             const total = subtotal - discount;

//   //             return (
//   //               <View key={cart.cartid} className="mb-6">
//   //                 <Text className="text-xl font-bold mb-2">
//   //                   {restaurants?.restaurantname || "Unknown Restaurant"}
//   //                 </Text>
//   //                 {/* <ScrollView
//   //                   showsVerticalScrollIndicator={false}
//   //                   className="mb-4"
//   //                 > */}
//   //                 {/* {cartitems.map((item) => ( */}
//   //                 <FlatList
//   //                   data={cartitems}
//   //                   keyExtractor={(item) => item.cartitemid.toString()}
//   //                   renderItem={({ item }) => (
//   //                     <CartItem
//   //                       key={item.cartitemid}
//   //                       name={item.restaurantitems?.itemname || "Unknown Item"}
//   //                       price={item.restaurantitems?.baseprice || 0}
//   //                       quantity={item.quantity}
//   //                       image={item.items?.image_url || ""}
//   //                       onIncrement={() => {}}
//   //                       onDecrement={() => {}}
//   //                     />
//   //                   )}
//   //                   showsVerticalScrollIndicator={true}
//   //                 />
//   //                 {/* ))} */}
//   //                 {/* </ScrollView> */}
//   //                 <View className="bg-white p-4 rounded-lg shadow-md">
//   //                   <Text className="text-lg font-semibold">Payment Summary</Text>
//   //                   <View className="flex-row justify-between mt-2">
//   //                     <Text>Total Items ({cartitems.length})</Text>
//   //                     <Text className="font-bold">
//   //                       ${cart.totalamount.toFixed(2)}
//   //                     </Text>
//   //                   </View>
//   //                   <View className="flex-row justify-between mt-1">
//   //                     <Text>Delivery Fee</Text>
//   //                     <Text className="text-green-500">Free</Text>
//   //                   </View>
//   //                   <View className="flex-row justify-between mt-1">
//   //                     <Text>Discount</Text>
//   //                     <Text className="text-red-500">
//   //                       -${discount.toFixed(2)}
//   //                     </Text>
//   //                   </View>
//   //                   <View className="flex-row justify-between mt-3 border-t pt-2">
//   //                     <Text className="text-xl font-bold">Total</Text>
//   //                     <Text className="text-xl font-bold">
//   //                       ${cart.totalamount.toFixed(2)}
//   //                     </Text>
//   //                   </View>
//   //                 </View>
//   //                 <TouchableOpacity
//   //                   className="bg-green-500 p-4 rounded-lg mt-4"
//   //                   onPress={() => checkout(cart.totalamount.toFixed(2))}
//   //                 >
//   //                   <Text className="text-center text-white font-bold text-lg">
//   //                     Order Now
//   //                   </Text>
//   //                 </TouchableOpacity>
//   //               </View>
//   //             );
//   //           })}
//   //         </ScrollView>
//   //       ) : (
//   //         <View className="flex-1 items-center justify-center">
//   //           <View className="w-40 h-40 bg-orange-100 rounded-full items-center justify-end">
//   //             <View className="flex-row w-24 h-24 bg-orange-500 rounded-full items-center justify-center">
//   //               <FontAwesome name="search" size={40} color="#fff" />
//   //             </View>
//   //           </View>
//   //           <Text className="text-xl font-semibold mt-6">Ouch! Hungry</Text>
//   //           <Text className="text-gray-500 text-center mt-2">
//   //             Seems like you have not ordered any food yet
//   //           </Text>
//   //           <TouchableOpacity
//   //             className="bg-green-600 px-6 py-3 rounded-full mt-6"
//   //             onPress={() => router.push("/(user)/index")}
//   //           >
//   //             <Text className="text-white text-lg font-semibold">Find Foods</Text>
//   //           </TouchableOpacity>
//   //         </View>
//   //       )}
//   //     </SafeAreaView>
//   //   );
//   // };

//   // export default CartScreen;

//   const renderCartItem = ({ item }) => (
//     <CartItem
//       key={item.cartitemid}
//       name={item.restaurantitems?.itemname || "Unknown Item"}
//       price={item.restaurantitems?.baseprice || 0}
//       quantity={item.quantity}
//       image={item.items?.image_url || ""}
//       onIncrement={() => {}}
//       onDecrement={() => {}}
//     />
//   );

//   const renderCart = ({ item: cart }) => {
//     const { restaurants, cartitems } = cart;

//     const subtotal = (cartitems || []).reduce(
//       (acc, item) => acc + item.quantity * (item.items?.baseprice || 0),
//       0
//     );

//     const discount = 10; // Example static discount
//     const total = subtotal - discount;

//     return (
//       <View key={cart.cartid} className="mb-6">
//         <Text className="text-xl font-bold mb-2">
//           {restaurants?.restaurantname || "Unknown Restaurant"}
//         </Text>

//         <FlatList
//           data={cartitems}
//           keyExtractor={(item) => item.cartitemid.toString()}
//           renderItem={renderCartItem}
//           showsVerticalScrollIndicator={true}
//           style={{ maxHeight: 300, marginBottom: 10 }}
//           nestedScrollEnabled={true}
//         />

//         <View className="bg-white p-4 rounded-lg shadow-md">
//           <Text className="text-lg font-semibold">Payment Summary</Text>
//           <View className="flex-row justify-between mt-2">
//             <Text>Total Items ({cartitems.length})</Text>
//             <Text className="font-bold">${cart.totalamount.toFixed(2)}</Text>
//           </View>
//           <View className="flex-row justify-between mt-1">
//             <Text>Delivery Fee</Text>
//             <Text className="text-green-500">Free</Text>
//           </View>
//           <View className="flex-row justify-between mt-1">
//             <Text>Discount</Text>
//             <Text className="text-red-500">-${discount.toFixed(2)}</Text>
//           </View>
//           <View className="flex-row justify-between mt-3 border-t pt-2">
//             <Text className="text-xl font-bold">Total</Text>
//             <Text className="text-xl font-bold">
//               ${cart.totalamount.toFixed(2)}
//             </Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           className="bg-green-500 p-4 rounded-lg mt-4"
//           onPress={() => checkout(cart.totalamount.toFixed(2))}
//         >
//           <Text className="text-center text-white font-bold text-lg">
//             Order Now
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white px-6 pt-8">
//       <View className="flex-row items-center justify-start mb-4">
//         <Text className="flex-1 text-center font-bold text-2xl">My Carts</Text>
//       </View>
//       {loading ? (
//         <View className="flex-1 items-center justify-center">
//           <Text className="text-lg text-gray-500">Loading your carts...</Text>
//         </View>
//       ) : carts.length > 0 ? (
//         <FlatList
//           data={carts}
//           keyExtractor={(cart) => cart.cartid.toString()}
//           renderItem={renderCart}
//           showsVerticalScrollIndicator={false}
//           nestedScrollEnabled={true} // Ensure outer list allows nested scrolling
//           keyboardShouldPersistTaps="handled"
//         />
//       ) : (
//         <View className="flex-1 items-center justify-center">
//           <View className="w-40 h-40 bg-orange-100 rounded-full items-center justify-end">
//             <View className="flex-row w-24 h-24 bg-orange-500 rounded-full items-center justify-center">
//               <FontAwesome name="search" size={40} color="#fff" />
//             </View>
//           </View>
//           <Text className="text-xl font-semibold mt-6">Ouch! Hungry</Text>
//           <Text className="text-gray-500 text-center mt-2">
//             Seems like you have not ordered any food yet
//           </Text>
//           <TouchableOpacity
//             className="bg-green-600 px-6 py-3 rounded-full mt-6"
//             onPress={() => router.push("/(user)/index")}
//           >
//             <Text className="text-white text-lg font-semibold">Find Foods</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default CartScreen;
// import React, { useEffect } from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import CartItem from "../../../components/CartComponent/CartItem";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { FontAwesome } from "@expo/vector-icons";
// import { useAuth } from "@/providers/AuthProviders";
// import { router } from "expo-router";
// import { useCart } from "@/providers/CartProvider";

// const CartScreen = () => {
//   const { profile } = useAuth();
//   const { loading, carts, fetchCarts } = useCart();

//   useEffect(() => {
//     fetchCarts();
//   }, []);

//   const renderCartItem = ({ item }) => (
//     <CartItem
//       key={item.cartitemid}
//       name={item.restaurantitems?.itemname || "Unknown Item"}
//       price={item.restaurantitems?.baseprice || 0}
//       quantity={item.quantity}
//       image={item.items?.image_url || ""}
//       onIncrement={() => {}}
//       onDecrement={() => {}}
//     />
//   );

//   const renderCart = ({ item: cart }) => {
//     const { restaurants, cartitems } = cart;
//     const subtotal = (cartitems || []).reduce(
//       (acc, item) => acc + item.quantity * (item.items?.baseprice || 0),
//       0
//     );
//     const discount = 10; // Example static discount
//     const total = subtotal - discount;

//     return (
//       <View key={cart.cartid} className="mb-6">
//         <Text className="text-xl font-bold mb-2">
//           {restaurants?.restaurantname || "Unknown Restaurant"}
//         </Text>
//         <FlatList
//           data={cartitems}
//           keyExtractor={(item) => item.cartitemid.toString()}
//           renderItem={renderCartItem}
//           showsVerticalScrollIndicator={true}
//           nestedScrollEnabled={true} // This enables nested scrolling
//           scrollEnabled={true} // Allow the inner list to be scrollable
//           contentContainerStyle={{ paddingBottom: 20 }} // Add padding for better spacing
//           keyboardShouldPersistTaps="handled"
//           style={{ maxHeight: 250 }} // Limit the height to make scrolling possible
//         />
//         <View className="bg-white p-4 rounded-lg shadow-md">
//           <Text className="text-lg font-semibold">Payment Summary</Text>
//           <View className="flex-row justify-between mt-2">
//             <Text>Total Items ({cartitems.length})</Text>
//             <Text className="font-bold">${cart.totalamount.toFixed(2)}</Text>
//           </View>
//           <View className="flex-row justify-between mt-1">
//             <Text>Delivery Fee</Text>
//             <Text className="text-green-500">Free</Text>
//           </View>
//           <View className="flex-row justify-between mt-1">
//             <Text>Discount</Text>
//             <Text className="text-red-500">-${discount.toFixed(2)}</Text>
//           </View>
//           <View className="flex-row justify-between mt-3 border-t pt-2">
//             <Text className="text-xl font-bold">Total</Text>
//             <Text className="text-xl font-bold">
//               ${cart.totalamount.toFixed(2)}
//             </Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           className="bg-green-500 p-4 rounded-lg mt-4"
//           onPress={() => checkout(cart.totalamount.toFixed(2))}
//         >
//           <Text className="text-center text-white font-bold text-lg">
//             Order Now
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white px-6 pt-8">
//       <View className="flex-row items-center justify-start mb-4">
//         <Text className="flex-1 text-center font-bold text-2xl">My Carts</Text>
//       </View>
//       {loading ? (
//         <View className="flex-1 items-center justify-center">
//           <Text className="text-lg text-gray-500">Loading your carts...</Text>
//         </View>
//       ) : carts.length > 0 ? (
//         <FlatList
//           data={carts}
//           keyExtractor={(cart) => cart.cartid.toString()}
//           renderItem={renderCart}
//           showsVerticalScrollIndicator={true}
//           nestedScrollEnabled={true} // No need for nested scrolling here; outer scroll is main
//           // keyboardShouldPersistTaps="handled" // Handles tap behavior when keyboard is open
//           contentContainerStyle={{ paddingBottom: 100 }} // Provide extra space for better UX
//         />
//       ) : (
//         <View className="flex-1 items-center justify-center">
//           <View className="w-40 h-40 bg-orange-100 rounded-full items-center justify-end">
//             <View className="flex-row w-24 h-24 bg-orange-500 rounded-full items-center justify-center">
//               <FontAwesome name="search" size={40} color="#fff" />
//             </View>
//           </View>
//           <Text className="text-xl font-semibold mt-6">Ouch! Hungry</Text>
//           <Text className="text-gray-500 text-center mt-2">
//             Seems like you have not ordered any food yet
//           </Text>
//           <TouchableOpacity
//             className="bg-green-600 px-6 py-3 rounded-full mt-6"
//             onPress={() => router.push("/(user)/index")}
//           >
//             <Text className="text-white text-lg font-semibold">Find Foods</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default CartScreen;

import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import CartItem from "../../../components/CartComponent/CartItem";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProviders";
import { router, useNavigation } from "expo-router";
import { initializePaymentSheet, openPaymentSheet } from "@/lib/stripe";
import { useCart } from "@/providers/CartProvider";

const CartScreen = () => {
  const { profile } = useAuth();
  const { loading, carts, fetchCarts } = useCart();
  const navigation = useNavigation();

  const checkout = async (totalAmount: number) => {
    try {
      // await initializePaymentSheet(Math.floor(totalAmount * 100));
      // const payed = await openPaymentSheet();
      // if (!payed) return;
      console.log(
        "Payment successful! Proceeding with order creation...",
        totalAmount
      );
      router.push("/Orders");
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  

  const renderCartItem = ({ item }) => (
    
    <CartItem
      key={item.cartitemid}
      name={item.restaurantitems?.itemname || "Unknown Item"}
      price={item.restaurantitems?.baseprice || 0}
      quantity={item.quantity}
      image={item.restaurantitems?.itemsImage || ""}
      onIncrement={() => {}}
      onDecrement={() => {}}
    />
  );

  const renderCart = ({ item: cart }) => {
    const { restaurants, cartitems = [] } = cart;  
    // console.log('ye image hai', cartitems[0].restaurantitems?.itemsImage);
      

    const subtotal = (cartitems).reduce(
    (acc, item) => acc + item.quantity * (item.items?.baseprice || 0),
    
    0
    );
    const discount = 10;
    const total = subtotal - discount;

    return (
      <View key={cart.cartid} style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
          {restaurants?.restaurantname || "Unknown Restaurant"}
        </Text>
        <FlatList
          data={cartitems}
          keyExtractor={(item) => item.cartitemid.toString()}
          renderItem={renderCartItem}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
        <View style={{ padding: 16, backgroundColor: "#fff", borderRadius: 8 }}>
          <Text style={{ fontWeight: "600", marginBottom: 4 }}>
            Payment Summary
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Total Items ({cartitems.length})</Text>
            <Text style={{ fontWeight: "bold" }}>${total.toFixed(2)}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Delivery Fee</Text>
            <Text style={{ color: "green" }}>Free</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Discount</Text>
            <Text style={{ color: "red" }}>-${discount.toFixed(2)}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: "green",
            borderRadius: 8,
          }}
          onPress={() => checkout(total)}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
          >
            Order Now
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!profile) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingTop: 24,
        }}
      >
        <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          My Carts
        </Text>
      </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#6b7280" }}>
            You haven't login yet to view your carts
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 24,
      }}
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          My Carts
        </Text>
      </View>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#6b7280" }}>
            Loading your carts...
          </Text>
        </View>
      ) : carts.length > 0 ? (
        <FlatList
          data={carts}
          keyExtractor={(cart) => cart.cartid.toString()}
          renderItem={renderCart}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#fdf2e3",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#ea580c",
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome name="search" size={32} color="#fff" />
            </View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 16 }}>
            Ouch! Hungry
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Seems like you have not ordered any food yet
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 16,
              paddingVertical: 12,
              paddingHorizontal: 32,
              backgroundColor: "#10b981",
              borderRadius: 24,
            }}
            onPress={() => router.push("/(user)/index")}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Find Foods</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
