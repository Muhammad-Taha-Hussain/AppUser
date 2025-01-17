import { Text, FlatList, ActivityIndicator, View } from "react-native";
import OrderListItem from "@/components/OrderComponent/OrderListItem";
import { useMyOrderList } from "@/api/orders";
// import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }
  if (error) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    <SafeAreaView className="background-white">
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />
      <Text>Heloo</Text>
    </SafeAreaView>
  );
}
