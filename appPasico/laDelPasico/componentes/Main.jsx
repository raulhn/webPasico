import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Noticias } from "./Noticias";
import { Image } from "react-native";
import { StyleSheet, View, Text } from "react-native";
import { Link } from "expo-router";

const logo = require("../assets/logo.png");

export function Main() {
  return (
    <SafeAreaView>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="center"></Image>
      </View>
      <Noticias />
      <View className="bg-blue-500">
        <Link href="/about">Acerca de nosotors</Link>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  logo: {
    width: "80%",
    height: 70,
  },
  noticiasContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
