import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chats = [
  {
    id: 1,
    name: "Geopart Etdsien",
    message: "Your Order Just Arrived!",
    time: "13.47",
    avatar: "https://via.placeholder.com/50",
    unread: 0,
  },
  {
    id: 2,
    name: "Stevano Clirover",
    message: "Your Order Just Arrived!",
    time: "11.23",
    avatar: "https://via.placeholder.com/50",
    unread: 3,
  },
  {
    id: 3,
    name: "Elisia Justin",
    message: "Your Order Just Arrived!",
    time: "11.23",
    avatar: "https://via.placeholder.com/50",
    unread: 0,
  },
];

export default function ChatList({ theme, navigation }: any ) {
  return (
    <SafeAreaView>
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          className={`flex-row items-center p-4 rounded-lg mb-2 ${
            theme === "light" ? "bg-gray-100" : "bg-gray-800"
          }`}
          onPress={() =>
            navigation.navigate("ChatScreen", {
              //               id: chat.id,
              name: chat.name,
              avatar: chat.avatar,
            })
          }
        >
          {/* Avatar */}
          <Image
            source={{ uri: chat.avatar }}
            className="w-12 h-12 rounded-full"
          />
          {/* Chat Info */}
          <View className="flex-1 ml-4">
            <Text
              className={`font-bold text-lg ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {chat.name}
            </Text>
            <Text
              className={`text-sm ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {chat.message}
            </Text>
          </View>
          {/* Time and Unread */}
          <View className="items-end">
            <Text
              className={`text-sm ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {chat.time}
            </Text>
            {chat.unread > 0 && (
              <View className="bg-green-500 w-5 h-5 rounded-full items-center justify-center mt-2">
                <Text className="text-white text-xs">{chat.unread}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}
