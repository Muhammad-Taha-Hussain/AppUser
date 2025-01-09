import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { ArrowLeftIcon, PaperAirplaneIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen({ route }: any) {
    const navigation = useNavigation();
    console.log(route);
        
//   const { name, avatar } = route.params;

  const [messages, setMessages] = useState([
    { id: 1, text: "Just to order", sender: "other", time: "09:00" },
    {
      id: 2,
      text: "Okay, for what level of spiciness?",
      sender: "me",
      time: "09:15",
    },
    { id: 3, text: "Okay, wait a minute 🙏", sender: "other", time: "09:16" },
    { id: 4, text: "Okay, I’m waiting 🙌", sender: "me", time: "09:20" },
  ]);

  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: inputText,
          sender: "me",
          time: "09:25",
        },
      ]);
      setInputText("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-4">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        {/* <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full ml-4" />
        <Text className="text-lg font-bold ml-4">{name}</Text> */}
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            className={`my-2 ${
              item.sender === "me"
                ? "self-end bg-green-100"
                : "self-start bg-gray-200"
            } p-4 rounded-lg`}
          >
            <Text className="text-sm">{item.text}</Text>
            <Text className="text-xs text-gray-500 mt-2">{item.time}</Text>
          </View>
        )}
      />

      {/* Input Bar */}
      <View className="flex-row items-center bg-gray-100 p-4 rounded-full mt-4">
        <TextInput
          className="flex-1 text-base"
          placeholder="Type something..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage}>
          <PaperAirplaneIcon size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

