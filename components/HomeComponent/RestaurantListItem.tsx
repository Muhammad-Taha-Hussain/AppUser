import { StyleSheet, Text, View, Image, Pressable } from "react-native";
// import Colors from '../constants/Colors';
// import { Tables } from '../types';
import { Link, useSegments } from "expo-router";
// import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

// type ProductListItemProps = {
//   product: Tables<'products'>;
// };

const RestaurantListItem = ({ restaurants }: any) => {
  const segments = useSegments();
  console.log("Hey  ", segments[0]);
  
  console.log(segments[0],"/index/RestaurantDetails/",restaurants.restaurantid);

  return (
    <Link
      href={`/(user)/index/RestaurantDetails/${
        restaurants.restaurantid
      }?restaurantName=${encodeURIComponent(restaurants.restaurantname)}`}
      asChild
    >
      <Pressable style={styles.container}>
        {/* <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        /> */}
        <Image source={{ uri: defaultPizzaImage }} style={styles.image} />
        <Text>{restaurants.restaurantid}</Text>
        <Text style={styles.title}>{restaurants.restaurantname}</Text>
        <Text style={styles.price}>${restaurants.restaurantlocation}</Text>
        <Text style={styles.price}>Ratings: {restaurants.rating}</Text>
      </Pressable>
    </Link>
  );
};

export default RestaurantListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
  },
  price: {
    // color: Colors.light.tint,
    fontWeight: "bold",
  },
});
