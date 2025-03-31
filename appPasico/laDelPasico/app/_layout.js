import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const logo = require("../assets/logo.png");
  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
