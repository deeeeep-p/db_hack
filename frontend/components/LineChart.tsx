import React from "react";
import { View, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const LineChartComponent = () => {
  // Get the current month (January is 0, February is 1, etc.)
  const currentMonth = new Date().getMonth();

  // Define month labels
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Adjust the labels to show the last 6 months
  const getLastSixMonthsLabels = () => {
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - 1 - i + 12) % 12; // Handle wrapping around to the previous year
      labels.push(monthLabels[monthIndex]);
    }
    return labels;
  };

  const lastSixMonthsLabels = getLastSixMonthsLabels();

  // Example data for the last 6 months
  const monthlyData = [20, 25, 28, 32, 36, 34.5]; // Replace with your actual data

  const COLORS = {
    background: "#0a0f1a",
    surface: "#131d2a",
    primary: "#00d8a0",
    text: "#ffffff",
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: lastSixMonthsLabels, // Dynamically generated labels for the last 6 months
          datasets: [{ data: monthlyData }], // Example data
        }}
        width={350}
        height={200}
        chartConfig={{
          backgroundColor: COLORS.surface,
          backgroundGradientFrom: COLORS.surface,
          backgroundGradientTo: COLORS.surface,
          color: (opacity = 1) => `rgba(0, 255, 155, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
  },
});

export default LineChartComponent;
