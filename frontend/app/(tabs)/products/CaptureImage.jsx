import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

const CaptureImage = ({ setImageUri, onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCaptureImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Camera access is needed to capture an image."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      // Correct the image orientation using ImageManipulator
      const correctedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ rotate: 0 }], // Rotate the image to correct orientation
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      setSelectedImage(correctedImage.uri);
      setImageUri(correctedImage.uri);
    }
  };

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const uploadImage = async () => {
      if (selectedImage && isMounted) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", {
          uri: selectedImage,
          type: "image/jpeg",
          name: "image.jpg",
        });

        try {
          const response = await axios.post(
            "http://localhost:5001/detect_objects",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Image uploaded successfully:", response.data);
          setIsLoading(false);

          // Pass the response data back to the parent
          if (onImageUpload && isMounted) {
            onImageUpload(response.data);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          setIsLoading(false);
          if (isMounted) {
            Alert.alert(
              "Upload Failed",
              "There was an error uploading the image. Please try again."
            );
          }
        }
      }
    };

    uploadImage();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [selectedImage]); // Only run when selectedImage changes

  return (
    <View className="my-4">
      <TouchableOpacity
        onPress={handleCaptureImage}
        className="bg-emerald-800 p-3 rounded-xl shadow-md"
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">
            Capture Image
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CaptureImage;
