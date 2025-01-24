import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import {
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline";
import CategoryTabs from "../../../components/SearchScreenComponent/CategoryTabs";
import RecentSearches from "../../../components/SearchScreenComponent/RecentSearches";
import RecentOrders from "../../../components/SearchScreenComponent/RecentOrders";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuScreen from "@/app/(user)/index/Menu";
import { useLocation } from "@/providers/LocationProvider";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


async function getPlaceName(latitude, longitude) {
  const API_KEY = 'a8b15e79a7b84b028852a79383765ba5'; // Replace with your API key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`;
  
  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      const components = response.data.results[0].components;
      const town = components.town || components.village || components.suburb || '';
      const city = components.city || components.county || components.state || '';
      return `${town}, ${city}`.trim().replace(/^,|,$/g, ''); // Remove any leading or trailing commas
    }
    return 'Location not found';
  } catch (error) {
    console.error('Error fetching place name:', error);
    return 'Error fetching location';
  }
}


export default function Home() {

  const { location } = useLocation();
  const [placeName, setPlaceName] = useState("Fetching location...");

// Fetch place name on component mount or location change
useEffect(() => {
  async function fetchLocationData() {
    try {
      const savedLocation = await AsyncStorage.getItem('savedPlaceName');
      if (savedLocation) {
        setPlaceName(savedLocation); // Use cached place name if available
      }

      if (location?.coords) {
        const { latitude, longitude } = location.coords;
        const name = await getPlaceName(latitude, longitude);
        setPlaceName(name); // Update place name
        await AsyncStorage.setItem('savedPlaceName', name); // Save place name to storage
      }
    } catch (error) {
      console.error('Error accessing local storage:', error);
    }
  }

  fetchLocationData();
}, [location]);


  console.log(location);
  
  return (
    <SafeAreaView className="flex-1 bg-white pt-4">
      <View>
        {/* Header */}
        <View className="flex-row items-center justify-start mb-4">
          <Text className="flex-1 items-center text-center font-bold text-2xl">
          {placeName}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 mt-4 rounded-full p-2 mx-6">
          <MagnifyingGlassIcon size={20} color="gray" className="px-2" />
          <TextInput
            className="flex-1 ml-2 p-1 text-base"
            placeholder="Search Food"
            placeholderTextColor="gray"
          />
          <AdjustmentsVerticalIcon size={20} color="gray" className="pr-2" />
        </View>

        {/* Category Tabs */}
        <CategoryTabs />

        {/* Menu SCreen */}
        <MenuScreen />
        {/* Recent Searches */}
        {/* <RecentSearches /> */}

        {/* Recent Orders */}
        {/* <RecentOrders /> */}
      </View>
    </SafeAreaView>
  );
}

// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, FlatList } from "react-native";
// import {
//   MagnifyingGlassIcon,
//   AdjustmentsVerticalIcon,
// } from "react-native-heroicons/outline";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";
// import CategoryTabs from "../../../components/SearchScreenComponent/CategoryTabs";
// import MenuScreen from "@/app/(user)/index/Menu";
// import { useLocation } from "@/providers/LocationProvider";
// import axios from "axios";

// async function getPlaceName(latitude, longitude) {
//   const API_KEY = "a8b15e79a7b84b028852a79383765ba5"; // Replace with your API key
//   const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`;
//   try {
//     const response = await axios.get(url);
//     if (response.data.results.length > 0) {
//       const components = response.data.results[0].components;
//       const town = components.town || components.village || components.suburb || "";
//       const city = components.city || components.county || components.state || "";
//       return `${town}, ${city}`.trim().replace(/^,|,$/g, "");
//     }
//     return "Location not found";
//   } catch (error) {
//     console.error("Error fetching place name:", error);
//     return "Error fetching location";
//   }
// }

// export default function Home() {
//   const { location } = useLocation();
//   const [placeName, setPlaceName] = useState("Fetching location...");
//   const scrollY = useSharedValue(0);

//   useEffect(() => {
//     if (location?.coords) {
//       const { latitude, longitude } = location.coords;
//       getPlaceName(latitude, longitude).then((name) => setPlaceName(name));
//     }
//   }, [location]);

//   const backgroundStyle = useAnimatedStyle(() => {
//     const isStuck = scrollY.value > 50;
//     return {
//       backgroundColor: isStuck ? withTiming("white") : withTiming("transparent"),
//       shadowOpacity: isStuck ? withTiming(0.15) : withTiming(0),
//       elevation: isStuck ? withTiming(4) : withTiming(0),
//     };
//   });

//   const renderHeader = () => (
//     <View className="flex-row items-center justify-start mb-4 px-6">
//       <Text className="flex-1 text-center font-bold text-2xl">{placeName}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <FlatList
//         ListHeaderComponent={
//           <>
//             {renderHeader()}
//             <View className="relative">
//               {/* This is the sticky header background */}
//               <Animated.View
//                 style={[backgroundStyle, { zIndex: 10 }]} // Added zIndex to ensure it's above other elements
//                 className="absolute top-0 left-0 w-full h-16 rounded-full"
//               />
//               {/* This is the sticky search bar */}
//               <View className="flex-row items-center rounded-full p-2 mx-6 bg-gray-50">
//                 <MagnifyingGlassIcon size={20} color="gray" />
//                 <TextInput
//                   className="flex-1 ml-2 p-1 text-base"
//                   placeholder="Search Food"
//                   placeholderTextColor="gray"
//                 />
//                 <AdjustmentsVerticalIcon size={20} color="gray" />
//               </View>
//             </View>
//             <CategoryTabs />
//           </>
//         }
//         data={[]} // Empty data as we are focusing on static content above
//         renderItem={() => null} // No need for dynamic list rendering here
//         ListFooterComponent={<MenuScreen />} // Render dynamic content below the static content
//         keyExtractor={() => "header"} // Just a placeholder since we're not using actual list items
//         scrollEventThrottle={16}
//         stickyHeaderIndices={[1]} // This makes the search bar sticky at the top
//       />
//     </SafeAreaView>
//   );
// }
