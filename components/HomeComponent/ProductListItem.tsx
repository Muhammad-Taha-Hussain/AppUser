import { StyleSheet, Text, View, Image, Pressable } from "react-native";
// import Colors from '../constants/Colors';
// import { Tables } from '../types';
import { Link, useSegments } from "expo-router";
import React from "react";
import RemoteImageItems from '../RemoteImages/RemoteImageItems';

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

// type ProductListItemProps = {
//   product: Tables<'products'>;
// };

const ProductListItem = React.memo(({ item, restaurantName }: any) => {
  // const segments = useSegments();
  console.log(item);
  

  console.log('items image', item.itemsImage)

  return (
    <Link
      href={`/Menu/ProductDetails/${
        item.itemid
      }?restaurantName=${encodeURIComponent(
        restaurantName
      )}`}
      asChild
    >
      <Pressable style={styles.container}>
      <RemoteImageItems
          path={item.itemsImage}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={ styles.textView}>   
        <Text style={styles.title}>{item.itemname}</Text>
        <Text style={styles.price}>{item.baseprice}</Text>
        <Text style={styles.price}>{item.discount}</Text>
        <Text style={styles.price}>
          Status: {item.availablestatus ? "Available" : "Not Available"}
        </Text>
        <Text style={styles.price}>{item.rating}</Text>
        </View>
      </Pressable>
    </Link>
  );
});

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderBlockColor: "black",
    borderWidth: 1,
    padding: 0,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
    shadowColor: "black", // Consistent shadow color for dark shadow
    shadowOffset: { width: -2, height: 2 }, // Adds a shadow offset
    shadowOpacity: 0.75, // Controls shadow transparency (between 0 and 1)
    shadowRadius: 4, // Controls blur intensity
    elevation: 6, // For Android shadow
    // overflow: "hidden",
  },
 
  image: {
    width: "100%",
    aspectRatio: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  textView: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "black",

  },
  price: {
    // color: Colors.light.tint,
    fontWeight: "bold",
    color: "black",

  },
});
