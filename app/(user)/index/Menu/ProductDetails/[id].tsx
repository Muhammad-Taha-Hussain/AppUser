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
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useShowItems, useShowItemWithCustomizations } from "@/api/products";
import { defaultPizzaImage } from "@/components/HomeComponent/RestaurantListItem";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProviders";
import RemoteImageItems from "@/components/RemoteImages/RemoteImageItems";

const ProductDetailsScreen = () => {
  const { id: idString, restaurantName } = useLocalSearchParams();
  console.log(restaurantName);

  const { profile } = useAuth();

  const productId = typeof idString === "string" ? idString : idString[0];

  // const { data: item, error, isLoading, refetch } = useShowItems(productId);
  const {
    data: item,
    isLoading,
    error,
    refetch,
  } = useShowItemWithCustomizations(productId);

  // State for selected options
  const [radioSelections, setRadioSelections] = useState({});
  const [checkboxSelections, setCheckboxSelections] = useState({});

  // Handlers
  const handleSelectRadio = (customizationId, valueId) => {
    setRadioSelections((prev) => ({
      ...prev,
      [customizationId]: valueId,
    }));
  };

  const handleSelectCheckbox = (customizationId, valueId) => {
    setCheckboxSelections((prev) => {
      const selected = prev[customizationId] || [];
      if (selected.includes(valueId)) {
        return {
          ...prev,
          [customizationId]: selected.filter((id) => id !== valueId),
        };
      } else {
        return {
          ...prev,
          [customizationId]: [...selected, valueId],
        };
      }
    });
  };

  // console.log("image uye hai", item);

  const [quantity, setQuantity] = useState(1); // State for product quantity
  const { addItemToCart } = useCart(); // Add item function from cart context

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
    if (!profile) {
      Alert.alert("Please login to add items to cart");
      router.push("/(auth)");
      return;
    }

    if (!item) return;

    // Build the customization data
    const customizations: any = [];
  
    // Add radio button selections to customizations
    Object.keys(radioSelections).forEach((customizationId) => {
      const valueId = radioSelections[customizationId];
      const customization = customizationitems.find(
        (c) => c.customizationid === customizationId
      );
      const value = customization.customizationitemsvalue.find(
        (v) => v.customizationvalueid === valueId
      );
  
      if (value) {
        customizations.push({
          customizationId,
          customizationValueId: valueId,
          price: value.price,
        });
      }
    });
  
    // Add checkbox selections to customizations
    Object.keys(checkboxSelections).forEach((customizationId) => {
      const selectedValues = checkboxSelections[customizationId];
      const customization = customizationitems.find(
        (c) => c.customizationid === customizationId
      );
  
      selectedValues.forEach((valueId) => {
        const value = customization.customizationitemsvalue.find(
          (v) => v.customizationvalueid === valueId
        );
  
        if (value) {
          customizations.push({
            customizationId,
            customizationValueId: valueId,
            price: value.price,
          });
        }
      });
    });
  
    // Prepare data for backend API
    const data = {
      itemId: item.itemid,
      restaurantId,
      quantity: quantity || 1,
      customizations,
    };
    const itemId= item.itemid;
    const quantities= quantity || 1;
    console.log('Data of Product', itemId, restaurantId, item.baseprice, quantities, customizations);
    

  
    try {
      await addItemToCart(itemId, restaurantId, item.baseprice, quantities, customizations);
      router.push("/(user)/Cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Unable to add item to cart. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-700">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  // Destructure item only if it exists
  const {
    itemname,
    itemdescription,
    baseprice,
    customizationitems = [],
    itemimage
  } = item || {};

  return (
    <ScrollView className="bg-gray-100 flex-1 p-4">
      <Stack.Screen options={{ title: restaurantName }} />


      <RemoteImageItems
          path={itemimage}
          fallback={defaultPizzaImage}
          className="flex-row w-24 h-24 mr-4 items-center bg-black rounded-lg shadow-lg my-2"
        />
      {/* Item Details */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">{itemname}</Text>
        <Text className="text-sm text-gray-600 mt-2">{itemdescription}</Text>
        <Text className="text-xl font-semibold text-green-600 mt-4">
          ${baseprice?.toFixed(2)}
        </Text>
      </View>

      {/* Customizations */}
      {customizationitems.length > 0 && (
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Customizations
          </Text>
          {customizationitems.map((customization) => (
            <View key={customization.customizationid} className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-2">
                {customization.name}
              </Text>
              <View className="flex flex-row flex-wrap gap-3">
                {customization.customizationitemsvalue.map((value) => {
                  const isSelected =
                    customization.type === "Radio"
                      ? radioSelections[customization.customizationid] ===
                        value.customizationvalueid
                      : checkboxSelections[
                          customization.customizationid
                        ]?.includes(value.customizationvalueid);

                  return (
                    <TouchableOpacity
                      key={value.customizationvalueid}
                      onPress={() => {
                        customization.type === "Radio"
                          ? handleSelectRadio(
                              customization.customizationid,
                              value.customizationvalueid
                            )
                          : handleSelectCheckbox(
                              customization.customizationid,
                              value.customizationvalueid
                            );
                      }}
                      className={`flex flex-row items-center px-4 py-2 rounded-lg ${
                        isSelected ? "bg-green-500" : "bg-gray-200"
                      } shadow-sm`}
                    >
                      <View
                        className={`w-5 h-5 mr-3 flex items-center justify-center ${
                          customization.type === "Radio"
                            ? "rounded-full border-2"
                            : "rounded-sm border-2"
                        } ${
                          isSelected
                            ? "border-white bg-white"
                            : "border-gray-500 bg-gray-100"
                        }`}
                      >
                        {isSelected &&
                          (customization.type === "Radio" ? (
                            <View className="w-3 h-3 rounded-full bg-green-500" />
                          ) : (
                            <View className="w-3 h-3 bg-green-500 rounded-sm" />
                          ))}
                      </View>
                      <Text
                        className={`text-base ${
                          isSelected ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {value.value}
                      </Text>
                      <Text
                        className={`ml-auto text-sm ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      >
                        +${value.price.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Checkout Button */}
      <TouchableOpacity
        onPress={handleAddToCart}
        className="bg-green-500 py-3 rounded-lg items-center shadow-lg mt-4"
      >
        <Text className="text-white text-lg font-bold">
          Proceed to Checkout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// if (isLoading) {
//   return (
//     <View style={styles.centeredContainer}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }

// if (error) {
//   return (
//     <View style={styles.centeredContainer}>
//       <Text style={styles.errorText}>
//         Failed to fetch product details: {error.message}
//       </Text>
//     </View>
//   );
// }

// return (
// <SafeAreaView style={styles.productDetailsContainer}>
//   <Stack.Screen options={{ title: restaurantName }} />
//   {/* <Image source={{ uri: defaultPizzaImage }} style={styles.image} /> */}
//   <RemoteImageItems
//       path={item.itemsImage}
//       fallback={defaultPizzaImage}
//       style={styles.image}
//       resizeMode="contain"
//     />
//   <Text style={styles.title}>{item.itemname}</Text>
//   <Text style={styles.price}>Price: ${item.baseprice}</Text>
//   <Text style={styles.discount}>Discount: {item.discount}%</Text>
//   <Text style={styles.availability}>
//     Status: {item.availablestatus ? "Available" : "Not Available"}
//   </Text>
//   <Text style={styles.rating}>Rating: {item.rating}</Text>
//   <View style={styles.quantityContainer}>
//     <TouchableOpacity
//       style={styles.quantityButton}
//       onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
//     >
//       <Text style={styles.buttonText}>-</Text>
//     </TouchableOpacity>
//     <Text style={styles.quantityText}>{quantity}</Text>
//     <TouchableOpacity
//       style={styles.quantityButton}
//       onPress={() => setQuantity((prev) => prev + 1)}
//     >
//       <Text style={styles.buttonText}>+</Text>
//     </TouchableOpacity>
//   </View>
//   <Button title="Add to Cart" onPress={handleAddToCart} />
// </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9f9f9",
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//   },
//   productDetailsContainer: {
//     padding: 20,
//     backgroundColor: "white",
//     borderRadius: 10,
//     margin: 10,
//   },
//   image: {
//     width: "100%",
//     aspectRatio: 1,
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   price: {
//     fontSize: 18,
//     color: "#333",
//   },
//   discount: {
//     fontSize: 16,
//     color: "#888",
//   },
//   availability: {
//     fontSize: 16,
//     color: "#555",
//   },
//   rating: {
//     fontSize: 16,
//     color: "#555",
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   quantityButton: {
//     padding: 10,
//     backgroundColor: "#ccc",
//     borderRadius: 5,
//   },
//   buttonText: {
//     fontSize: 16,
//   },
//   quantityText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginHorizontal: 10,
//   },
//   listContent: {
//     padding: 20,
//   },
// });

export default ProductDetailsScreen;
