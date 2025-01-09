import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import {
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline";
import CategoryTabs from "../../../components/SearchScreenComponent/CategoryTabs";
import RecentSearches from "../../../components/SearchScreenComponent/RecentSearches";
import RecentOrders from "../../../components/SearchScreenComponent/RecentOrders";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuScreen from "@/app/(user)/index/Menu/MenuScreen";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white pt-8">
      <View>
        {/* Header */}
        <View className="flex-row items-center justify-start mb-4">
          <Text className="flex-1 items-center text-center font-bold text-2xl">
            Search Food
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 mt-4 rounded-full p-2">
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
