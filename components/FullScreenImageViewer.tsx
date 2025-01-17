import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RemoteImage from './RemoteImages/RemoteImage';
import { defaultPizzaImage } from './HomeComponent/DealListItem';

const FullScreenImageViewer = ({ visible, imageUrl, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-circle" size={30} color="white" />
        </TouchableOpacity>
        <RemoteImage path={imageUrl} fallback={defaultPizzaImage} style={styles.image} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain', // Ensures the image maintains its aspect ratio
  },
});

export default FullScreenImageViewer;
