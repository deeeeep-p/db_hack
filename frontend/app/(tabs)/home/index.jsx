import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import LineChartComponent from "@/components/LineChart";
import ProjectCarousel from "@/components/ProjectCarousel";
import Svg, { Path, Circle, G, Text as SvgText } from "react-native-svg";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome5 for icons
import Walking from "../../../components/Walking";
import axios from "axios"; // Import axios for CarbonSavingsPieChart

// Updated color scheme
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

const CustomCard = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// Function to create the pie chart paths
const createPieChartPath = (centerX, centerY, radius, startAngle, endAngle) => {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

// Carbon Savings Pie Chart Component
const CarbonSavingsPieChart = () => {
  const [carbonData, setCarbonData] = useState([]); // State to hold carbon data
  const userId = "67c3cf1766f888d598955e90"; // Hardcoded user ID - replace with dynamic user ID

  // Animated value for scaling
  const scaleValue = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  useEffect(() => {
    const fetchCarbonFootprint = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/green/getCarbonFootprint` // Corrected URL with userId
        );
        const footprint = response.data.carbonFootprint;

        if (footprint) {
          const totalCarbonFootprint =
            footprint.travel + footprint.electricity + footprint.gas;

          const processedCarbonData = [
            {
              category: "Travel",
              percentage: (footprint.travel / totalCarbonFootprint) * 100 || 0,
              color: "#00b890",
            },
            {
              category: "Electricity",
              percentage:
                (footprint.electricity / totalCarbonFootprint) * 100 || 0,
              color: "#2a9d8f",
            },
            {
              category: "LPG Gas",
              percentage: (footprint.gas / totalCarbonFootprint) * 100 || 0,
              color: "#3a7ca5",
            },
          ];
          setCarbonData(processedCarbonData);
        } else {
          console.error("Carbon footprint data is missing in API response");
          setCarbonData([
            // Default data in case of API issue, or handle differently
            { category: "Travel", percentage: 45, color: "#00b890" },
            { category: "Electricity", percentage: 30, color: "#2a9d8f" },
            { category: "LPG Gas", percentage: 25, color: "#3a7ca5" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching carbon footprint data:", error);
        setCarbonData([
          // Default data in case of API issue, or handle differently
          { category: "Travel", percentage: 45, color: "#00b890" },
          { category: "Electricity", percentage: 30, color: "#2a9d8f" },
          { category: "LPG Gas", percentage: 25, color: "#3a7ca5" },
        ]);
      }
    };

    fetchCarbonFootprint();
    // Start animation when component mounts
    scaleValue.value = withTiming(1, { duration: 500 }); // Animate to scale 1 over 500ms
  }, []);

  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  let startAngle = 0;

  return (
    <View style={styles.pieChartContainer}>
      <Text style={styles.pieChartTitle}>Carbon Emission Breakdown</Text>

      <Animated.View style={[animatedStyle]}>
        <Svg height="300" width="300">
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius + 5}
            fill={COLORS.surface}
          />

          {/* Render pie slices */}
          {carbonData.map((item, index) => {
            const endAngle = startAngle + (item.percentage / 100) * 360;
            const pathData = createPieChartPath(
              centerX,
              centerY,
              radius,
              startAngle,
              endAngle
            );

            // Calculate position for the percentage label
            const midAngle = startAngle + (endAngle - startAngle) / 2;
            const midRad = ((midAngle - 90) * Math.PI) / 180;
            const labelRadius = radius * 0.65;
            const labelX = centerX + labelRadius * Math.cos(midRad);
            const labelY = centerY + labelRadius * Math.sin(midRad);

            // Save the end angle to use as the start angle for the next slice
            const currentStartAngle = startAngle;
            startAngle = endAngle;

            return (
              <G key={index}>
                <Path d={pathData} fill={item.color} />
                <SvgText
                  x={labelX}
                  y={labelY}
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {`${item.percentage.toFixed(1)}%`}
                </SvgText>
              </G>
            );
          })}

          {/* Center circle for donut effect */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.4}
            fill={COLORS.surface}
          />
        </Svg>
      </Animated.View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {carbonData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: item.color }]}
            />
            <Text style={styles.legendText}>{item.category}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Home() {
  const WEBHOOK_URL =
    "https://piyanshu.app.n8n.cloud/webhook/7e474783-7445-43b6-a753-c9ce141e082c";
  const scrollY = useSharedValue(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleConfirm = async () => {
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
      });

      Alert.alert("Success", `Event added for ${selectedDate}`);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add event");
    }
  };

  const busyDates = {
    "2025-02-10": { selected: true, selectedColor: "#064e3b" },
    "2025-02-15": { selected: true, selectedColor: "#064e3b" },
  };

  const portfolioStats = {
    totalInvested: 250000,
    totalReturns: 45000,
    carbonOffset: 34.5,
    projectCount: 12,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <LinearGradient
          colors={["#00d1b2", "#00b890", "#009b76", COLORS.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.3, 0.6, 1]}
          style={styles.headerGradient}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileTextContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.usernameText}>Deep</Text>
            </View>
            <TouchableHighlight
              onPress={() => router.push("(tabs)/home/account")}
              className="h-12 w-12 rounded-full bg-white/15 border-2 border-white/20 items-center justify-center"
            >
              <Text className="text-white text-lg font-semibold">IN</Text>
            </TouchableHighlight>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statsIconContainer}>
                  <Text style={styles.statsIcon}>🌱</Text>
                </View>
                <View>
                  <Text style={styles.statsLabel}>Carbon Offset</Text>
                  <Text style={styles.statsValue}>
                    {portfolioStats.carbonOffset}kg
                  </Text>
                </View>
                <View style={styles.statsPercentageContainer}>
                  <Text style={styles.statsPercentage}>+12.3%</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Your Stats</Text>
              <Text style={styles.statsViewAll}>View All</Text>
            </View>
            <View style={styles.carouselContainer}>
              <ProjectCarousel />
            </View>
          </View>

          {/* Carbon Impact */}
          <CustomCard style={styles.carbonImpactCard}>
            <View style={styles.carbonImpactHeader}>
              <View>
                <Text style={styles.carbonImpactLabel}>Total Impact</Text>
                <Text style={styles.carbonImpactTitle}>Carbon Impact</Text>
              </View>
              <View style={styles.carbonImpactPercentageContainer}>
                <Text style={styles.carbonImpactPercentage}>+12.5%</Text>
              </View>
            </View>

            {/* Chart Container */}
            <View style={styles.chartContainer}>
              <LineChartComponent />
            </View>
          </CustomCard>

          {/* Carbon Savings Breakdown Pie Chart */}
          <CustomCard style={styles.pieChartCard}>
            <CarbonSavingsPieChart />
          </CustomCard>

          {/* Challenge Card */}
          <Walking
            title={"Daily Steps"}
            progress={7500}
            total={10000}
            iconColor={"#3b82f6"} // Pass the iconColor prop
          />
        </View>
      </ScrollView>

      {/* Event Popup Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Event Date</Text>

            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                ...busyDates,
                [selectedDate]: {
                  selected: true,
                  selectedColor: COLORS.primary,
                },
              }}
              theme={{
                backgroundColor: COLORS.surface,
                calendarBackground: COLORS.surface,
                textSectionTitleColor: "rgba(255,255,255,0.6)",
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: "#ffffff",
                todayTextColor: COLORS.primary,
                dayTextColor: COLORS.text,
                arrowColor: COLORS.primary,
                monthTextColor: COLORS.text,
                textDisabledColor: "rgba(255,255,255,0.2)",
              }}
            />

            {/* Confirmation Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
                disabled={!selectedDate}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  card: {
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    marginTop: 4,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 48,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profileTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 24,
  },
  usernameText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  profileButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  statsContainer: {
    gap: 16,
  },
  statsCard: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(20px)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 209, 178, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statsIcon: {
    color: "#00d1b2",
    fontSize: 24,
  },
  statsLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "600",
  },
  statsValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  statsPercentageContainer: {
    backgroundColor: "rgba(0, 209, 178, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsPercentage: {
    color: "#00d1b2",
    fontSize: 14,
    fontWeight: "500",
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  statsSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e0e0e0",
  },
  statsViewAll: {
    fontSize: 14,
    color: "#00d1b2",
  },
  carouselContainer: {
    flex: 1,
    overflow: "visible",
  },
  carbonImpactCard: {
    marginBottom: 24,
    marginTop: 16,
  },
  carbonImpactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  carbonImpactLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginBottom: 4,
  },
  carbonImpactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  carbonImpactPercentageContainer: {
    backgroundColor: "rgba(0, 209, 178, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  carbonImpactPercentage: {
    color: "#00d1b2",
    fontSize: 14,
    fontWeight: "500",
  },
  chartContainer: {
    width: "100%",
    overflow: "hidden",
  },
  pieChartCard: {
    marginBottom: 24,
  },
  pieChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  pieChartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e0e0e0",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: "#e0e0e0",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#131d2a",
    padding: 20,
    borderRadius: 16,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "#00d1b2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});
