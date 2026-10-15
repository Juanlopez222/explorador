import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ColorValue, Platform } from "react-native";
import { colors } from "../../theme";

const icono =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: Platform.OS === "ios" ? 11 : 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Inicio", tabBarIcon: icono("home") }}
      />
      <Tabs.Screen
        name="camara"
        options={{ title: "Cámara", tabBarIcon: icono("camera") }}
      />
      <Tabs.Screen
        name="ubicacion"
        options={{ title: "Ubicación", tabBarIcon: icono("location") }}
      />
      <Tabs.Screen
        name="brujula"
        options={{ title: "Brújula", tabBarIcon: icono("compass") }}
      />
    </Tabs>
  );
}
