import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
// import orders from "@/assets/data/Orders";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderComponent/OrderListItem";
import OrderItemListItem from "@/components/OrderComponent/OrderItemListItem";
import { useOrderDetails } from "@/api/orders";
// import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";

const OrderDetailscreen = () => {
  // const order = orders.find((o) => o.id.toString() === id);
  const { id: idString } = useLocalSearchParams();  // Directly destructure the parameter
  console.log("Order ID from params:", idString);
  
  const id = typeof idString === 'string' ? idString : idString[0];
  console.log("Order ID from agter:", id);

  const {data: order, isLoading, error} = useOrderDetails(id);
  // useUpdateOrderSubscription(id);

  console.log('order aya hai',order);
  
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch order</Text>;
  }
  
  
  return (
    <View style={{ padding: 10, gap: 20, flex: 1 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />
      <Text>Hello Fom order detail</Text>
      {/* <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
      /> */}
    </View>
  );
};

export default OrderDetailscreen;
