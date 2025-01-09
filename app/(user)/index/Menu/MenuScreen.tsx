import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import { usePaginatedRestaurants } from '../../../../api/products/index';
import RestaurantListItem from '../../../../components/HomeComponent/RestaurantListItem';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render error message if data fetch fails
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', color: 'red' }}>
          Failed to fetch restaurants: {error.message}
        </Text>
      </View>
    );
  }

  const restaurantsList = restaurants?.pages.flatMap((page: any) => page.data) || [];

  // Render the list of restaurants
  return (
    <SafeAreaView>
    <FlatList
      data={restaurantsList}
      keyExtractor={(item) => item.restaurantid.toString()}
      renderItem={({ item }) => <RestaurantListItem restaurants={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      refreshing={refreshing} // Indicates pull-to-refresh status
      onRefresh={handleRefresh} // Called during pull-to-refresh
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size="small" style={styles.footerLoader} /> : null
      }
    />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  footerLoader: {
    marginVertical: 10,
  },
})