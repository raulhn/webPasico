import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Noticias } from "./Noticias";
import { Image } from "react-native";
import { StyleSheet, View, Text } from "react-native";
import { MenuPasico } from "./MenuPasico"; // Adjust the path if necessary
import { Link } from "expo-router";
import AppBar from "./appBar.jsx";

const logo = require("../assets/logo.png");

export function Main() {
  return (
    <SafeAreaView>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="center"></Image>
      </View>
      <Text key="noticias" style={styles.titulo}>
        Últimas noticias
      </Text>
      <Noticias />
      <View className="bg-blue-500">
        <MenuPasico></MenuPasico>
      </View>
      <AppBar />
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
  principal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
});
