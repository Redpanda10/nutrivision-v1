import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        // ✨ Matched the color mapping from your image
        tabBarActiveTintColor: "#16a34a", // Active state is Green
        tabBarInactiveTintColor: "#1a1a1a", // Inactive state is Black (as shown)
        
        // ✨ Replicated the specific label styling
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "700", // Very bold
          marginTop: -5, // Slight adjustment for spacing
          marginBottom: Platform.OS === 'ios' ? 0 : 10, // Account for OS differences
        },

        // ✨ A slightly refined floating bar look based on the image
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 15,
          right: 15,
          elevation: 5, // Shading for Android
          backgroundColor: "#ffffff",
          borderRadius: 25, // Soft, organic curve
          height: 85,
          borderTopWidth: 0,
          // Soft iOS Shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          paddingTop: 10, // Match the icon placement
          paddingBottom: 0, // Keep height consistent
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          // Change the display text to "Home" per the image
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            // Replicated the 'connected dots' icon
            <Ionicons 
              name={focused ? "analytics" : "analytics-outline"} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ focused, color }) => (
            // Replicated the 'camera/scanner' icon
            <Ionicons 
              name={focused ? "camera" : "camera-outline"} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused, color }) => (
            // Replicated the 'clock/time' icon
            <Ionicons 
              name={focused ? "time" : "time-outline"} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            // Replicated the 'person in circle' icon
            <Ionicons 
              name={focused ? "person-circle" : "person-circle-outline"} 
              size={28} // Slightly larger, matches the image
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}