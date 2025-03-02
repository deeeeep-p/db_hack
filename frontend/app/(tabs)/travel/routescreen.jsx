import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import RouteCard from "../../../components/ui/RouteCard";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import RouteCardOla from "../../../components/ui/RouteCardOla";

const addCarbonEmissions = (data) => {
  const carbonEmissionRates = {
    WALK: 0,
    RAIL: 0.041,
    SUBWAY: 0.036,
    BUS: 0.089,
  };

  const calculateCarbonEmissions = (itinerary) => {
    let totalEmissions = 0;

    itinerary.legs.forEach((leg) => {
      const mode = leg.mode;
      const distanceKm = leg.distance / 1000;
      const emissions = distanceKm * carbonEmissionRates[mode];
      totalEmissions += emissions;
    });

    return Number(totalEmissions.toFixed(3));
  };

  data.plan.itineraries.forEach((itinerary) => {
    itinerary.carbonEmission = calculateCarbonEmissions(itinerary);
  });

  return data;
};

const addItineraryCosts = (data) => {
  const modeCosts = {
    WALK: 0,
    RAIL: 5,
    SUBWAY: 4,
    BUS: 6,
  };

  const calculateItineraryCost = (itinerary) => {
    let totalCost = 0;

    itinerary.legs.forEach((leg) => {
      const mode = leg.mode;
      const distanceKm = leg.distance / 1000;
      const cost = distanceKm * modeCosts[mode];
      totalCost += cost;
    });

    return Number(totalCost.toFixed(0));
  };

  data.plan.itineraries.forEach((itinerary) => {
    itinerary.totalCost = calculateItineraryCost(itinerary);
  });

  return data;
};

const RoutesScreen = () => {
  console.log(process.env.EXPO_PUBLIC_machine_ip);
  const [selectedTab, setSelectedTab] = useState("greenest");
  const { startLatLng, endLatLng } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);
  const [carRoute, setCarRoute] = useState([]);

  let startLat, startLng, endLat, endLng;
  try {
    [startLat, startLng] = JSON.parse(startLatLng || "[]");
    [endLat, endLng] = JSON.parse(endLatLng || "[]");
  } catch {
    setError("Invalid coordinates provided.");
    return null;
  }

  const API_URL = `http://localhost:8080/otp/routers/default/plan?fromPlace=${startLat}%2C${startLng}&toPlace=${endLat}%2C${endLng}&date=2025-02-10&time=09:00:00&arriveBy=false&mode=TRANSIT%2CWALK&maxWalkDistance=1000&numItineraries=10`;
  console.log(API_URL);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get(API_URL);

        const olamapsResponse = await axios.post(
          `https://api.olamaps.io/routing/v1/directions/basic?origin=${startLat}%2C${startLng}&destination=${endLat}%2C${endLng}&alternatives=false&steps=true&overview=full&language=en&api_key=am3K573hJ9mGtTnilRWVNUv1SMhdMeXhr6LvMaGK`,
          null,
          {
            headers: {
              accept: "application/json",
              origin: "http://localhost:8082",
            },
          }
        );

        setCarRoute(olamapsResponse.data);
        resData = addItineraryCosts(addCarbonEmissions(response.data));
        console.log(resData);
        if (resData?.plan?.itineraries) {
          setRoutes(resData.plan.itineraries);
        } else {
          throw new Error("No itineraries found in the response.");
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Failed to load routes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (startLat && startLng && endLat && endLng) {
      fetchRoutes();
    } else {
      setError("Missing or invalid start/end locations.");
      setIsLoading(false);
    }
  }, [startLat, startLng, endLat, endLng]);

  useEffect(() => {
    if (selectedTab === "greenest") {
      setRoutes((prevRoutes) =>
        [...prevRoutes].sort((a, b) => a.carbonEmission - b.carbonEmission)
      );
    }
    if (selectedTab === "quickest") {
      setRoutes((prevRoutes) =>
        [...prevRoutes].sort((a, b) => a.duration - b.duration)
      );
    }
  }, [selectedTab]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00b890" />
        <Text style={styles.loadingText}>Loading routes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row justify-around mt-2 mb-2 pb-2">
        <TouchableOpacity
          onPress={() => setSelectedTab("greenest")}
          className={`px-4 py-2 rounded-full ${
            selectedTab === "greenest" ? "bg-primary" : "bg-surface"
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              selectedTab === "greenest" ? "text-white" : "text-gray-300"
            }`}
          >
            Greenest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("quickest")}
          className={`px-4 py-2 rounded-full ${
            selectedTab === "quickest" ? "bg-primary" : "bg-surface"
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              selectedTab === "quickest" ? "text-white" : "text-gray-300"
            }`}
          >
            Quickest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("cheapest")}
          className={`px-4 py-2 rounded-full ${
            selectedTab === "cheapest" ? "bg-primary" : "bg-surface"
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              selectedTab === "cheapest" ? "text-white" : "text-gray-300"
            }`}
          >
            Cheapest
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === "quickest" && (
        <>
          <RouteCardOla route={carRoute} />
        </>
      )}
      {routes.map((route, idx) => (
        <RouteCard
          key={idx}
          route={route}
          start={startLatLng}
          end={endLatLng}
        />
      ))}
      {!(selectedTab === "quickest") && (
        <>
          <RouteCardOla route={carRoute} />
        </>
      )}
      {routes.length === 0 && (
        <Text style={styles.errorText}>No routes available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0f1a",
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#00b890",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
});

export default RoutesScreen;