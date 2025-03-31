import { Tabs } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(drawer)"
        options={{
          title: "Inicio",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(escuela)"
        options={{
          headerShown: false,
          title: "Escuela",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="school" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(banda)"
        options={{
          headerShown: false,
          title: "Banda",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="trumpet" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        ScreenOptions={{
          headerShown: false,
        }}
        name="(socios)"
        options={{
          headerShown: false,
          title: "Asociación",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="group" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
