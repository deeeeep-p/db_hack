import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const Account = () => {
  // User data state
  const [userData] = useState({
    name: "Deep Patel",
    email: "deeppatel@outlook.com",
    phone: "+91 9876543210",
    address: "Mumbai, Maharashtra",
    memberSince: "January 2023",
  });

  // Bill analysis form state
  const [modalVisible, setModalVisible] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [familySize, setFamilySize] = useState("");
  const [region, setRegion] = useState("");

  // Analysis results state
  const [billAnalysis, setBillAnalysis] = useState({
    electricity: null, // Initially set to null
    gas: null, // Initially set to null
  });

  // Function to pick an image from the gallery
  const pickImage = async (setImage) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // Function to upload images and user data to the backend
  const uploadData = async () => {
    if (!image1 || !image2 || !familySize || !region) {
      Alert.alert("Error", "Please upload both images and fill in all fields.");
      return;
    }

    const payload = {
      imagesBase64: [image1, image2],
      userData: {
        family_size: parseInt(familySize, 10),
        region: region,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/login/analyze-bills",
        payload
      );

      // Update the bill analysis state with the response data
      const [electricityResult, gasResult] = response.data;
      setBillAnalysis({
        electricity: electricityResult,
        gas: gasResult,
      });

      // Close the modal after successful submission
      setModalVisible(false);

      // Reset form fields
      setImage1(null);
      setImage2(null);
      setFamilySize("");
      setRegion("");

      Alert.alert("Success", "Bills analyzed successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      Alert.alert("Error", "Failed to upload data. Please try again.");
    }
  };

  const getSustainabilityColor = (score) => {
    if (score >= 80) return "#4CAF50";
    if (score >= 60) return "#FFC107";
    return "#F44336";
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>
              {userData.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.profileDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={20} color="#00b890" />
            <Text style={styles.detailText}>{userData.phone}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#00b890" />
            <Text style={styles.detailText}>{userData.address}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#00b890" />
            <Text style={styles.detailText}>
              Member since: {userData.memberSince}
            </Text>
          </View>
        </View>
      </View>

      {/* Bill Analysis Button */}
      <TouchableOpacity
        style={styles.analyzeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.analyzeButtonText}>Analyze New Bills</Text>
      </TouchableOpacity>

      {/* Bill Analysis Results */}
      <View style={styles.billsSection}>
        {(billAnalysis.electricity || billAnalysis.gas) && (
          <Text style={styles.sectionTitle}>Your Bill Analysis</Text>
        )}

        {/* Electricity Bill Card */}
        {billAnalysis.electricity && (
          <View style={styles.billCard}>
            <View style={styles.billCardHeader}>
              <Ionicons name="flash-outline" size={24} color="#00b890" />
              <Text style={styles.billCardTitle}>Electricity Bill</Text>
            </View>

            <View style={styles.billCardContent}>
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Provider:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.electricity.bill_provider}
                </Text>
              </View>

              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Period:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.electricity.billing_period}
                </Text>
              </View>

              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Consumption:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.electricity.consumption.value}{" "}
                  {billAnalysis.electricity.consumption.unit}
                </Text>
              </View>

              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Amount:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.electricity.amount.currency}{" "}
                  {billAnalysis.electricity.amount.value}
                </Text>
              </View>

              {/* Sustainability Score */}
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Sustainability Score</Text>
                <View style={styles.scoreWrapper}>
                  <View
                    style={[
                      styles.scoreIndicator,
                      {
                        backgroundColor: getSustainabilityColor(
                          billAnalysis.electricity.sustainability_score
                        ),
                        width: `${billAnalysis.electricity.sustainability_score}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.scoreValue}>
                  {billAnalysis.electricity.sustainability_score}/100
                </Text>
              </View>

              {/* Key Insights */}
              <Text style={styles.insightsTitle}>Key Insights:</Text>
              {billAnalysis.electricity.key_insights.map((insight, index) => (
                <Text key={index} style={styles.insightText}>
                  • {insight}
                </Text>
              ))}

              {/* Recommendations */}
              <Text style={styles.insightsTitle}>Recommendations:</Text>
              {billAnalysis.electricity.recommendations.map((rec, index) => (
                <Text key={index} style={styles.insightText}>
                  • {rec}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Gas Bill Card */}
        {billAnalysis.gas && (
          <View style={styles.billCard}>
            <View style={styles.billCardHeader}>
              <Ionicons name="flame-outline" size={24} color="#00b890" />
              <Text style={styles.billCardTitle}>Gas Bill</Text>
            </View>

            <View style={styles.billCardContent}>
              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Provider:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.gas.bill_provider}
                </Text>
              </View>

              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Period:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.gas.billing_period}
                </Text>
              </View>

              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Consumption:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.gas.consumption.value}{" "}
                  {billAnalysis.gas.consumption.unit}
                </Text>
              </View>

              <View style={styles.billInfo}>
                <Text style={styles.billLabel}>Amount:</Text>
                <Text style={styles.billValue}>
                  {billAnalysis.gas.amount.currency}{" "}
                  {billAnalysis.gas.amount.value}
                </Text>
              </View>

              {/* Sustainability Score */}
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Sustainability Score</Text>
                <View style={styles.scoreWrapper}>
                  <View
                    style={[
                      styles.scoreIndicator,
                      {
                        backgroundColor: getSustainabilityColor(
                          billAnalysis.gas.sustainability_score
                        ),
                        width: `${billAnalysis.gas.sustainability_score}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.scoreValue}>
                  {billAnalysis.gas.sustainability_score}/100
                </Text>
              </View>

              {/* Key Insights */}
              <Text style={styles.insightsTitle}>Key Insights:</Text>
              {billAnalysis.gas.key_insights.map((insight, index) => (
                <Text key={index} style={styles.insightText}>
                  • {insight}
                </Text>
              ))}

              {/* Recommendations */}
              <Text style={styles.insightsTitle}>Recommendations:</Text>
              {billAnalysis.gas.recommendations.map((rec, index) => (
                <Text key={index} style={styles.insightText}>
                  • {rec}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Bill Analysis Modal - COMPLETELY REDESIGNED */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Analyze Your Utility Bills</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.stepContainer}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Upload Your Bills</Text>
              </View>

              <View style={styles.uploadArea}>
                <View style={styles.uploadCard}>
                  <TouchableOpacity
                    style={[
                      styles.uploadButton,
                      image1 && styles.uploadButtonSelected,
                    ]}
                    onPress={() => pickImage(setImage1)}
                  >
                    {image1 ? (
                      <>
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color="#00b890"
                        />
                        <Text style={styles.uploadStatusText}>
                          Electricity Bill Added
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="flash-outline"
                          size={28}
                          color="#8A8D91"
                        />
                        <Text style={styles.uploadButtonText}>
                          Electricity Bill
                        </Text>
                        <View style={styles.uploadIconContainer}>
                          <Ionicons
                            name="cloud-upload-outline"
                            size={20}
                            color="#fff"
                          />
                        </View>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.uploadButton,
                      image2 && styles.uploadButtonSelected,
                    ]}
                    onPress={() => pickImage(setImage2)}
                  >
                    {image2 ? (
                      <>
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color="#00b890"
                        />
                        <Text style={styles.uploadStatusText}>
                          Gas Bill Added
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="flame-outline"
                          size={28}
                          color="#8A8D91"
                        />
                        <Text style={styles.uploadButtonText}>Gas Bill</Text>
                        <View style={styles.uploadIconContainer}>
                          <Ionicons
                            name="cloud-upload-outline"
                            size={20}
                            color="#fff"
                          />
                        </View>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.stepContainer}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Add Household Information</Text>
              </View>

              <View style={styles.formGroupContainer}>
                <View style={styles.formGroup}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="people-outline" size={20} color="#00b890" />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Family Size</Text>
                    <TextInput
                      placeholder="Enter number of members"
                      placeholderTextColor="#8A8D91"
                      value={familySize}
                      onChangeText={setFamilySize}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.inputIcon}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#00b890"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Region</Text>
                    <TextInput
                      placeholder="E.g., Mumbai, Delhi"
                      placeholderTextColor="#8A8D91"
                      value={region}
                      onChangeText={setRegion}
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.inputIcon}>
                    <Ionicons name="home-outline" size={20} color="#00b890" />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Carpet Area</Text>
                    <TextInput
                      placeholder="Area in square feet"
                      placeholderTextColor="#8A8D91"
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.noteContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#00b890"
                />
                <Text style={styles.noteText}>
                  Your bill data is securely processed and used only to provide
                  personalized insights and recommendations.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!image1 || !image2 || !familySize || !region) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={uploadData}
                disabled={!image1 || !image2 || !familySize || !region}
              >
                {!image1 || !image2 || !familySize || !region ? (
                  <Text style={styles.submitButtonText}>
                    Complete All Fields
                  </Text>
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Analyze Bills</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#fff"
                      style={styles.submitButtonIcon}
                    />
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },

  // Profile Section
  profileSection: {
    backgroundColor: "#131d2a",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00b890",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 14,
    color: "#8A8D91",
    marginTop: 4,
  },
  profileDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
  },

  // Analyze Button
  analyzeButton: {
    backgroundColor: "#00b890",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Bills Section
  billsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: "#131d2a",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  billCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#192539",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#243246",
  },
  billCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  billCardContent: {
    padding: 16,
  },
  billInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: "#8A8D91",
  },
  billValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  scoreContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#8A8D91",
    marginBottom: 8,
  },
  scoreWrapper: {
    height: 8,
    backgroundColor: "#243246",
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreIndicator: {
    height: "100%",
    borderRadius: 4,
  },
  scoreValue: {
    marginTop: 4,
    fontSize: 14,
    color: "#fff",
    textAlign: "right",
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
    lineHeight: 20,
  },

  // Modal Styles - Completely Redesigned
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#131d2a",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#243246",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#192539",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#243246",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalForm: {
    padding: 16,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00b890",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  uploadArea: {
    marginBottom: 16,
  },
  uploadCard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadButton: {
    backgroundColor: "#192539",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#243246",
    borderStyle: "dashed",
  },
  uploadButtonSelected: {
    borderColor: "#00b890",
    borderStyle: "solid",
    backgroundColor: "rgba(0, 184, 144, 0.1)",
  },
  uploadButtonText: {
    color: "#8A8D91",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  uploadStatusText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  uploadIconContainer: {
    backgroundColor: "#00b890",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  formGroupContainer: {
    backgroundColor: "#192539",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inputIcon: {
    width: 40,
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8A8D91",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#131d2a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 184, 144, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  noteText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: "#00b890",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#192539",
    borderWidth: 1,
    borderColor: "#243246",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButtonIcon: {
    marginLeft: 8,
  },
});

export default Account;
