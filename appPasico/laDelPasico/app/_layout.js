import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useNotification from "../hooks/useNotification";

export default function Layout() {
  const logo = require("../assets/logo.png");
  const expoPushToken = useNotification();

  console.log("Expo Push Token:", expoPushToken);

  return (
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
