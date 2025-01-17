import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { usePaginatedRestaurants } from "../../../../api/products/index";
import RestaurantListItem from "@/components/HomeComponent/RestaurantListItem";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  // Fetch product list
  const {
    data: restaurants,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = usePaginatedRestaurants();

  console.log(restaurants);

  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true); // Show refreshing indicator
      await refetch(); // Trigger the API call to fetch new data
    } finally {
      setRefreshing(false); // Hide refreshing indicator
    }
  }, [refetch]);

  // Render loading indicator while fetching data
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-center text-red-500">
          Failed to fetch restaurants: {error.message}
        </Text>
      </View>
    );
  }

  const restaurantsList =
    restaurants?.pages.flatMap((page: any) => page.data) || [];

  // Render the list of restaurants
  return (
    <SafeAreaView className="bg-white">
      <FlatList
        data={restaurantsList}
        keyExtractor={(item) => item.restaurantid.toString()}
        renderItem={({ item }) => <RestaurantListItem restaurants={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10 , padding: 10, paddingBottom: 360 }} // Increased padding
        columnWrapperStyle={{ justifyContent: "space-between" }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage(); // Correct pagination logic
        }}
        onEndReachedThreshold={0.5} // Adjusting threshold to trigger earlier
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="my-3 items-center">
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
