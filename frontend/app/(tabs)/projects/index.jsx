import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [aadharNumber, setAadharNumber] = useState("");
  const [photo, setPhoto] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [pdf, setPdf] = useState(null);

  const statusBarHeight = StatusBar.currentHeight || 20;

  const theme = {
    background: "#0a0f1a",
    surface: "#131d2a",
    primary: "#00b890",
    primaryTransparent: "rgba(0, 216, 160, 0.1)",
    inactive: "#7a8ca2",
    shadow: "#000",
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/login/allprojects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handlePhotoCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Camera permission is required to capture photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handlePdfUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (!result.canceled) {
      setPdf(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!aadharNumber || !photo || !projectTitle || !projectDescription || !pdf) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("aadharNumber", aadharNumber);
    formData.append("projectTitle", projectTitle);
    formData.append("projectDescription", projectDescription);

    const photoFile = {
      uri: photo,
      name: "photo.jpg",
      type: "image/jpeg",
    };
    formData.append("photo", photoFile);

    const pdfFile = {
      uri: pdf,
      name: "document.pdf",
      type: "application/pdf",
    };
    formData.append("pdf", pdfFile);

    try {
      const response = await fetch("http://localhost:5001/verify", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit project.");
      }

      const result = await response.json();

      // Show alert based on verdict
      if (result.verdict === "LEGITIMATE") {
        Alert.alert("Congratulations!", "Your project has been verified and approved!");
      } else {
        Alert.alert("Rejected", "Your project did not meet the verification criteria.");
      }

      // Close modal and reset form fields
      setModalVisible(false);
      setAadharNumber("");
      setPhoto(null);
      setProjectTitle("");
      setProjectDescription("");
      setPdf(null);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text className="text-white mt-3">Loading Projects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  const renderProgressBar = (progress) => {
    return (
      <View className="h-1 bg-white/10 rounded overflow-hidden">
        <View
          className="h-full rounded"
          style={{ width: `${progress}%`, backgroundColor: theme.primary }}
        />
      </View>
    );
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: statusBarHeight + 20,
      }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-semibold text-white">
          Explore Projects
        </Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full border flex items-center justify-center"
          style={{
            borderColor: theme.primaryTransparent,
            backgroundColor: theme.primaryTransparent,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {projects.map((project) => {
        const progress = (project.raisedAmount / project.fundingGoal) * 100;
        return (
          <TouchableOpacity
            key={project._id}
            className="mb-6 rounded-xl overflow-hidden shadow-sm"
            style={{ backgroundColor: theme.surface }}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/projects/projectdetails",
                params: { name: project.name },
              });
            }}
          >
            <View className="p-5">
              {/* Top Section */}
              <View className="mb-5">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xl font-semibold text-white flex-1 mr-4">
                    {project.name}
                  </Text>
                  <View
                    className="flex-row items-center px-2 py-1 rounded"
                    style={{
                      borderColor: theme.primaryTransparent,
                      backgroundColor: theme.primaryTransparent,
                    }}
                  >
                    <Icon name="shield" size={12} color={theme.primary} />
                    <Text className="ml-1 font-semibold" style={{ color: theme.primary }}>
                      {project.trustScore}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-2.5">
                  <Icon name="map-pin" size={12} color={theme.inactive} />
                  <Text className="ml-1 text-sm" style={{ color: theme.inactive }}>
                    Mumbai, Maharashtra
                  </Text>
                </View>

                <Text
                  className="text-sm leading-relaxed"
                  style={{ color: "#c3cfe2" }}
                >
                  {project.shortDescription}
                </Text>
              </View>

              {/* Image Section */}
              <View className="relative h-40 rounded-lg overflow-hidden mb-5">
                <Image
                  source={{ uri: project.imageUri }}
                  className="absolute w-full h-full"
                />
                <LinearGradient
                  colors={[
                    "rgba(15, 25, 36, 0)",
                    "rgba(15, 25, 36, 0.9)"
                  ]}
                  className="absolute bottom-0 left-0 right-0 h-20"
                />

                <View className="absolute bottom-3 left-3 flex-row gap-3">
                  <View
                    className="flex-row items-center px-2 py-1 rounded"
                    style={{ backgroundColor: "rgba(15, 25, 36, 0.7)" }}
                  >
                    <Icon name="users" size={12} color={theme.primary} />
                    <Text className="ml-1 text-xs text-white">
                      220
                    </Text>
                  </View>

                  <View
                    className="flex-row items-center px-2 py-1 rounded"
                    style={{ backgroundColor: "rgba(15, 25, 36, 0.7)" }}
                  >
                    <Icon name="trending-up" size={12} color={theme.primary} />
                    <Text className="ml-1 text-xs text-white">
                      12%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Funding Section */}
              <View className="mb-5">
                <View className="flex-row items-baseline mb-2">
                  <Text className="text-lg font-bold text-white">
                    ₹{project.raisedAmount.toLocaleString()}
                  </Text>
                  <Text className="ml-1 text-sm" style={{ color: theme.inactive }}>
                    / ₹{project.fundingGoal.toLocaleString()}
                  </Text>
                </View>

                {renderProgressBar(progress)}

                <View className="flex-row justify-between items-center mt-4">
                  <View className="flex-row items-center">
                    <Icon name="clock" size={12} color={theme.inactive} />
                    <Text className="ml-1 text-sm" style={{ color: theme.inactive }}>
                      22 days left
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View className="flex-row gap-[-12px] w-9 h-6 relative">
                      {[0, 1, 2].map((index) => (
                        <View
                          key={index}
                          className="absolute w-6 h-6 rounded-full justify-center items-center"
                          style={{
                            right: index * 12,
                            backgroundColor: theme.surface,
                          }}
                        >
                          <Image
                            source={{
                              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmI57giWxjA-WXBTE7HIzLV0Y9YcEnxIyrCQ&s",
                            }}
                            className="w-5 h-5 rounded-full"
                          />
                        </View>
                      ))}
                    </View>

                    <Text
                      className="ml-3 text-sm"
                      style={{ color: theme.inactive }}
                    >
                      +220 others
                    </Text>
                  </View>
                </View>
              </View>

              {/* Details Button */}
              <TouchableOpacity
                className="rounded-lg py-3 px-6 flex-row justify-center items-center"
                style={{
                  backgroundColor: theme.primary,
                }}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/projects/projectdetails",
                    params: { name: project.name },
                  });
                }}
              >
                <Text className="text-sm font-semibold" style={{ color: theme.background }}>
                  View Details
                </Text>
                <Icon name="arrow-right" size={16} color={theme.background} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Modal for Project Submission */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View className="p-6 rounded-lg" style={{ backgroundColor: theme.surface }}>
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-white">Project Verification</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="x" size={24} color={theme.inactive} />
            </TouchableOpacity>
          </View>

          {/* Aadhar Number Input */}
          <Text className="text-sm font-medium mb-2" style={{ color: theme.inactive }}>
            Aadhar Number
          </Text>
          <TextInput
            className="bg-white/10 rounded-lg p-3 text-white mb-4"
            placeholder="Enter your Aadhar number"
            placeholderTextColor={theme.inactive}
            value={aadharNumber}
            onChangeText={setAadharNumber}
            keyboardType="numeric"
          />

          {/* Photo Capture Section */}
          <Text className="text-sm font-medium mb-2" style={{ color: theme.inactive }}>
            Capture Your Photo
          </Text>
          <TouchableOpacity
            className="bg-white/10 rounded-lg p-4 mb-4 flex-row items-center justify-center"
            onPress={handlePhotoCapture}
          >
            {photo ? (
              <Image source={{ uri: photo }} className="w-20 h-20 rounded-full" />
            ) : (
              <View className="flex-row items-center">
                <Icon name="camera" size={20} color={theme.primary} />
                <Text className="ml-2 text-white">Take a Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Project Title Input */}
          <Text className="text-sm font-medium mb-2" style={{ color: theme.inactive }}>
            Project Title
          </Text>
          <TextInput
            className="bg-white/10 rounded-lg p-3 text-white mb-4"
            placeholder="Enter project title"
            placeholderTextColor={theme.inactive}
            value={projectTitle}
            onChangeText={setProjectTitle}
          />

          {/* Project Description Input */}
          <Text className="text-sm font-medium mb-2" style={{ color: theme.inactive }}>
            Project Description
          </Text>
          <TextInput
            className="bg-white/10 rounded-lg p-3 text-white mb-4"
            placeholder="Describe your project"
            placeholderTextColor={theme.inactive}
            value={projectDescription}
            onChangeText={setProjectDescription}
            multiline
            numberOfLines={4}
          />

          {/* PDF Upload Section */}
          <Text className="text-sm font-medium mb-2" style={{ color: theme.inactive }}>
            Upload Project Documentation (PDF)
          </Text>
          <TouchableOpacity
            className="bg-white/10 rounded-lg p-4 mb-6 flex-row items-center justify-center"
            onPress={handlePdfUpload}
          >
            {pdf ? (
              <View className="flex-row items-center">
                <Icon name="file-text" size={20} color={theme.primary} />
                <Text className="ml-2 text-white">Document Uploaded</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Icon name="upload" size={20} color={theme.primary} />
                <Text className="ml-2 text-white">Upload PDF</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-primary rounded-lg p-4 flex-row justify-center items-center"
            onPress={handleSubmit}
          >
            <Text className="text-lg font-semibold" style={{ color: theme.background }}>
              Submit for Verification
            </Text>
            <Icon name="arrow-right" size={20} color={theme.background} className="ml-2" />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProjectList;