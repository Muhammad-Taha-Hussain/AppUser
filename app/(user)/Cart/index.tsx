
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
import { supabase } from "@/lib/supabase";

const CartScreen = () => {
  const { profile } = useAuth();
  const { loading, carts, fetchCarts, updateCartItems } = useCart();
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

  const handleIncrement = async (
    cartItemId: number,
    cartId: number,
    currentQuantity: number
  ) => {
    try {
      // New quantity after increment
      const newQuantity = currentQuantity + 1;
      console.log("cartitemid", cartItemId);

      const { data: itemData, error } = await supabase
        .from("cartitems")
        .select(
          `
    restaurantitems (baseprice),
    cartcustomizations (price)
  `
        )
        .eq("cartitemid", cartItemId)
        .single();

      if (error) {
        console.error("Error fetching cart item data:", error);
        return;
      }

      console.log("item data", itemData);

      // Extract base price and customization prices
      const basePrice = itemData?.restaurantitems?.baseprice || 0;
      const customizations = itemData?.cartcustomizations || [];
      const customizationTotal = customizations.reduce(
        (sum, customization) => sum + customization.price,
        0
      );

      console.log("Base Price:", basePrice);
      console.log("Customization Total:", customizationTotal);

      // Calculate the new subtotal, factoring in customizations
      const newSubtotal = (basePrice + customizationTotal) * newQuantity;

      // Update the cart item in the database with new quantity and subtotal
      await updateCartItems(
        [
          {
            cartitemid: cartItemId,
            quantity: newQuantity,
            subtotal: newSubtotal,
          },
        ],
        cartId
      );
    } catch (error) {
      console.error("Error in handleIncrement:", error);
    }
  };

  const handleDecrement = async (
    cartItemId: number,
    cartId: number,
    currentQuantity: number
  ) => {
    try {
      if (currentQuantity <= 1) {
        console.warn("Cannot decrement below 1. Use a remove option instead.");
        return;
      }

      // New quantity after decrement
      const newQuantity = currentQuantity - 1;

      // Calculate the new subtotal for the item
      const { data: itemData, error } = await supabase
        .from("cartitems")
        .select(
          `
    restaurantitems (baseprice),
    cartcustomizations (price)
  `
        )
        .eq("cartitemid", cartItemId)
        .single();

      if (error) {
        console.error("Error fetching cart item data:", error);
        return;
      }

            // Extract base price and customization prices
            const basePrice = itemData?.restaurantitems?.baseprice || 0;
            const customizations = itemData?.cartcustomizations || [];
            const customizationTotal = customizations.reduce(
              (sum, customization) => sum + customization.price,
              0
            );

      const newSubtotal = (basePrice + customizationTotal) * newQuantity;

      // Update the cart item in the database
      await updateCartItems(
        [
          {
            cartitemid: cartItemId,
            quantity: newQuantity,
            subtotal: newSubtotal,
          },
        ],
        cartId
      );
    } catch (error) {
      console.error("Error in handleDecrement:", error);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const renderCartItem = ({ item }: any) => (
    // console.log('item hai', item)

    <CartItem
    item={item}
      // cartItemId={item.cartitemid}
      // key={item.cartitemid}
      // name={item.restaurantitems?.itemname || "Unknown Item"}
      // basePrice={item.restaurantitems?.baseprice || 0}
      // quantity={item.quantity}
      // image={item.restaurantitems?.itemsImage || ""}
      onIncrement={() =>
        handleIncrement(item.cartitemid, item.cartid, item.quantity)
      }
      onDecrement={() =>
        handleDecrement(item.cartitemid, item.cartid, item.quantity)
      }
    />
  );

  const renderCart = ({ item: cart }: any) => {
    const { restaurants, cartitems = [] } = cart;
    // console.log('ye image hai', cartitems[0].restaurantitems?.itemsImage);

    console.log("cartitems hai ", cart);

    // const subtotal = cartitems.reduce(
    // (acc, item) => acc + item.quantity * (item.items?.baseprice || 0),
    // 0
    // );
    const discount = 0;
    const total = cart?.totalamount - discount;

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
          <Text
            style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
          >
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
            onPress={() => router.push("/(user)")}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Find Foods</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
