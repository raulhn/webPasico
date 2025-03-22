import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Noticias } from "./Noticias";
import { Image } from "react-native";
import { StyleSheet, View } from "react-native";

const logo = require("../assets/logo.png");

export function Main() {
  return (
    <SafeAreaView>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="center"></Image>
      </View>
      <Noticias />
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
