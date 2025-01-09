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


const DealListItem = React.memo(({ deal }: any) => {
  

  const segments = useSegments();
  console.log(segments[0], "/Home/DealDetails/", deal.dealid);

  return (
    <Link href={`../../app/(user)index/DealDetails/${deal.dealid}`} asChild>
      <Pressable style={styles.container}>
        <Image source={{ uri: defaultPizzaImage }} style={styles.image} />
        <Text style={styles.title}>{deal.dealname}</Text>
        <Text style={styles.title}>{deal.dealdescription}</Text>
        <Text style={styles.price}>{deal.baseprice}</Text>
        <Text style={styles.price}>{deal.discountpercentage}</Text>
        <Text style={styles.price}>{deal.startdate}</Text>
        <Text style={styles.price}>{deal.enddate}</Text>
        {/* <Text style={styles.price}>
          Status: {(deal.startdate > deal.enddate) ? "Available" : "Not Available"}
        </Text> */}
        <Text style={styles.price}>{deal.rating}</Text>
      </Pressable>
    </Link>
  );
});

export default DealListItem;

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
