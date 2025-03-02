import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Linking } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const BookingPage = () => {
  const { selectedLegs, amount } = useLocalSearchParams();
  const [legs, setLegs] = useState([]);
  const [bookingAmount, setBookingAmount] = useState(null);

  useEffect(() => {
    if (selectedLegs) {
      setLegs(JSON.parse(selectedLegs));
    }
    if (amount) {
      setBookingAmount(amount);
    }
  }, [selectedLegs, amount]);

  const formatDuration = (duration) => {
    const minutes = Math.round(duration / 60);
    return `${minutes} min`;
  };

  const renderIcon = (mode) => {
    switch (mode) {
      case "WALK":
        return <FontAwesome name="male" size={24} color="#9ca3af" />;
      case "RAIL":
        return <MaterialIcons name="train" size={24} color="#38bdf8" />;
      case "BUS":
        return <FontAwesome name="bus" size={24} color="#fbbf24" />;
      case "SUBWAY":
        return <FontAwesome name="subway" size={24} color="#c084fc" />;
      default:
        return <FontAwesome name="question" size={24} color="#ef4444" />;
    }
  };

  const handlePayment = async () => {
    const upiID = "deeppatel223204@okicici";
    const payeeName = "Deep Patel";
    const transactionRef = `TXN_${Date.now()}`;
    const transactionNote = "Booking Payment";
    const sendingAmt = bookingAmount || "0.00";

    const paymentUrl = `upi://pay?pa=${upiID}&pn=${payeeName}&am=${sendingAmt}&cu=INR&tn=${transactionNote}&tr=${transactionRef}`;

    try {
      // Check if UPI apps are installed
      const supported = await Linking.canOpenURL(paymentUrl);
      if (!supported) {
        Alert.alert(
          "Error",
          "No UPI apps installed on your device. Please install one and try again."
        );
        return;
      }

      // Open UPI payment URL
      await Linking.openURL(paymentUrl);

      // Increment trips count after successful payment initiation
      const incrementResponse = await fetch(
        "http://localhost:8000/login/incrementtrips",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: "67c3cf1766f888d598955e90" }), // Hardcoded user ID
        }
      );

      if (!incrementResponse.ok) {
        throw new Error("Failed to increment trips");
      }

      const incrementData = await incrementResponse.json();
      console.log("Trips incremented:", incrementData);

      // Redirect to tickets page after a short delay
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/travel/tickets",
          params: { legz: JSON.stringify(legs) },
        });
      }, 500);
    } catch (err) {
      console.error("Payment or increment failed:", err);
      Alert.alert("Error", "Failed to complete payment or update trips.");
    }
  };

  const renderLegCard = (leg, index) => (
    <View
      key={index}
      className="bg-[#131d2a] rounded-2xl p-5 shadow-lg border border-[#1e2b3a] mb-4"
    >
      {/* Mode and Duration Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center flex-1">
          <View className="p-2.5 bg-[#0a0f1a] rounded-lg">
            {renderIcon(leg.mode)}
          </View>
          <Text
            className="ml-3 font-semibold text-white text-lg flex-1"
            numberOfLines={1}
          >
            {leg.mode === "WALK" ? "Walking" : leg.route || leg.mode}
          </Text>
        </View>
        <View className="bg-[#0a0f1a] px-4 py-1.5 rounded-full">
          <Text className="text-gray-400 font-medium">
            {formatDuration(leg.duration)}
          </Text>
        </View>
      </View>

      {/* Stations */}
      <View className="space-y-4">
        {/* From Station */}
        <View className="flex-row items-center">
          <View className="mr-3">
            <FontAwesome name="circle" size={12} color="#38bdf8" />
          </View>
          <View className="flex-1">
            <Text
              className="text-gray-200 font-medium text-base"
              numberOfLines={2}
            >
              {leg.from.name}
            </Text>
          </View>
        </View>

        {/* Vertical Line */}
        <View className="ml-[5.5px] h-8 border-l-2 border-dashed border-gray-600" />

        {/* To Station */}
        <View className="flex-row items-center">
          <View className="mr-3">
            <FontAwesome name="circle" size={12} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text
              className="text-gray-200 font-medium text-base"
              numberOfLines={2}
            >
              {leg.to.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Distance */}
      <View className="mt-5 flex-row justify-end">
        <View className="bg-[#0a0f1a] px-4 py-1.5 rounded-full">
          <Text className="text-gray-400 text-sm font-medium">
            {leg.distance > 1000
              ? `${(leg.distance / 1000).toFixed(1)} km`
              : `${Math.round(leg.distance)} m`}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0f1a]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Section */}
        <View className="px-5 py-6 bg-[#131d2a] border-b border-[#1e2b3a]">
          <Text className="text-2xl font-bold text-white">Booking Summary</Text>
          <Text className="text-sm text-gray-400 mt-1">
            Review your journey details below
          </Text>
        </View>

        {/* Journey Cards Container */}
        <View className="px-4 pt-4">
          {legs.map((leg, index) => renderLegCard(leg, index))}
        </View>

        {/* Price Card */}
        <View className="px-4 pb-4">
          <View className="bg-[#131d2a] rounded-2xl p-5 shadow-lg border border-[#1e2b3a]">
            <Text className="text-gray-400 text-sm font-medium">
              Total Amount
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-3xl font-bold text-white">
                ₹{bookingAmount}
              </Text>
              <Text className="ml-2 text-gray-400 text-sm">via UPI</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Payment Button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-[#131d2a] border-t border-[#1e2b3a]">
        <TouchableOpacity
          onPress={handlePayment}
          className="bg-[#00b890] py-4 rounded-xl items-center shadow-sm active:bg-[#00a07d]"
        >
          <Text className="text-white font-semibold text-lg">
            Pay ₹{bookingAmount}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingPage;
