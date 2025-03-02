import React from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const CarbonSave = ({ value }) => {
  return (
    <View className="flex-row items-center px-2 py-1 rounded-lg bg-surface self-start border border-gray-800">
      <FontAwesome5 name="leaf" size={16} color="#00b890" className="mr-2" />
      <View>
        <Text className="text-xs font-medium text-primary">Carbon Save</Text>
        <Text className="text-sm font-bold text-primary">
          {value ? `${value} kg` : "0 kg"}
        </Text>
      </View>
    </View>
  );
};

export default CarbonSave;