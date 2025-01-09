import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useShowItems } from "@/api/products";
import { defaultPizzaImage } from "@/components/HomeComponent/RestaurantListItem";
import { useCart } from "@/providers/CartProvider";

const ProductDetailsScreen = () => {
  const { id: idString, restaurantName } = useLocalSearchParams();
  console.log(restaurantName);

  const productId = typeof idString === "string" ? idString : idString[0];

  const { data: item, error, isLoading, refetch } = useShowItems(productId);
  console.log(item);

  const [quantity, setQuantity] = useState(1); // State for product quantity
  const { addItem } = useCart(); // Add item function from cart context

  const router = useRouter();

  // Handler to refresh product details
  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch (e) {
      console.error("Error refreshing product details:", e);
    }
  }, [refetch]);
  const restaurantId = item?.restaurantid;  

  // Handler to add item to cart
  const handleAddToCart = async () => {
    if (item) {
      await addItem(item, quantity || 1, restaurantId); // Ensure default quantity is 1
    }
    router.push('/(user)/Cart')
  };
  

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          Failed to fetch product details: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.productDetailsContainer}>
      <Stack.Screen options={{ title: restaurantName }} />
      <Image source={{ uri: defaultPizzaImage }} style={styles.image} />
      <Text style={styles.title}>{item.itemdescription}</Text>
      <Text style={styles.price}>Price: ${item.baseprice}</Text>
      <Text style={styles.discount}>Discount: {item.discount}%</Text>
      <Text style={styles.availability}>
        Status: {item.availablestatus ? "Available" : "Not Available"}
      </Text>
      <Text style={styles.rating}>Rating: {item.rating}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((prev) => prev + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  productDetailsContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    color: "#333",
  },
  discount: {
    fontSize: 16,
    color: "#888",
  },
  availability: {
    fontSize: 16,
    color: "#555",
  },
  rating: {
    fontSize: 16,
    color: "#555",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  listContent: {
    padding: 20,
  },
});

export default ProductDetailsScreen;
