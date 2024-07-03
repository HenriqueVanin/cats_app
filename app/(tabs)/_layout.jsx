import { Tabs } from "expo-router";
import { icons } from "../../constants";
import { View, Text, Image } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <MaterialCommunityIcons name={icon} color={color} size={30} />
      <Text className={`${focused ? "font-bold" : "font-regular"} text-md`}>
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#09C3B8",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#F3F4FF",
          borderTopWidth: 0,
          borderTopColor: "#232533",
          height: 90,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={"home-variant-outline"}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="control"
        options={{
          title: "Control",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={'camera-control'}
              color={color}
              name="Control"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={"calendar"}
              color={color}
              name="Schedule"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: "Audio",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={'volume-high'}
              color={color}
              name="Audio"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
