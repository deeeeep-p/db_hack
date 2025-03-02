import {
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

import { useLocalSearchParams } from "expo-router";
import { ProgressBar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Linking, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "react-native-feather";
import { Video } from "react-native-feather";
import { ThumbsUp, ThumbsDown } from "react-native-feather";
import { Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const impactIcons = {
  carbonReduction: { icon: "cloud", color: "#4CAF50" }, // Green
  householdsBenefited: { icon: "home", color: "#3F51B5" }, // Blue
  roi: { icon: "chart-line", color: "#FF9800" }, // Orange
  longTermSustainability: { icon: "sync-alt", color: "#9C27B0" }, // Purple
};

const theme = {
  background: "#0a0f1a", // Darker background
  surface: "#131d2a", // Darker card surface
  primary: "#00d8a0", // Adjusted green shade
  primaryTransparent: "rgba(0, 216, 160, 0.1)", // Adjusted transparent green
  inactive: "#7a8ca2", // Slightly muted inactive color
  shadow: "#000",
};

const contact = {
  email: "example@example.com",
  linkedin: "https://www.linkedin.com/company/solar-energy-projects-zw",
  instagram: "https://www.instagram.com/primegridsolar",
};
// Dummy Data (same as before)
const dummyProjects = {
  "650f94bfc7e89f001d1e4e5a": {
    name: "Solar Grid for Green Town",
    description:
      "A community-driven solar power project aiming to transform Green Town's energy infrastructure. This innovative initiative will install solar panels across public buildings and residential areas, creating a sustainable micro-grid that reduces dependency on fossil fuels while lowering electricity costs for locals. The project will implement the latest photovoltaic technology, ensuring maximum efficiency and durability in various weather conditions. Community members will receive training on basic maintenance, creating local green jobs and fostering a sense of ownership. The environmental impact extends beyond carbon reduction, as it will demonstrate the viability of renewable energy in similar communities across the region.",
    targetAmount: 50000,
    raisedAmount: 32000,
    location: "Green Town, India",
    impactMetrics: {
      carbonReduction: "100 tons/year",
      householdsBenefited: 150,
      roi: "12%",
      trustScore: "8.5/10",
    },
    investors: ["Priya", "Rahul", "Anita", "+154 others"],
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9I5m26BeOtJX4wwWXvp0bD0go3kmRDx6RLQ&s",
    daysLeft: 15,
    contact: {
      email: "example@example.com",
      linkedin: "https://www.linkedin.com/company/solar-energy-projects-zw",
      instagram: "https://www.instagram.com/primegridsolar",
    },
  },
  "650f94bfc7e89f001d1e4e5b": {
    name: "Wind Energy Project",
    description:
      "A community-driven solar power project aiming to transform Green Town's energy infrastructure. This innovative initiative will install solar panels across public buildings and residential areas, creating a sustainable micro-grid that reduces dependency on fossil fuels while lowering electricity costs for locals. The project will implement the latest photovoltaic technology, ensuring maximum efficiency and durability in various weather conditions. Community members will receive training on basic maintenance, creating local green jobs and fostering a sense of ownership. The environmental impact extends beyond carbon reduction, as it will demonstrate the viability of renewable energy in similar communities across the region.",
    targetAmount: 75000,
    raisedAmount: 50000,
    location: "Blue City, India",
    impactMetrics: {
      carbonReduction: "150 tons/year",
      householdsBenefited: 200,
      roi: "10%",
      trustScore: "9/10",
    },
    investors: ["Amit", "Neha", "Karan", "+230 others"],
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTK-W-QAu_Gpf7GW7m21q8wSPUMATtrlzw_w&s",
    daysLeft: 20,
    contact: {
      email: "example@example.com",
      linkedin: "https://www.linkedin.com/company/wind-energy-holding-co-ltd",
      instagram: "https://www.instagram.com/windenergyy",
    },
  },
};

const openSocialLink = async (url) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert("Error", "Cannot open the link.");
  }
};

const calculateSatisfactionScore = (likes, dislikes) => {
  const totalFeedback = likes + dislikes;
  return totalFeedback > 0 ? (likes / totalFeedback) * 100 : 0;
};

// Function to determine color based on satisfaction score
const getSatisfactionColor = (score) => {
  if (score < 50) {
    return "text-red-500"; // Low
  } else if (score >= 50 && score < 80) {
    return "text-yellow-500"; // Normal
  } else {
    return "text-green-500"; // High
  }
};

const MeetingSummaryCard = ({ likes, dislikes }) => {
  // Calculate satisfaction score
  const satisfactionScore = calculateSatisfactionScore(likes, dislikes);

  // Determine color based on score
  const scoreColor = getSatisfactionColor(satisfactionScore);

  return (
    <View className="bg-[#1e293b] p-4 rounded-lg my-4">
      <Text className="text-white text-lg font-medium mb-2">
        Meeting Summary
      </Text>

      <View className="flex-row justify-between items-center">
        {/* Left Side: Likes and Dislikes */}
        <View>
          <Text className="text-gray-400">
            Likes: <Text className="text-white">{likes}</Text>
          </Text>
          <Text className="text-gray-400">
            Dislikes: <Text className="text-white">{dislikes}</Text>
          </Text>
        </View>

        {/* Right Side: Satisfaction Score */}
        <View className="items-end">
          <Text className="text-gray-400">Satisfaction Score</Text>
          <Text className={`text-2xl font-bold ${scoreColor}`}>
            {satisfactionScore.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const ProjectDetails = () => {
  const { name } = useLocalSearchParams();
  const [project, setProject] = useState(null);
  const [progresss, setProgress] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(0);
  const specificProjectId = "67b17f1722307e215e0e56f"; // Replace with your specific project ID
  const specificPhaseIndex = 0; // Replace with your specific phase index
  const [investModalVisible, setInvestModalVisible] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");

  // Check if the current project and phase match the specific ones
  const showDislikeButton =
    project?._id === specificProjectId && selectedPhase === specificPhaseIndex;

  const statusColors = {
    completed: "#00b890",
    "in-progress": "#f39c12",
    pending: "#95a5a6",
  };
  const handleMeetingVideo = () => {
    // Open the meeting video link
    const meetUri = progresss[selectedPhase].meetUri;

    Linking.openURL(meetUri).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };
  const handleViewReport = () => {
    // Get the reportUri for the currently selected phase
    const reportUri = progresss[selectedPhase].reportUri;

    // Open the document using the URL
    Linking.openURL(reportUri).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace("-", " ");
  };

  const handlePayment = async () => {
    if (!investmentAmount || isNaN(investmentAmount) || investmentAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid investment amount");
      return;
    }

    if (
      !project ||
      !project.name ||
      !project.investors ||
      project.investors.length === 0
    ) {
      Alert.alert("Error", "Project details are missing or no investors found");
      return;
    }

    try {
      // Step 2: Send funding request
      const fundResponse = await fetch("http://localhost:8000/project/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projName: project.name,

          fundAmt: parseFloat(investmentAmount),
        }),
      });

      const fundData = await fundResponse.json();

      if (!fundResponse.ok) {
        throw new Error(fundData.error || "Funding failed");
      }

      console.log("Funding successful:", fundData);
      Alert.alert("Success", `Investment of ₹${investmentAmount} successful!`);

      // Reset modal and input

      const options = {
        description: "Sample Payment",
        image: "https://your-company-logo.png",
        currency: "INR",
        key: "rzp_test_8UI7bsbK3t9prX", // Replace with your actual key
        amount: `${investmentAmount * 100}`, // Amount in paise (10000 = ₹100)
        name: `${project.name}`,
        prefill: {
          email: "user@example.com",
          contact: "9999999999",
          name: "John Doe",
        },
        theme: { color: "#F37254" },
      };

      RazorpayCheckout.open(options)
        .then((data) => {
          Alert.alert(
            "Payment Successful",
            `Payment Id: ${data.razorpay_payment_id}`
          );
        })
        .catch((error) => {
          Alert.alert("Payment Successful!", error.description);
        });
      setInvestModalVisible(false);
      setInvestmentAmount("");
    } catch (error) {
      console.error("Error in funding:", error);
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/login/project/${name}`
        );
        const data = await response.json();

        if (response.ok && data.project) {
          setProject(data.project); // ✅ Set project using nested object
          setProgress(data.project.progress);
        } else {
          console.error("Project not found:", data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (name) {
      fetchProject();
    }
  }, [name]);

  const handleDislike = async () => {
    try {
      const res = await fetch(
        "https://piyanshu.app.n8n.cloud/webhook/8d8dd1ac-c475-4716-a578-0cca33b3183b",
        {
          method: "POST",
        }
      );
      console.log(res);

      // Update the dislikes count
      const updatedProgresss = [...progresss];
      updatedProgresss[selectedPhase].meetDislikes += 1;
      setProgress(updatedProgresss);

      // Calculate the new satisfaction score
      const newLikes = updatedProgresss[selectedPhase].meetLikes;
      const newDislikes = updatedProgresss[selectedPhase].meetDislikes;
      const newScore = calculateSatisfactionScore(newLikes, newDislikes);

      // Show an alert if the score is low
      if (newScore < 50) {
        Alert.alert(
          "Low Satisfaction Score",
          `The satisfaction score is now ${newScore.toFixed(
            1
          )}%, which is considered low.`
        );

        // Call the refund API
        const response = await fetch(
          `http://192.168.39.152:5002/refund/${project.name}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          Alert.alert("Refund Successful", result.message);
        } else {
          Alert.alert("Refund Failed", result.message);
        }
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      Alert.alert("Error", "Failed to process refund. Please try again.");
    }
  };

  if (!project) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg font-bold text-red-500">
          Project Not Found
        </Text>
      </View>
    );
  }

  const progress = project.raisedAmount / project.fundingGoal;
  const renderProgressBar = (progress) => {
    return (
      <View style={styles.customProgressContainer}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    );
  };
  const togglePhase = (phaseIndex) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseIndex)
        ? prev.filter((index) => index !== phaseIndex)
        : [...prev, phaseIndex]
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      className="flex-1"
    >
      {/* Hero Section with Faded Image */}
      <View className="relative rounded-b-3xl overflow-hidden">
        <ImageBackground
          source={{ uri: project.imageUri }}
          className="w-full h-72"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            className="absolute bottom-0 left-0 right-0 h-24"
          />
        </ImageBackground>

        {/* Overlapping Title Card */}
        <View className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <Text className="text-3xl font-pbold text-white shadow-text">
            {project.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-white mr-2">
              📍 Mumbai, Maharashtra
            </Text>
          </View>
        </View>
      </View>

      {/* Project Details */}
      <View className="p-5 space-y-6">
        {/* Trust Score and Funding Progress */}
        <View style={styles.fundingSection}>
          <View style={styles.fundingHeader}>
            <Text style={[styles.raisedAmount, { color: "#ffffff" }]}>
              ₹{project.raisedAmount.toLocaleString()}
            </Text>
            <Text style={[styles.targetAmount, { color: theme.inactive }]}>
              / ₹{project.fundingGoal.toLocaleString()}
            </Text>
          </View>

          {renderProgressBar(progress)}

          <View style={styles.fundingFooter}>
            <View style={styles.timeRemaining}>
              <Icon name="clock" size={12} color={theme.inactive} />
              <Text style={[styles.daysLeft, { color: theme.inactive }]}>
                15 days left
              </Text>
            </View>

            <View style={styles.investors}>
              <View style={styles.avatarStack}>
                {[0, 1, 2].map((index) => (
                  <View
                    key={index}
                    style={[
                      styles.avatarWrapper,
                      {
                        right: index * 12,
                        backgroundColor: theme.surface,
                      },
                    ]}
                  >
                    <Image
                      source={{
                        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmI57giWxjA-WXBTE7HIzLV0Y9YcEnxIyrCQ&s",
                      }}
                      style={styles.avatar}
                    />
                  </View>
                ))}
              </View>
              <Text style={[styles.investorCount, { color: theme.inactive }]}>
                +220 others
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.detailsButton, { backgroundColor: theme.primary }]}
          onPress={() => setInvestModalVisible(true)}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>
            Invest
          </Text>
        </TouchableOpacity>

        {/* Description */}
        <View>
          <Text className="text-xl font-bold text-white my-3">
            About This Project
          </Text>
          <Text
            style={[styles.description, { color: "#c3cfe2" }]}
            className="text-base text-white leading-7 tracking-wide"
          >
            {project.description}
          </Text>
        </View>

        <Text className="text-white text-2xl font-semibold my-6">
          Project Progress
        </Text>

        <View className="p-4 bg-[#131d2a] flex-1">
          {/* Phase Tabs */}
          <View className="flex-row mb-6">
            {progresss.map((phase, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-1 items-center pb-2 border-b-2 ${
                  selectedPhase === index
                    ? "border-[#00b890]"
                    : "border-transparent"
                }`}
                onPress={() => setSelectedPhase(index)}
              >
                <Text
                  className={`text-white text-lg ${
                    selectedPhase === index ? "text-[#00b890] font-bold" : ""
                  }`}
                >
                  P{index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="bg-[#1e293b] p-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center">
              {/* Left Side: Meeting Details */}
              <View>
                <Text className="text-white text-lg font-medium">
                  Recent Meeting
                </Text>
                <Text className="text-gray-400 text-sm">
                  27/ 02/ 2025 , MONDAY
                </Text>
              </View>

              {/* Right Side: Meeting Icon Button */}
              <TouchableOpacity
                className="p-2 bg-[#00b890] rounded-full"
                onPress={handleMeetingVideo}
              >
                <Video stroke="#ffffff" width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Table for Selected Phase */}
          <View className="bg-[#1e293b] rounded-lg overflow-hidden">
            <View className="flex-row justify-between p-4 bg-[#2d3a4b]">
              <Text className="text-white font-bold">Task</Text>
              <Text className="text-white font-bold">Status</Text>
            </View>
            <ScrollView>
              {progresss[selectedPhase].tasks.map((task, taskIndex) => (
                <View
                  key={taskIndex}
                  className="flex-row justify-between items-center p-4 border-b border-[#2d3a4b]"
                >
                  <Text
                    className="text-white flex-1 mr-2"
                    numberOfLines={1}
                    ellipsizeMode="tail" // Truncate with an ellipsis
                  >
                    {task.title}
                  </Text>

                  {/* Task Status */}
                  <View
                    className="px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${statusColors[task.status]}20`,
                      minWidth: 80, // Fixed width for status
                      alignItems: "center", // Center text horizontally
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: statusColors[task.status] }}
                    >
                      {capitalizeFirstLetter(task.status)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className="flex-row justify-end mt-4 space-x-4">
              {/* Like Icon (Non-clickable) */}
              {showDislikeButton && (
                <View className="flex-row items-center">
                  <ThumbsUp stroke="#00b890" width={24} height={24} />
                </View>
              )}

              {/* Dislike Icon (Clickable) */}
              {showDislikeButton && (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={handleDislike}
                >
                  <ThumbsDown stroke="#ff4444" width={24} height={24} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <MeetingSummaryCard
            likes={progresss[selectedPhase].meetLikes}
            dislikes={progresss[selectedPhase].meetDislikes}
          />
          <TouchableOpacity
            className="mt-4 bg-[#00b890] p-3 rounded-lg items-center"
            onPress={handleViewReport} // Use the URL from the selected phase
          >
            <Text className="text-white font-bold">View Phase Report</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-pbold text-white my-5">
          Project Impact
        </Text>
        {/* Impact Metrics Cards */}
        <View className="flex-row flex-wrap justify-between">
          {Object.entries(
            dummyProjects["650f94bfc7e89f001d1e4e5a"].impactMetrics
          ).map(([key, value]) => (
            <View
              key={key}
              style={[styles.card, { backgroundColor: theme.surface }]}
              className="w-[48%] h-32 bg-gray-100 border border-gray-800 p-5 rounded-xl shadow-md flex-col items-center justify-center"
            >
              {/* Icon */}
              <FontAwesome5
                name={impactIcons[key]?.icon || "info-circle"}
                size={28}
                color={impactIcons[key]?.color || "#6B7280"}
                className="mb-3"
              />

              {/* Text Content */}
              <Text
                style={[styles.description, { color: "#c3cfe2" }]}
                className="text-xs uppercase font-medium tracking-wide text-gray-700 text-center"
              >
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Text>
              <Text className="text-lg font-semibold text-white text-center mt-1">
                {value}
              </Text>
            </View>
          ))}
        </View>

        <View className="pb-3">
          <Text className="text-xl font-bold text-white mb-3">
            Contact for More Info
          </Text>
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity
              onPress={() =>
                openSocialLink(contact.email ? `mailto:${contact.email}` : "#")
              }
            >
              <FontAwesome name="envelope" size={24} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openSocialLink(contact.linkedin)}>
              <FontAwesome name="linkedin" size={24} color="#0077b5" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openSocialLink(contact.instagram)}>
              <FontAwesome name="instagram" size={24} color="#C13584" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={investModalVisible}
        onRequestClose={() => setInvestModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-[#00000099]">
          <View className="bg-[#131d2a] p-6 rounded-t-3xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-white">
                Invest in {project.name}
              </Text>
              <TouchableOpacity onPress={() => setInvestModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-[#0a0f1a] text-white p-4 rounded-lg mb-6"
              placeholder="Enter amount (₹)"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={investmentAmount}
              onChangeText={setInvestmentAmount}
            />

            <TouchableOpacity
              className="bg-[#00b890] p-4 rounded-lg items-center"
              onPress={handlePayment}
            >
              <Text className="text-white font-bold">Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  card: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  cardContent: {
    padding: 20,
  },
  topSection: {
    marginBottom: 20,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 16,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  trustScore: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  location: {
    fontSize: 13,
    marginBottom: 10,
  },
  description: {
    color: "#c3cfe2",
  },
  imageSection: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  projectImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  overlayStats: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 25, 36, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statText: {
    color: "#ffffff",
    fontSize: 12,
    marginLeft: 4,
  },
  fundingSection: {
    marginBottom: 20,
  },
  fundingHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  raisedAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  targetAmount: {
    fontSize: 14,
    marginLeft: 4,
  },
  customProgressContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00ffcc",
    borderRadius: 2,
  },
  fundingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeRemaining: {
    flexDirection: "row",
    alignItems: "center",
  },
  daysLeft: {
    fontSize: 13,
    marginLeft: 4,
  },
  investors: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarStack: {
    flexDirection: "row",
    width: 36,
    height: 24,
    position: "relative",
  },
  avatarWrapper: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  investorCount: {
    fontSize: 13,
    marginLeft: 12,
  },
  detailsButton: {
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
});

export default ProjectDetails;
