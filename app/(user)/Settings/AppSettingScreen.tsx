import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const AppSettingScreen = () => {
    const navigation = useNavigation();

  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const togglePushNotifications = () => setIsPushEnabled(!isPushEnabled);
  const toggleLocation = () => setIsLocationEnabled(!isLocationEnabled);

  const openLanguageModal = () => setIsLanguageModalVisible(true);
  const closeLanguageModal = () => setIsLanguageModalVisible(false);

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    closeLanguageModal();
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-8">
              {/* Header */}
        <View className="flex-row items-center p-2 ">
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-gray-100 p-2 rounded-full">
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-2xl text-center font-bold">Settings</Text>
        </View>

      {/* Push Notifications */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg text-gray-700">Push Notification</Text>
        <Switch className="text-red-700" value={isPushEnabled} onValueChange={togglePushNotifications} />
      </View>

      {/* Location */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg text-gray-700">Location</Text>
        <Switch value={isLocationEnabled} onValueChange={toggleLocation} />
      </View>

      {/* Language */}
      <TouchableOpacity onPress={openLanguageModal} className="flex-row justify-between items-center mb-6">
        <Text className="text-lg text-gray-700">Language</Text>
        <Text className="text-gray-500">{selectedLanguage} ➔</Text>
      </TouchableOpacity>

      {/* Other Links */}
      <Text className="text-gray-500 mt-2 font-bold uppercase">Other</Text>
      <TouchableOpacity className="py-2">
        <Text className="text-lg text-gray-600">About Ticketis</Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-2">
        <Text className="text-lg text-gray-600">Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-2">
        <Text className="text-lg text-gray-600">Terms and Conditions</Text>
      </TouchableOpacity>

      {/* Language Modal */}
      <Modal
        visible={isLanguageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeLanguageModal}
      >
        <View className="flex-1 justify-end bg-transparent bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-lg font-semibold mb-4">Select Language</Text>

            {/* English Option */}
            <TouchableOpacity
              onPress={() => selectLanguage("English")}
              className="flex-row justify-between items-center p-3 rounded-lg border mb-2"
              style={{
                borderColor: selectedLanguage === "English" ? "#34D399" : "#E5E7EB",
                backgroundColor: selectedLanguage === "English" ? "#ECFDF5" : "white",
              }}
            >
              <Text className="text-lg">🇺🇸 English (Default)</Text>
              {selectedLanguage === "English" && (
                <Text className="text-green-500 text-2xl font-bold">✓</Text>
              )}
            </TouchableOpacity>

            {/* Urdu Option */}
            <TouchableOpacity
              onPress={() => selectLanguage("Urdu")}
              className="flex-row justify-between items-center p-3 rounded-lg border"
              style={{
                borderColor: selectedLanguage === "Urdu" ? "#34D399" : "#E5E7EB",
                backgroundColor: selectedLanguage === "Urdu" ? "#ECFDF5" : "white",
              }}
            >
              <Text className="text-lg">🇵🇰 Urdu</Text>
              {selectedLanguage === "Urdu" && (
                <Text className="text-green-500 text-2xl font-bold">✓</Text>
              )}
            </TouchableOpacity>

            {/* Select Button */}
            {/* <TouchableOpacity
              onPress={closeLanguageModal}
              className="bg-green-600 p-3 rounded-full mt-4"
            >
              <Text className="text-center text-white text-lg font-bold">Select</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AppSettingScreen;