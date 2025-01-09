import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { MoonIcon, SunIcon } from "react-native-heroicons/outline";
import ChatList from "../../../components/Chats/ChatList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

export default function ChatScreen() {
  const [isChatList, setIsChatList] = useState(true);
  const navigation = useNavigation();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ImageBackground
      source={
        theme === "light"
          ? require("../../../assets/images/backgroundImages/light-background.jpg") // Add your light background image
          : require("../../../assets/images/backgroundImages/dark-background.jpg") // Add your dark background image
      }
      style={{ flex: 1 }}
    >
      <SafeAreaView className={`flex-1  px-6 pt-8`}>
        {/* Header */}
        <View className="flex-row items-center">
          <Text
            className={`flex-1 justify-center items-center text-center text-2xl font-bold ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            Chat List
          </Text>
          <TouchableOpacity
            className={`flex-row justify-end items-center  p-2 rounded-full ${
              theme === "light" ? "bg-black" : "bg-white"
            }`}
            onPress={toggleTheme}
          >
            {theme === "light" ? (
              <MoonIcon size={20} color="white" />
            ) : (
              <SunIcon size={20} color="black" />
            )}
          </TouchableOpacity>
        </View>

        {/* Chat List */}
        {!isChatList ? (
          <View className="flex-1 items-center justify-start mt-10">
            <Text
              className={`text-center font-bold text-4xl ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              No Conversation
            </Text>
            <Text
              className={`text-center font-light text-1xl ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              Seem like you haven't chat with anyone
            </Text>
          </View>
        ) : (
          <ScrollView className="mt-4">
            <ChatList theme={theme} navigation={navigation} />
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
