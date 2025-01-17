import { StyleSheet, Text, View, Image, Pressable } from "react-native";
// import Colors from '../constants/Colors';
// import { Tables } from '../types';
import { Link, useSegments } from "expo-router";
import RemoteImageRestaurant from "../RemoteImages/RemoteImageRestaurant";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

// type ProductListItemProps = {
//   product: Tables<'products'>;
// };

const RestaurantListItem = ({ restaurants }: any) => {
  // const segments = useSegments();
  // console.log(restaurants);
  
  
  // console.log(segments[0],"/index/Menu/",restaurants.restaurantid);

  return (
    <Link
      href={`/Menu/RestaurantDetails/${
        restaurants.restaurantid
      }?restaurantName=${encodeURIComponent(restaurants.restaurantname)}`}
      asChild
    >
      <Pressable style={styles.container}>
        <RemoteImageRestaurant
          path={restaurants.restaurantImage}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        {/* <Image source={{ uri: defaultPizzaImage }} style={styles.image} /> */}
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
    marginHorizontal: 5,
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
