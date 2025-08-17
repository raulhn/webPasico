import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../providers/AuthContext"; // Ajusta la ruta según tu estructura de carpetas
import { use, useEffect } from "react";

export default function Layout() {
  const logo = require("../assets/logo.png");

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },

          header: () => (
            <SafeAreaView edges={["top"]} style={estilos.container}>
              <View style={estilos.logoContainer}>
                <Image
                  source={logo}
                  style={estilos.logo}
                  resizeMode="center"
                ></Image>
              </View>
            </SafeAreaView>
          ),
        }}
      ></Stack>
    </AuthProvider>
  );
}

const estilos = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 70,
  },
});
