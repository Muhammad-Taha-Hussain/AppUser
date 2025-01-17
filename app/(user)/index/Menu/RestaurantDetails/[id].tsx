import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { usePaginatedDeals, usePaginatedProducts } from "@/api/products";
import ProductListItem from "@/components/HomeComponent/ProductListItem";
import DealListItem from "@/components/HomeComponent/DealListItem";

const RestaurantDetailScreen = () => {
  const { id: idString, restaurantName } = useLocalSearchParams();
  const restaurantId = typeof idString === "string" ? idString : idString[0];

  // Restaurant Items
  const {
    data: items,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = usePaginatedProducts(restaurantId);

  // Restaurant Deals
  const {
    data: deals,
    fetchNextPageDeals,
    hasNextPageDeals,
    isFetchingNextPageDeals,
    isLoadingDeals,
    errorDeals,
    refetchDeals,
  } = usePaginatedDeals(restaurantId);

  const [refreshingItems, setrefreshingItems] = useState(false);
  const [refreshingDeals, setrefreshingDeals] = useState(false);

  const handleRefreshItems = useCallback(async () => {
    try {
      setrefreshingItems(true);
      await refetch();
    } finally {
      setrefreshingItems(false);
    }
  }, [refetch]);
  const handleRefreshDeals = useCallback(async () => {
    try {
      setrefreshingDeals(true);
      await refetchDeals();
    } finally {
      setrefreshingDeals(false);
    }
  }, [refetchDeals]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isLoadingDeals) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Failed to fetch restaurants: {error.message}
        </Text>
      </View>
    );
  }

  if (errorDeals) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Failed to fetch restaurants: {errorDeals.message}
        </Text>
      </View>
    );
  }

  const productList = items?.pages.flatMap((page) => page.data) || [];
  // Flatten the paginated data
  const dealsList = deals?.pages.flatMap((page) => page.data) || [];

  // console.log(dealsList);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: restaurantName }} />
      {/* Restaurant Items */}
      {items.length > 0 && (
        <Text style={styles.title}>Restaurant Items:</Text>
      )}
      <FlatList
        data={productList}
        keyExtractor={(item) => item.itemid.toString()}
        renderItem={({ item }) => (
          <ProductListItem item={item} restaurantName={restaurantName} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={refreshingItems}
        onRefresh={handleRefreshItems}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={styles.footerLoader} />
          ) : null
        }
      />
      {/* Restaurant Deals */}
      {deals && (<Text style={styles.title}>Restaurant Deals:</Text>)}
      <FlatList
        data={dealsList}
        keyExtractor={(item) => item.dealid.toString()}
        renderItem={({ item }) => <DealListItem deal={item} />}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={refreshingDeals}
        onRefresh={handleRefreshDeals}
        onEndReached={() => {
          if (hasNextPageDeals) fetchNextPageDeals();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPageDeals ? (
            <ActivityIndicator size="small" style={styles.footerLoader} />
          ) : null
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
  listContainer: {
    gap: 10,
    padding: 10,
  },
  columnWrapper: {
    gap: 10,
  },
  footerLoader: {
    marginVertical: 10,
  },
});

export default RestaurantDetailScreen;
