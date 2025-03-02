import React, { useState } from "react";
import { View, Text, ScrollView, TouchableHighlight } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import CarbonSave from "../carbonsave";

const RouteCard = ({ id, route }) => {
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const modeIcons = {
    WALK: <FontAwesome5 name="walking" size={22} color="#00b890" />,
    BUS: <FontAwesome5 name="bus" size={22} color="#00b890" />,
    RAIL: <FontAwesome5 name="train" size={22} color="#00b890" />,
    SUBWAY: <FontAwesome5 name="subway" size={22} color="#00b890" />,
  };

  const totalTimeInSeconds = route.duration;
  const totalTimeInMinutes = Math.round(totalTimeInSeconds / 60);
  const reachByTime = new Date(
    Date.now() + totalTimeInSeconds * 1000
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const legTimes = route.legs.map((leg) => {
    const startTime = new Date(leg.startTime);
    const endTime = new Date(leg.endTime);
    return {
      mode: leg.mode,
      timeInMinutes: Math.round((endTime - startTime) / 60000),
    };
  });

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setShowLeftFade(contentOffset.x > 0);
    setShowRightFade(
      contentOffset.x < contentSize.width - layoutMeasurement.width
    );
  };

  return (
    <View className="p-5 mb-5 bg-surface rounded-lg shadow-md border border-gray-800">
      <View className="relative">
        {showLeftFade && (
          <LinearGradient
            colors={["rgba(19,29,42,1)", "rgba(19,29,42,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 32,
              zIndex: 1,
            }}
          />
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {legTimes.map((leg, index) => (
            <View key={index} className="flex-row items-center">
              <View className="flex items-center">
                {modeIcons[leg.mode]}
                <Text className="text-sm text-gray-300 mt-2 font-medium">
                  {leg.timeInMinutes} min
                </Text>
              </View>
              {index < legTimes.length - 1 && (
                <FontAwesome5
                  name="arrow-right"
                  size={14}
                  color="#00b890"
                  className="mx-4"
                />
              )}
            </View>
          ))}
        </ScrollView>

        {showRightFade && (
          <LinearGradient
            colors={["rgba(19,29,42,0)", "rgba(19,29,42,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 12,
              zIndex: 1,
            }}
          />
        )}
      </View>

      <View className="h-[1px] bg-gray-800 my-3" />

      <View className="flex-row justify-between items-center my-1">
        <View>
          <Text className="text-sm text-gray-400">
            Total Duration:{" "}
            <Text className="font-semibold text-md text-primary">
              {totalTimeInMinutes} min
            </Text>
          </Text>
        </View>
        <CarbonSave value={route.carbonEmission} />
      </View>

      <View className="h-[1px] bg-gray-800 my-3" />

      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-md text-gray-300 font-semibold">
          Fare: <Text className="text-lg font-bold text-primary">₹80</Text>
        </Text>
        <TouchableHighlight
          onPress={() =>
            router.push({
              pathname: "/(tabs)/travel/mapscreen",
              params: {
                id: id,
                route: JSON.stringify(route),
              },
            })
          }
          underlayColor="#00b890"
          style={{
            backgroundColor: "#00b890",
            borderRadius: 6,
            paddingVertical: 8,
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center justify-between space-x-4 w-[4rem]">
            <Text className="text-md font-medium text-white">Travel</Text>
            <FontAwesome5 name="arrow-right" size={14} color="#ffffff" />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default RouteCard;