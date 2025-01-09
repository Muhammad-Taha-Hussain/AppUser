import { StyleSheet, Text, View, Image, Pressable } from "react-native";
// import Colors from '../constants/Colors';
// import { Tables } from '../types';
import { Link, useSegments } from "expo-router";
import React from "react";
// import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

// type ProductListItemProps = {
//   product: Tables<'products'>;
// };

const ProductListItem = React.memo(({ item, restaurantName }: any) => {
  const segments = useSegments();
  console.log(
    segments[0],
    "/index/ProductDetails/",
    item.itemid,
    restaurantName
  );

  return (
    <Link
      href={`../../app/(user)/index/ProductDetails/${
        item.itemid
      }?restaurantName=${encodeURIComponent(
        restaurantName
      )}`}
      asChild
    >
      <Pressable style={styles.container}>
        <Image source={{ uri: defaultPizzaImage }} style={styles.image} />
        <Text style={styles.title}>{item.itemdescription}</Text>
        <Text style={styles.price}>{item.baseprice}</Text>
        <Text style={styles.price}>{item.discount}</Text>
        <Text style={styles.price}>
          Status: {item.availablestatus ? "Available" : "Not Available"}
        </Text>
        <Text style={styles.price}>{item.rating}</Text>
      </Pressable>
    </Link>
  );
});

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "white",
  },
  price: {
    // color: Colors.light.tint,
    fontWeight: "bold",
    color: "white",
  },
});
