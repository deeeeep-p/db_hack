import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function Layout() {
  // Define our theme colors in one place for easy updating
  const theme = {
    background: "#0f1924",
    surface: "#182635",
    primary: "#00ffcc",
    primaryTransparent: "rgba(0, 255, 204, 0.1)",
    inactive: "#8b9eb5",
    shadow: "#000",
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 70,
            backgroundColor: theme.surface,
            borderTopWidth: 0,
            paddingVertical: 10,
            paddingHorizontal: 12,
            shadowColor: theme.shadow,
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: -4 },
            shadowRadius: 12,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginBottom: 8,
          },
          tabBarInactiveTintColor: theme.inactive,
          tabBarActiveTintColor: theme.primary,
          tabBarItemStyle: {
            marginHorizontal: 10,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarActiveBackgroundColor: "transparent",
          tabBarInactiveBackgroundColor: "transparent",
        }}
      >
        {/* Home Tab */}
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor:
                    color === theme.primary
                      ? theme.primaryTransparent
                      : "transparent",
                  borderRadius: 10,
                  padding: 4, // Reduced padding to 4 from 6
                }}
              >
                <Ionicons name="home" color={color} size={22} />
              </View>
            ),
            tabBarLabel: "Home",
          }}
        />

        {/* Projects Tab (formerly Travel) */}
        <Tabs.Screen
          name="travel"
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor:
                    color === theme.primary
                      ? theme.primaryTransparent
                      : "transparent",
                  borderRadius: 10,
                  padding: 4, // Reduced padding to 4 from 6
                }}
              >
                <Ionicons name="airplane" color={color} size={22} />
              </View>
            ),
            tabBarLabel: "Travel",
            headerShown: false,
          }}
        />

        {/* Investments Tab (formerly Tickets) */}
        <Tabs.Screen
          name="community"
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor:
                    color === theme.primary
                      ? theme.primaryTransparent
                      : "transparent",
                  borderRadius: 10,
                  padding: 4, // Reduced padding to 4 from 6
                }}
              >
                <Ionicons name="trending-up" color={color} size={22} />
              </View>
            ),
            tabBarLabel: "Community",
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="projects"
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor:
                    color === theme.primary
                      ? theme.primaryTransparent
                      : "transparent",
                  borderRadius: 10,
                  padding: 4, // Reduced padding to 4 from 6
                }}
              >
                <Ionicons name="business-outline" color={color} size={22} />
              </View>
            ),
            tabBarLabel: "Projects",
            headerShown: false,
          }}
        />

        {/* Account Tab */}
        <Tabs.Screen
          name="products"
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor:
                    color === theme.primary
                      ? theme.primaryTransparent
                      : "transparent",
                  borderRadius: 10,
                  padding: 4, // Reduced padding to 4 from 6
                }}
              >
                <Ionicons name="cart" color={color} size={22} />
              </View>
            ),
            tabBarLabel: "Products",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="rewards"
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor:
                    color === theme.primary
                      ? theme.primaryTransparent
                      : "transparent",
                  borderRadius: 10,
                  padding: 4, // Reduced padding to 4 from 6
                }}
              >
                <Ionicons name="trophy" color={color} size={22} />
              </View>
            ),
            tabBarLabel: "Rewards",
          }}
        />
      </Tabs>
      <StatusBar backgroundColor={theme.background} style="light" />
    </>
  );
}
