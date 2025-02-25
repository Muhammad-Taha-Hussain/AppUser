import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProviders";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { Dimensions } from "react-native";

const slides = [
  {
    id: 1,
    title: "Discover Best Places",
    description:
      '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"',
    image: require("../../assets/images/onboardScreen1.png"),
  },
  {
    id: 2,
    title: "Choose A Tasty Dish",
    description:
      '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"',
    image: require("../../assets/images/onboardScreen2.png"),
  },
  {
    id: 3,
    title: "Pick Up The Delivery",
    description:
      '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"',
    image: require("../../assets/images/onboardScreen3.png"),
  },
];

const LoginScreen = () => {
  const [showHomePage, setShowHomePage] = useState(false);
  const { width, height } = Dimensions.get("screen");
  console.log(Dimensions.get("screen"));

  const router = useRouter();
  const { login, profile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // State to hold password input
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Toggle state for visibility
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    // setLoading(true);
    // try {
    //   await login(email, password);
    //   router.replace('/(user)');
    // } catch (error) {
    //   Alert.alert('Login failed', error.message);
    // }
    // setLoading(false);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(user)/"); // Redirect to user dashboard on success
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Check AsyncStorage to see if the intro slider has been shown
  useEffect(() => {
    const checkIntroStatus = async () => {
      const introShown = await AsyncStorage.getItem("introShown");
      if (introShown) {
        setShowHomePage(true);
      }
    };
    checkIntroStatus();
  }, []);

  const handleDone = async () => {
    await AsyncStorage.setItem("introShown", "true"); // Set introShown flag
    setShowHomePage(true);
  };

  const buttonLabel = (label: string) => {
    return (
      <View style={{ padding: 12 }}>
        <Text style={{ color: "#072F4A", fontWeight: "600", fontSize: 16 }}>
          {label}
        </Text>
      </View>
    );
  };

  if (!showHomePage) {
    return (
      <AppIntroSlider
        data={slides}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              padding: 15,
              paddingTop: 100,
            }}
          >
            <Image
              source={item.image}
              style={{ width: width - 80, height: 400 }}
              resizeMode="contain"
            />
            <Text
              style={{ fontWeight: "bold", color: "#072F4A", fontSize: 22 }}
            >
              {item.title}
            </Text>
            <Text
              style={{ textAlign: "center", paddingTop: 5, color: "#072F4A" }}
            >
              {item.description}
            </Text>
          </View>
        )}
        activeDotStyle={{ backgroundColor: "#f52d56", width: 30 }}
        showSkipButton
        renderNextButton={() => buttonLabel("Next")}
        renderSkipButton={() => buttonLabel("Skip")}
        renderDoneButton={() => buttonLabel("Done")}
        onDone={handleDone}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View>
        <TouchableOpacity
          className="mx-2 my-2"
          onPress={() => router.replace("/(user)")}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="close" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6 pt-12">
        {/* Heading Text Login */}
        <Text className="text-4xl font-bold text-gray-800 mb-2 w-72">
          Login to your account
        </Text>
        <Text className="text-base text-gray-500 mb-8">
          Please sign in to your account
        </Text>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Email Address / Phone No
          </Text>
          <TextInput
            className="flex-row items-center border border-gray-300 rounded-lg p-3 text-gray-800 text-lg"
            placeholder="Enter your email or phone number"
            keyboardType="email-address"
            autoCapitalize={"none"}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
            {/* Password Input */}
            <TextInput
              className="flex-1 py-3 text-lg"
              placeholder="Enter your password"
              secureTextEntry={!isPasswordVisible} // Mask password
              onChangeText={(text) => setPassword(text)}
              value={password}
              autoCapitalize={"none"}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon
                name={isPasswordVisible ? "eye-off" : "eye"} // Toggle icon
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forget Password */}
        <TouchableOpacity onPress={() => router.push("/(auth)/ForgetPassword")}>
          <Text className="text-right text-green-600 text-sm mb-6">
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Button */}
        <TouchableOpacity
          className="bg-green-500 rounded-full py-3"
          onPress={() => signInWithEmail()}
        >
          <Text className="text-center text-white font-bold text-lg">
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Dont have an account */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-sm text-gray-500">Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/Register")}>
            <Text className="text-sm text-green-600 font-bold">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
