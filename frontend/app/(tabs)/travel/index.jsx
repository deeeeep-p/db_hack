import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import axios from "axios";
import * as Location from "expo-location";
import { router } from "expo-router";

// App color scheme
const COLORS = {
  background: "#0a0f1a",
  surface: "#131d2a",
  primary: '#00b890',
  text: '#e0e0e0',
  gray: {
    100: 'rgba(255, 255, 255, 0.08)',
    200: 'rgba(255, 255, 255, 0.12)',
    300: 'rgba(255, 255, 255, 0.16)',
  }
};

// Debounce utility
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const Travel = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState("");
  const [startLatLng, setStartLatLng] = useState(null);
  const [endLatLng, setEndLatLng] = useState(null);

  const API_KEY = process.env.EXPO_PUBLIC_ola_api; 
  const BASE_URL = "https://api.olamaps.io/places/v1/autocomplete";

  console.log(API_KEY);

  // Fetch location suggestions
  const fetchSuggestions = async (input) => {
    try {
      if (!input) {
        setSuggestions([]);
        return;
      }

      const requestId = uuid.v4();
      const correlationId = uuid.v4();
      const response = await axios.get(BASE_URL, {
        headers: {
          "X-Request-Id": requestId,
          "X-Correlation-Id": correlationId,
          Origin: "http://localhost:8082",
        },
        params: { input, api_key: API_KEY },
      });

      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  const handleInputChange = (text, inputType) => {
    if (inputType === "from") setFromLocation(text);
    else setToLocation(text);

    setActiveInput(inputType);
    debouncedFetchSuggestions(text);
  };

  const handleClearInput = (inputType) => {
    if (inputType === "from") {
      setFromLocation("");
      setStartLatLng(null);
    } else {
      setToLocation("");
      setEndLatLng(null);
    }
    setSuggestions([]);
  };

  const handleSelectSuggestion = (item) => {
    if (activeInput === "from") {
      setFromLocation(item.description);
      setStartLatLng([item.geometry.location.lat, item.geometry.location.lng]);
    } else {
      setToLocation(item.description);
      setEndLatLng([item.geometry.location.lat, item.geometry.location.lng]);
    }
    setSuggestions([]);
  };

  const fetchCurrentLocation = async (inputType) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      if (inputType === "from") {
        setStartLatLng([latitude, longitude]);
        setFromLocation("Current Location");
      } else {
        setEndLatLng([latitude, longitude]);
        setToLocation("Current Location");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Failed to fetch current location.");
    }
  };

  return (
    <SafeAreaView
      className="min-h-full px-4 py-4"
      style={{ backgroundColor: COLORS.background }}
      edges={["left", "right"]}
    >
      <View className="bg-[#131d2a] shadow-lg rounded-lg mb-4 p-6">
        {/* From Section */}
        <View className="mb-4 relative">
          <Text
            className="absolute -top-3 left-4 bg-[#131d2a] px-1 text-[#e0e0e0] font-psemibold text-sm"
            style={{ zIndex: 1 }}
          >
            From
          </Text>
          <View className="flex-row items-center border border-[#00b890]/30 rounded-md px-3 py-1.5">
            <MaterialIcons
              name="location-on"
              size={20}
              color="#00b890"
              className="mr-3"
            />
            <TextInput
              placeholder="Starting location"
              placeholderTextColor={COLORS.gray[300]}
              value={fromLocation}
              onChangeText={(text) => handleInputChange(text, "from")}
              className="flex-1 text-[#e0e0e0] text-sm font-pmedium"
              style={{ height: 40 }}
            />
            {fromLocation !== "" && (
              <TouchableOpacity onPress={() => handleClearInput("from")}>
                <MaterialIcons name="close" size={20} color="#888" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => fetchCurrentLocation("from")}
              className="ml-2"
            >
              <MaterialIcons name="gps-fixed" size={20} color="#00b890" />
            </TouchableOpacity>
          </View>
        </View>

        {/* To Section */}
        <View className="relative">
          <Text
            className="absolute -top-3 left-4 bg-[#131d2a] px-1 text-[#e0e0e0] font-psemibold text-sm"
            style={{ zIndex: 1 }}
          >
            To
          </Text>
          <View className="flex-row items-center border border-[#00b890]/30 rounded-md px-3 py-1.5">
            <MaterialIcons
              name="location-on"
              size={20}
              color="#00b890"
              className="mr-3"
            />
            <TextInput
              placeholder="Destination"
              placeholderTextColor={COLORS.gray[300]}
              value={toLocation}
              onChangeText={(text) => handleInputChange(text, "to")}
              className="flex-1 text-[#e0e0e0] text-sm font-pmedium"
              style={{ height: 40 }}
            />
            {toLocation !== "" && (
              <TouchableOpacity onPress={() => handleClearInput("to")}>
                <MaterialIcons name="close" size={20} color="#888" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => fetchCurrentLocation("to")}
              className="ml-2"
            >
              <MaterialIcons name="gps-fixed" size={20} color="#00b890" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Suggestions List */}
      {suggestions.length > 0 ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectSuggestion(item)}
              className="flex-row items-center bg-[#131d2a] shadow-sm rounded-lg px-4 mx-1 mb-2 h-16"
            >
              <MaterialIcons name="place" size={24} color="#00b890" />
              <View className="ml-4 flex-1">
                <Text
                  className="font-medium text-[#e0e0e0] text-base truncate"
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
                <Text
                  className="text-[#e0e0e0]/60 text-sm truncate"
                  numberOfLines={1}
                >
                  {item.structured_formatting?.secondary_text}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 64 }}
        />
      ) : (
        <Text className="text-[#e0e0e0]/60 text-center mt-4 font-psemibold">
          No suggestions available. Try searching for another location.
        </Text>
      )}

      {/* Navigate Button */}
      <TouchableOpacity
        disabled={!startLatLng || !endLatLng}
        className={`absolute bottom-[1rem] left-4 right-4 py-3 shadow-lg rounded-full ${
          startLatLng && endLatLng ? "bg-[#00b890]" : "bg-[#00b890]/50"
        }`}
        onPress={() => {
          router.push({
            pathname: "/(tabs)/travel/routescreen",
            params: {
              startLatLng: JSON.stringify(startLatLng),
              endLatLng: JSON.stringify(endLatLng),
            },
          });
        }}
      >
        <Text className="text-white text-center font-bold text-lg">
          Find Routes
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Travel;