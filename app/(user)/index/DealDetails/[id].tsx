import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useShowDealItems } from '@/api/products';
import { useLocalSearchParams } from "expo-router";


const DealDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const dealId = typeof idString === "string" ? idString : idString[0];
  console.log('deal Id is: ', dealId)


  const {
    data: dealItems,
    isLoadingDealItems,
    errorDealItems,
    refetchDealItem,
  } = useShowDealItems(dealId);

  if (isLoadingDealItems) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorDealItems) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Failed to fetch restaurants: {errorDeals.message}
        </Text>
      </View>
    );
  }

  console.log('DealItemDetails: ', dealItems);
  


    return (
    <View>
      {/* <Stack.Screen options={{ title: restaurantName }} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.itemid}
        renderItem={({ item }) => <ProductListItem item={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        refreshing={refreshing} // Indicates pull-to-refresh status
        onRefresh={handleRefresh} // Called during pull-to-refresh
      /> */}
      <Text>Hello From deal useShowDealItems</Text>
    </View>
  );
};


export default DealDetailsScreen;