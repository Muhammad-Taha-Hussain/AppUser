import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
// import { Order, Tables } from "../types";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Link, useSegments } from "expo-router";
// import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";

dayjs.extend(relativeTime);

// type OrderListItemProps = {
//   order: Tables<"orders">;
// };

const OrderListItem = ({ order }: any) => {
  // const segments = useSegments();
  console.log("hello from order", order.orderid);
  
  return (
    <Link href={`/Orders/${order.orderid}`} asChild>
      <Pressable style={styles.container}>
        <View>
          <Text style={styles.title}>Order #{order.orderid}</Text>
          <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
        </View>

        <Text style={styles.status}>{order.status}</Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginVertical: 5,
    maxWidth: '70%',
  },
  time: {
    color: "gray",
  },
  status: {
    fontWeight: "500",
  },
});

export default OrderListItem;
