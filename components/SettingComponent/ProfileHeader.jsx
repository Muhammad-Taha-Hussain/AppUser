import React, {useState} from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { defaultPizzaImage } from "../HomeComponent/DealListItem";
import RemoteImage from "../RemoteImages/RemoteImage";
import FullScreenImageViewer from "../FullScreenImageViewer";


const ProfileHeader = ({ name, email, imageUrl }) => {
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  // console.log(imageUrl);
  
  return (
    <View className="items-center mt-8 mb-4">
      <View className="relative">
      <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
      <RemoteImage
        path={imageUrl}
        fallback={defaultPizzaImage}
        className="w-36 h-36 rounded-full"
        />
        </TouchableOpacity>
        {/* <Image
          source={{ uri: imageUrl }}
          className="w-20 h-20 rounded-full"
          alt="Profile Image"
        /> */}
        <View className="absolute bottom-0 right-0 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
          <Text className="text-white text-xs font-bold">🔒</Text>
        </View>
      </View>
      <Text className="text-xl font-semibold mt-2">{name}</Text>
      <Text className="text-gray-500">{email}</Text>

      {/* Full-Screen Image Viewer */}
      <FullScreenImageViewer
        visible={isImageViewerVisible}
        imageUrl={imageUrl}
        onClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
};

export default ProfileHeader;
