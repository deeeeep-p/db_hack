import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";
import axios from "axios"; // Import axios

// Updated color scheme - consider centralizing COLORS if used in multiple components
const COLORS = {
  background: "#0a0f1a",
  surface: "#131d2a",
  primary: "#00d1b2",
  text: "#e0e0e0",
  gray: {
    100: "rgba(255, 255, 255, 0.08)",
    200: "rgba(255, 255, 255, 0.12)",
    300: "rgba(255, 255, 255, 0.16)",
  },
};

const styles = StyleSheet.create({
  challengeCard: {
    width: "100%",
    backgroundColor: "#131d2a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  challengeTitle: {
    color: "#e0e0e0",
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
  },
  challengeProgressText: {
    color: "#00b890",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
    width: "0%", // Initialize width to 0
  },
  stepCountText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

const Walking = ({ title, iconColor }) => {
  const [stepCount, setStepCount] = useState(0); // Initialize stepCount to 0
  const lastY = useRef(0);
  const isCounting = useRef(false);
  const lastTimestamp = useRef(0);
  const dataBuffer = useRef([]);
  const progressPercentage = (stepCount / 10000) * 100; // Example total steps as 10000
  const color = iconColor || "#3b82f6";
  const stepsSinceLastCall = useRef(0); // Counter for steps since last API call
  const userId = "67c3cf1766f888d598955e90"; // Hardcoded user ID - consider making this dynamic

  useEffect(() => {
    let subscription;

    const getInitialSteps = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/green/getSteps` // Correct URL to get steps for a specific user
        );
        if (response.data && response.data.steps !== undefined) {
          setStepCount(response.data.steps); // Initialize stepCount with fetched value
        } else {
          console.error("API response missing steps data:", response.data);
          // Optionally set a default stepCount or handle the error differently
          setStepCount(0); // Default to 0 if API response is invalid
        }
      } catch (error) {
        console.error("Error fetching initial steps:", error);
        // Consider setting a default stepCount or showing an error message to the user
        setStepCount(0); // Default to 0 on error
      }
    };

    const subscribe = async () => {
      const result = await Accelerometer.isAvailableAsync();
      if (result) {
        Accelerometer.setUpdateInterval(100);
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const timestamp = new Date().getTime();

          dataBuffer.current.push(y);
          if (dataBuffer.current.length > 10) {
            dataBuffer.current.shift();
          }

          const smoothedY =
            dataBuffer.current.reduce((sum, value) => sum + value, 0) /
            dataBuffer.current.length;

          // More sensitive threshold - decreased from 0.2 to 0.1
          const threshold = 0.1 + Math.abs(smoothedY - lastY.current) * 0.5;

          if (
            Math.abs(smoothedY - lastY.current) > threshold &&
            !isCounting.current &&
            timestamp - lastTimestamp.current > 500
          ) {
            isCounting.current = true;
            lastY.current = smoothedY;
            lastTimestamp.current = timestamp;
            setStepCount((prevStepCount) => {
              const newStepCount = prevStepCount + 1;
              stepsSinceLastCall.current += 1; // Increment counter

              if (stepsSinceLastCall.current >= 10) {
                // Make API call every 10 steps
                updateStepCountAPI(10);
                stepsSinceLastCall.current = 0; // Reset counter
              }
              return newStepCount;
            });
            setTimeout(() => {
              isCounting.current = false;
            }, 300);
          }
        });
      }
    };

    getInitialSteps(); // Fetch initial steps on component mount
    subscribe(); // Start accelerometer subscription

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const updateStepCountAPI = async (steps) => {
    try {
      const response = await axios.post(
        // Use axios.post
        `http://localhost:8000/green/updateSteps`, // Use userId in the path - corrected to updateSteps
        { stepsToAdd: steps.toString() }, // Send steps in the request body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Axios automatically throws an error for non-2xx status codes, so no need for response.ok check

      console.log("API call successful:", response.data.message); // Access message from response.data
    } catch (error) {
      // Axios provides more detailed error information in the 'error' object
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "API call failed:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error(
          "API request failed, no response received:",
          error.request
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up API request:", error.message);
      }
    }
  };

  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <View
          style={[
            styles.challengeIconContainer,
            { backgroundColor: `${color}20` },
          ]}
        >
          <FontAwesome5 name="walking" size={20} color={color} />
        </View>
        <Text style={styles.challengeTitle}>{title}</Text>
        {/* Removed progress/total text - displaying step count below progress bar now */}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%`, backgroundColor: color },
          ]}
        />
      </View>

      <Text style={styles.stepCountText}>Steps: {stepCount}</Text>
    </View>
  );
};

export default Walking;
